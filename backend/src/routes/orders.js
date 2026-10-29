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
    status: order.status === 'READY' ? 'Ready' : 'in process',
    subtotal: Number(order.subtotal),
    taxAmount: Number(order.taxAmount),
    discountAmount: Number(order.discountAmount),
    totalAmount: Number(order.totalAmount),
    items: (order.orderItems || []).map((item) => ({
      id: item.itemId ? `dish-${item.itemId}` : `dish-${item.id}`,
      dbId: item.id,
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
  while (exists && attempts < 10) {
    attempts++;
    const rand = Math.floor(1000 + Math.random() * 9000);
    code = `ORD-${Date.now().toString().slice(-4)}${rand}`.slice(0, 20);
    const found = await prisma.order.findUnique({ where: { orderCode: code } });
    if (!found) exists = false;
  }
  return code || `ORD-${Date.now()}`.slice(0, 20);
}

// Helper to safely resolve menu item foreign keys (nullable if not in DB)
async function resolveItemIds(items = []) {
  const ids = items
    .map((i) => {
      const raw = i.id ? String(i.id).replace('dish-', '') : null;
      return raw && !isNaN(raw) ? parseInt(raw) : null;
    })
    .filter(Boolean);

  let validIds = new Set();
  if (ids.length > 0) {
    try {
      const validRecords = await prisma.menuItem.findMany({
        where: { id: { in: ids } },
        select: { id: true },
      });
      validIds = new Set(validRecords.map((r) => r.id));
    } catch {
      validIds = new Set();
    }
  }

  return items.map((i) => {
    const raw = i.id ? String(i.id).replace('dish-', '') : null;
    const parsed = raw && !isNaN(raw) ? parseInt(raw) : null;
    return {
      itemId: parsed && validIds.has(parsed) ? parsed : null,
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

// POST /api/orders (Create Order)
router.post('/', async (req, res) => {
  try {
    const { customer, table, orderType, status, items = [], notes } = req.body;

    const settings = await prisma.restaurantSettings.findFirst({ where: { id: 1 } });
    const taxRate = settings ? Number(settings.defaultTaxRate) : 10.0;
    const discountRate = settings ? Number(settings.defaultDiscountRate) : 20.0;

    const subtotal = items.reduce((sum, item) => sum + Number(item.price || 0) * (item.qty || 1), 0);
    const taxAmount = subtotal * (taxRate / 100);
    const discountAmount = subtotal * (discountRate / 100);
    const totalAmount = Math.max(0, subtotal + taxAmount - discountAmount);

    let tableRecord = null;
    if (table && table !== 'Takeaway') {
      tableRecord = await prisma.restaurantTable.findUnique({
        where: { tableNumber: table },
      });
      if (tableRecord) {
        await prisma.restaurantTable.update({
          where: { id: tableRecord.id },
          data: { status: 'OCCUPIED' },
        });
      }
    }

    const orderCode = await generateUniqueOrderCode();
    const preparedItems = await resolveItemIds(items);

    const newOrder = await prisma.order.create({
      data: {
        orderCode,
        tableId: tableRecord?.id || null,
        customerName: (customer || 'Guest').trim(),
        orderType: mapOrderType(orderType),
        status: mapOrderStatus(status),
        subtotal,
        taxRate,
        taxAmount,
        discountAmount,
        totalAmount,
        orderItems: {
          create: preparedItems,
        },
      },
      include: {
        table: true,
        orderItems: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    res.status(201).json(formatOrder(newOrder));
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// PUT /api/orders/:id (Update Order)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { customer, table, orderType, status, items = [], notes } = req.body;

    const existing = await prisma.order.findFirst({
      where: {
        OR: [
          { orderCode: id },
          ...(isNaN(id) ? [] : [{ id: parseInt(id) }]),
        ],
      },
      include: { table: true },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const settings = await prisma.restaurantSettings.findFirst({ where: { id: 1 } });
    const taxRate = settings ? Number(settings.defaultTaxRate) : 10.0;
    const discountRate = settings ? Number(settings.defaultDiscountRate) : 20.0;

    const subtotal = items.reduce((sum, item) => sum + Number(item.price || 0) * (item.qty || 1), 0);
    const taxAmount = subtotal * (taxRate / 100);
    const discountAmount = subtotal * (discountRate / 100);
    const totalAmount = Math.max(0, subtotal + taxAmount - discountAmount);

    let tableId = existing.tableId;
    if (table && (!existing.table || existing.table.tableNumber !== table)) {
      if (table === 'Takeaway') {
        if (existing.tableId) {
          await prisma.restaurantTable.update({
            where: { id: existing.tableId },
            data: { status: 'AVAILABLE' },
          });
        }
        tableId = null;
      } else {
        const newTable = await prisma.restaurantTable.findUnique({
          where: { tableNumber: table },
        });
        if (newTable) {
          if (existing.tableId && existing.tableId !== newTable.id) {
            await prisma.restaurantTable.update({
              where: { id: existing.tableId },
              data: { status: 'AVAILABLE' },
            });
          }
          await prisma.restaurantTable.update({
            where: { id: newTable.id },
            data: { status: 'OCCUPIED' },
          });
          tableId = newTable.id;
        }
      }
    }

    // Delete existing items and recreate with new quantities
    await prisma.orderItem.deleteMany({
      where: { orderId: existing.id },
    });

    const preparedItems = await resolveItemIds(items);

    const updated = await prisma.order.update({
      where: { id: existing.id },
      data: {
        tableId,
        customerName: customer !== undefined ? customer.trim() : existing.customerName,
        orderType: orderType ? mapOrderType(orderType) : existing.orderType,
        status: status ? mapOrderStatus(status) : existing.status,
        subtotal,
        taxAmount,
        discountAmount,
        totalAmount,
        orderItems: {
          create: preparedItems,
        },
      },
      include: {
        table: true,
        orderItems: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    res.json(formatOrder(updated));
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// DELETE /api/orders/:id (Delete / Cancel Order)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.order.findFirst({
      where: {
        OR: [
          { orderCode: id },
          ...(isNaN(id) ? [] : [{ id: parseInt(id) }]),
        ],
      },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (existing.tableId) {
      // Free table
      await prisma.restaurantTable.update({
        where: { id: existing.tableId },
        data: { status: 'AVAILABLE' },
      });
    }

    await prisma.orderItem.deleteMany({
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
    const { paymentMethod = 'Cash', orderData, table: requestedTable } = req.body;
    const validMethod = mapPaymentMethod(paymentMethod);

    // 1. Look up existing order by orderCode, numeric id, or table
    let order = await prisma.order.findFirst({
      where: {
        OR: [
          { orderCode: id },
          ...(isNaN(id) ? [] : [{ id: parseInt(id) }]),
          ...(requestedTable ? [{ table: { tableNumber: requestedTable }, status: { in: ['PENDING', 'IN_PROCESS', 'READY'] } }] : []),
          ...(id.startsWith('T') ? [{ table: { tableNumber: id }, status: { in: ['PENDING', 'IN_PROCESS', 'READY'] } }] : []),
        ],
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

    const settings = await prisma.restaurantSettings.findFirst({ where: { id: 1 } });
    const taxRate = settings ? Number(settings.defaultTaxRate) : 10.0;
    const discountRate = settings ? Number(settings.defaultDiscountRate) : 20.0;

    // 2. If order does NOT exist in DB yet, create it directly
    if (!order) {
      const payload = orderData || req.body;
      const items = payload.items || [];
      const tableName = requestedTable || payload.table || (id.startsWith('T') ? id : null);

      let tableRecord = null;
      if (tableName && tableName !== 'Takeaway') {
        tableRecord = await prisma.restaurantTable.findUnique({
          where: { tableNumber: tableName },
        });
      }

      const subtotal = items.reduce((sum, item) => sum + Number(item.price || 0) * (item.qty || 1), 0);
      const taxAmount = subtotal * (taxRate / 100);
      const discountAmount = subtotal * (discountRate / 100);
      const totalAmount = Math.max(0, subtotal + taxAmount - discountAmount);

      const orderCode = await generateUniqueOrderCode();
      const preparedItems = await resolveItemIds(items);

      order = await prisma.order.create({
        data: {
          orderCode,
          tableId: tableRecord?.id || null,
          customerName: (payload.customer || 'Guest').trim(),
          orderType: mapOrderType(payload.orderType),
          status: 'COMPLETED',
          subtotal,
          taxRate,
          taxAmount,
          discountAmount,
          totalAmount,
          orderItems: {
            create: preparedItems,
          },
        },
        include: {
          table: true,
          orderItems: {
            include: {
              menuItem: true,
            },
          },
        },
      });
    }

    // 3. Upsert payment record in PostgreSQL
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

    // 4. Mark order as COMPLETED
    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'COMPLETED' },
    });

    // 5. Free the table
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
