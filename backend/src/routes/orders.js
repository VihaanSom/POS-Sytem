import { Router } from 'express';
import prisma from '../prisma.js';

const router = Router();

// Helper to format an order for frontend
function formatOrder(order) {
  const tableNumber = order.table ? order.table.tableNumber : order.tableId ? `T${order.tableId}` : 'Takeaway';
  return {
    id: order.orderCode,
    dbId: order.id,
    table: tableNumber,
    customer: order.customerName,
    orderType: order.orderType.toLowerCase().replace('_', '-'),
    status: order.status === 'READY' ? 'Ready' : order.status === 'COMPLETED' ? 'Completed' : 'in process',
    subtotal: Number(order.subtotal),
    taxAmount: Number(order.taxAmount),
    discountAmount: Number(order.discountAmount),
    totalAmount: Number(order.totalAmount),
    items: (order.orderItems || []).map((item) => ({
      id: item.itemId ? `dish-${item.itemId}` : `item-${item.id}`,
      dbId: item.itemId || item.id,
      name: item.itemName,
      price: Number(item.unitPrice),
      qty: item.quantity,
      image: item.menuItem?.imageUrl || 'https://via.placeholder.com/44x44/eff6ff/2563eb?text=Food',
    })),
  };
}

// Helper to map paymentMethod string to Prisma enum
function mapPaymentMethod(method) {
  const m = (method || '').toUpperCase();
  if (m.includes('CARD') || m.includes('DEBIT') || m.includes('CREDIT')) return 'CARD';
  if (m.includes('WALLET') || m.includes('UPI') || m.includes('ONLINE') || m.includes('E-WALLET')) return 'UPI';
  return 'CASH';
}

// Generate unique order code
async function generateUniqueOrderCode() {
  let code = '';
  let exists = true;
  let attempts = 0;
  while (exists && attempts < 15) {
    attempts++;
    const rand = Math.floor(1000 + Math.random() * 9000);
    code = `ORD-${Date.now().toString().slice(-4)}${rand}`.slice(0, 20);
    const found = await prisma.order.findUnique({ where: { orderCode: code } });
    if (!found) exists = false;
  }
  return code || `ORD-${Date.now()}`.slice(0, 20);
}

// Helper to safely resolve menu item foreign keys (linking to MenuItem)
async function resolveItemIds(items = []) {
  if (!items || items.length === 0) return [];

  let allMenuItems = [];
  try {
    allMenuItems = await prisma.menuItem.findMany({
      select: { id: true, name: true }
    });
  } catch (err) {
    console.warn('Could not query menu items for FK resolution:', err.message);
  }

  const idMap = new Map(allMenuItems.map((m) => [m.id, m.id]));
  const nameMap = new Map(allMenuItems.map((m) => [m.name.toLowerCase().trim(), m.id]));

  return items.map((i) => {
    let resolvedId = null;

    // 1. Direct numeric dbId or id
    if (i.dbId && idMap.has(Number(i.dbId))) {
      resolvedId = Number(i.dbId);
    } else if (i.id) {
      const numericId = parseInt(String(i.id).replace('dish-', ''));
      if (!isNaN(numericId) && idMap.has(numericId)) {
        resolvedId = numericId;
      }
    }

    // 2. Fallback: match by dish name
    if (!resolvedId && i.name) {
      const cleanName = String(i.name).toLowerCase().trim();
      if (nameMap.has(cleanName)) {
        resolvedId = nameMap.get(cleanName);
      }
    }

    return {
      itemId: resolvedId, // Valid foreign key if found, safely null if custom dish
      itemName: i.name || 'Dish Item',
      unitPrice: Number(i.price || 0),
      quantity: Number(i.qty || 1),
      lineTotal: Number(i.price || 0) * Number(i.qty || 1),
      notes: i.notes || null,
    };
  });
}

// Helper to map orderType string
function mapOrderType(typeStr) {
  const t = (typeStr || '').toLowerCase();
  if (t === 'take-away' || t === 'takeaway' || t === 'take_out') return 'TAKE_OUT';
  if (t === 'delivery') return 'DELIVERY';
  return 'DINE_IN';
}

// Helper to map status string
function mapOrderStatus(statusStr) {
  const s = (statusStr || '').toLowerCase();
  if (s === 'ready') return 'READY';
  if (s === 'completed') return 'COMPLETED';
  if (s === 'cancelled') return 'CANCELLED';
  return 'IN_PROCESS';
}

// Helper to find restaurant table record safely
async function findTableRecord(table) {
  if (!table || table === 'Takeaway') return null;
  const clean = String(table).trim().toUpperCase();
  return await prisma.restaurantTable.findFirst({
    where: {
      OR: [
        { tableNumber: clean },
        { tableNumber: clean.replace('TABLE ', 'T') },
        ...(isNaN(clean.replace('T', '')) ? [] : [{ id: parseInt(clean.replace('T', '')) }]),
      ],
    },
  });
}

// GET /api/orders (Active orders)
router.get('/', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        status: { in: ['PENDING', 'IN_PROCESS', 'READY'] },
      },
      include: {
        table: true,
        orderItems: {
          include: {
            menuItem: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders.map(formatOrder));
  } catch (error) {
    console.error('Fetch orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// POST /api/orders (Create or Update Active Order for Table)
router.post('/', async (req, res) => {
  try {
    const { customer, table, orderType, status, items = [], notes } = req.body;
    const tableRecord = await findTableRecord(table);

    // If an active order already exists on this table, update it instead of creating duplicates
    let existing = null;
    if (tableRecord) {
      existing = await prisma.order.findFirst({
        where: {
          tableId: tableRecord.id,
          status: { in: ['PENDING', 'IN_PROCESS', 'READY'] },
        },
        include: { table: true },
        orderBy: { createdAt: 'desc' },
      });
    }

    const settings = await prisma.restaurantSettings.findFirst({ where: { id: 1 } });
    const taxRate = settings ? Number(settings.defaultTaxRate) : 10.0;
    const discountRate = settings ? Number(settings.defaultDiscountRate) : 20.0;

    const subtotal = items.reduce((sum, item) => sum + Number(item.price || 0) * (item.qty || 1), 0);
    const taxAmount = subtotal * (taxRate / 100);
    const discountAmount = subtotal * (discountRate / 100);
    const totalAmount = Math.max(0, subtotal + taxAmount - discountAmount);
    const preparedItems = await resolveItemIds(items);
    const userId = req.user?.id || (req.body.userId ? parseInt(req.body.userId) : null) || 1;

    let resultOrder;
    if (existing) {
      await prisma.orderItem.deleteMany({ where: { orderId: existing.id } });
      resultOrder = await prisma.order.update({
        where: { id: existing.id },
        data: {
          userId: existing.userId || userId,
          customerName: customer !== undefined ? customer.trim() : existing.customerName,
          orderType: orderType ? mapOrderType(orderType) : existing.orderType,
          status: status ? mapOrderStatus(status) : existing.status,
          subtotal,
          taxRate,
          taxAmount,
          discountAmount,
          totalAmount,
          orderItems: { create: preparedItems },
        },
        include: {
          table: true,
          orderItems: { include: { menuItem: true } },
        },
      });
    } else {
      if (tableRecord) {
        await prisma.restaurantTable.update({
          where: { id: tableRecord.id },
          data: { status: 'OCCUPIED' },
        });
      }

      const orderCode = await generateUniqueOrderCode();
      resultOrder = await prisma.order.create({
        data: {
          orderCode,
          tableId: tableRecord?.id || null,
          userId,
          customerName: (customer || `Guest (${tableRecord?.tableNumber || 'Takeaway'})`).trim(),
          orderType: mapOrderType(orderType),
          status: mapOrderStatus(status),
          subtotal,
          taxRate,
          taxAmount,
          discountAmount,
          totalAmount,
          orderItems: { create: preparedItems },
        },
        include: {
          table: true,
          orderItems: { include: { menuItem: true } },
        },
      });
    }

    res.status(201).json(formatOrder(resultOrder));
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order: ' + error.message });
  }
});

// PUT /api/orders/:id (Idempotent Update or Upsert Order)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { customer, table, orderType, status, items = [], notes } = req.body;
    const tableRecord = await findTableRecord(table);

    // Look for existing order by orderCode, numeric id, or active table order
    let existing = await prisma.order.findFirst({
      where: {
        OR: [
          { orderCode: id },
          ...(isNaN(id) ? [] : [{ id: parseInt(id) }]),
          ...(tableRecord ? [{ tableId: tableRecord.id, status: { in: ['PENDING', 'IN_PROCESS', 'READY'] } }] : []),
        ],
      },
      include: { table: true },
      orderBy: { createdAt: 'desc' },
    });

    const settings = await prisma.restaurantSettings.findFirst({ where: { id: 1 } });
    const taxRate = settings ? Number(settings.defaultTaxRate) : 10.0;
    const discountRate = settings ? Number(settings.defaultDiscountRate) : 20.0;

    const subtotal = items.reduce((sum, item) => sum + Number(item.price || 0) * (item.qty || 1), 0);
    const taxAmount = subtotal * (taxRate / 100);
    const discountAmount = subtotal * (discountRate / 100);
    const totalAmount = Math.max(0, subtotal + taxAmount - discountAmount);
    const preparedItems = await resolveItemIds(items);
    const userId = req.user?.id || (req.body.userId ? parseInt(req.body.userId) : null) || 1;

    let orderResult;
    if (existing) {
      let tableId = existing.tableId;
      if (tableRecord && existing.tableId !== tableRecord.id) {
        if (existing.tableId) {
          await prisma.restaurantTable.update({
            where: { id: existing.tableId },
            data: { status: 'AVAILABLE' },
          });
        }
        await prisma.restaurantTable.update({
          where: { id: tableRecord.id },
          data: { status: 'OCCUPIED' },
        });
        tableId = tableRecord.id;
      }

      await prisma.orderItem.deleteMany({
        where: { orderId: existing.id },
      });

      orderResult = await prisma.order.update({
        where: { id: existing.id },
        data: {
          tableId,
          userId: existing.userId || userId,
          customerName: customer !== undefined ? customer.trim() : existing.customerName,
          orderType: orderType ? mapOrderType(orderType) : existing.orderType,
          status: status ? mapOrderStatus(status) : existing.status,
          subtotal,
          taxRate,
          taxAmount,
          discountAmount,
          totalAmount,
          orderItems: { create: preparedItems },
        },
        include: {
          table: true,
          orderItems: { include: { menuItem: true } },
        },
      });
    } else {
      // Upsert: Create order if not exists
      const orderCode = id && id.startsWith('ORD-') ? id : await generateUniqueOrderCode();
      if (tableRecord) {
        await prisma.restaurantTable.update({
          where: { id: tableRecord.id },
          data: { status: 'OCCUPIED' },
        });
      }

      orderResult = await prisma.order.create({
        data: {
          orderCode,
          tableId: tableRecord?.id || null,
          userId,
          customerName: (customer || `Guest (${tableRecord?.tableNumber || 'Takeaway'})`).trim(),
          orderType: mapOrderType(orderType),
          status: mapOrderStatus(status),
          subtotal,
          taxRate,
          taxAmount,
          discountAmount,
          totalAmount,
          orderItems: { create: preparedItems },
        },
        include: {
          table: true,
          orderItems: { include: { menuItem: true } },
        },
      });
    }

    res.json(formatOrder(orderResult));
  } catch (error) {
    console.error('Update/upsert order error:', error);
    res.status(500).json({ error: 'Failed to update order: ' + error.message });
  }
});

// DELETE /api/orders/:id (Idempotent Delete / Cancel Order)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.order.findFirst({
      where: {
        OR: [
          { orderCode: id },
          ...(isNaN(id) ? [] : [{ id: parseInt(id) }]),
          ...(id.startsWith('T') ? [{ table: { tableNumber: id.toUpperCase() }, status: { in: ['PENDING', 'IN_PROCESS', 'READY'] } }] : []),
        ],
      },
    });

    if (!existing) {
      // Idempotent: already deleted
      return res.json({ message: 'Order already removed or deleted', id });
    }

    if (existing.tableId) {
      await prisma.restaurantTable.update({
        where: { id: existing.tableId },
        data: { status: 'AVAILABLE' },
      });
    }

    await prisma.orderItem.deleteMany({
      where: { orderId: existing.id },
    });

    await prisma.payment.deleteMany({
      where: { orderId: existing.id },
    });

    await prisma.order.delete({
      where: { id: existing.id },
    });

    res.json({ message: 'Order deleted successfully', id: existing.orderCode });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

// POST /api/orders/:id/pay (Settle Bill & Pay)
router.post('/:id/pay', async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentMethod = 'Cash', orderData, table: requestedTable, items: directItems } = req.body;
    const validMethod = mapPaymentMethod(paymentMethod);

    const targetTableStr = requestedTable || orderData?.table || (id.startsWith('T') ? id : null);
    const tableRecord = await findTableRecord(targetTableStr);

    // 1. Look up existing order
    let order = await prisma.order.findFirst({
      where: {
        OR: [
          { orderCode: id },
          ...(isNaN(id) ? [] : [{ id: parseInt(id) }]),
          ...(tableRecord ? [{ tableId: tableRecord.id, status: { in: ['PENDING', 'IN_PROCESS', 'READY'] } }] : []),
        ],
      },
      include: {
        table: true,
        orderItems: { include: { menuItem: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const settings = await prisma.restaurantSettings.findFirst({ where: { id: 1 } });
    const taxRate = settings ? Number(settings.defaultTaxRate) : 10.0;
    const discountRate = settings ? Number(settings.defaultDiscountRate) : 20.0;
    const userId = req.user?.id || (req.body.userId ? parseInt(req.body.userId) : null) || 1;

    const payload = orderData || req.body;
    const items = (payload.items && payload.items.length > 0) ? payload.items : (directItems || order?.orderItems || []);

    const subtotal = items.reduce((sum, item) => sum + Number(item.price || item.unitPrice || 0) * (item.qty || item.quantity || 1), 0);
    const taxAmount = subtotal * (taxRate / 100);
    const discountAmount = subtotal * (discountRate / 100);
    const totalAmount = Math.max(0, subtotal + taxAmount - discountAmount);
    const preparedItems = await resolveItemIds(items);

    if (order) {
      if (items.length > 0) {
        await prisma.orderItem.deleteMany({ where: { orderId: order.id } });
        order = await prisma.order.update({
          where: { id: order.id },
          data: {
            subtotal,
            taxAmount,
            discountAmount,
            totalAmount,
            status: 'COMPLETED',
            orderItems: { create: preparedItems },
          },
          include: {
            table: true,
            orderItems: { include: { menuItem: true } },
          },
        });
      }
    } else {
      const orderCode = id && id.startsWith('ORD-') ? id : await generateUniqueOrderCode();
      order = await prisma.order.create({
        data: {
          orderCode,
          tableId: tableRecord?.id || null,
          userId,
          customerName: (payload.customer || `Guest (${tableRecord?.tableNumber || 'Takeaway'})`).trim(),
          orderType: mapOrderType(payload.orderType),
          status: 'COMPLETED',
          subtotal,
          taxRate,
          taxAmount,
          discountAmount,
          totalAmount,
          orderItems: { create: preparedItems },
        },
        include: {
          table: true,
          orderItems: { include: { menuItem: true } },
        },
      });
    }

    // Upsert payment in PostgreSQL
    await prisma.payment.upsert({
      where: { orderId: order.id },
      update: {
        paymentMethod: validMethod,
        amountPaid: order.totalAmount,
        paymentStatus: 'COMPLETED',
        paidAt: new Date(),
      },
      create: {
        orderId: order.id,
        paymentMethod: validMethod,
        amountPaid: order.totalAmount,
        paymentStatus: 'COMPLETED',
        paidAt: new Date(),
      },
    });

    // Mark order COMPLETED
    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'COMPLETED' },
    });

    // Free table
    if (order.tableId) {
      await prisma.restaurantTable.update({
        where: { id: order.tableId },
        data: { status: 'AVAILABLE' },
      });
    }

    const formatted = formatOrder(order);
    const receipt = {
      orderId: order.orderCode,
      table: formatted.table,
      customer: order.customerName,
      orderType: formatted.orderType,
      items: formatted.items,
      subtotal: Number(order.subtotal),
      taxPercent: Number(order.taxRate),
      taxAmount: Number(order.taxAmount),
      discountPercent: discountRate,
      discountAmount: Number(order.discountAmount),
      grandTotal: Number(order.totalAmount),
      paymentMethod,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }),
    };

    res.json({
      message: 'Payment processed successfully',
      receipt,
    });
  } catch (error) {
    console.error('Process payment error:', error);
    res.status(500).json({ error: 'Failed to process payment: ' + (error.message || 'Server error') });
  }
});

export default router;
