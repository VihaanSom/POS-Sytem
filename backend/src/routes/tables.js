import { Router } from 'express';
import prisma from '../prisma.js';

const router = Router();

// GET /api/tables
router.get('/', async (req, res) => {
  try {
    const dbTables = await prisma.restaurantTable.findMany({
      orderBy: { id: 'asc' },
      include: {
        orders: {
          where: {
            status: { in: ['PENDING', 'IN_PROCESS', 'READY'] },
          },
          include: {
            orderItems: {
              include: {
                menuItem: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    // Format tables for frontend consumption
    const tables = dbTables.map((t) => {
      const activeOrder = t.orders.length > 0 ? t.orders[0] : null;

      let formattedOrder = null;
      if (activeOrder) {
        formattedOrder = {
          id: activeOrder.orderCode,
          dbId: activeOrder.id,
          table: t.tableNumber,
          customer: activeOrder.customerName,
          orderType: activeOrder.orderType.toLowerCase().replace('_', '-'),
          status: activeOrder.status === 'READY' ? 'Ready' : 'in process',
          items: activeOrder.orderItems.map((item) => ({
            id: item.itemId ? `dish-${item.itemId}` : `item-${item.id}`,
            dbId: item.id,
            name: item.itemName,
            price: Number(item.unitPrice),
            qty: item.quantity,
            image: item.menuItem?.imageUrl || 'https://via.placeholder.com/44x44/eff6ff/2563eb?text=Food',
          })),
        };
      }

      return {
        id: t.tableNumber,
        dbId: t.id,
        capacity: t.seatingCapacity,
        isOccupied: Boolean(formattedOrder),
        order: formattedOrder,
      };
    });

    res.json(tables);
  } catch (error) {
    console.error('Fetch tables error:', error);
    res.status(500).json({ error: 'Failed to fetch tables' });
  }
});

export default router;
