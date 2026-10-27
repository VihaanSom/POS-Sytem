import { Router } from 'express';
import prisma from '../prisma.js';

const router = Router();

// GET /api/reservations
router.get('/', async (req, res) => {
  try {
    const reservations = await prisma.reservation.findMany({
      where: {
        status: { in: ['CONFIRMED', 'SEATED'] },
      },
      include: {
        table: true,
      },
      orderBy: { reservationTime: 'asc' },
    });

    const formatted = reservations.map((r) => {
      // Format time as HH:mm if stored as Date
      let timeStr = '19:00';
      if (r.reservationTime) {
        const d = new Date(r.reservationTime);
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        timeStr = `${hours}:${minutes}`;
      }

      return {
        id: r.id,
        name: r.customerName,
        table: r.table?.tableNumber || 'T1',
        tableId: r.tableId,
        guests: r.guestCount,
        time: timeStr,
        phone: r.customerPhone || '',
        status: r.status,
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error('Fetch reservations error:', error);
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
});

// POST /api/reservations
router.post('/', async (req, res) => {
  try {
    const { name, table, guests = 2, time = '19:00', phone, notes } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Customer name is required' });
    }

    let tableRecord = null;
    if (table) {
      tableRecord = await prisma.restaurantTable.findUnique({
        where: { tableNumber: table },
      });
    }

    // Parse time string 'HH:mm' to today's Date
    let reservationDate = new Date();
    if (time && time.includes(':')) {
      const [h, m] = time.split(':');
      reservationDate.setHours(parseInt(h) || 19, parseInt(m) || 0, 0, 0);
    }

    const created = await prisma.reservation.create({
      data: {
        customerName: name.trim(),
        customerPhone: phone?.trim() || null,
        tableId: tableRecord?.id || null,
        guestCount: Number(guests) || 2,
        reservationTime: reservationDate,
        status: 'CONFIRMED',
        notes: notes || null,
      },
      include: {
        table: true,
      },
    });

    res.status(201).json({
      id: created.id,
      name: created.customerName,
      table: created.table?.tableNumber || table || 'T1',
      tableId: created.tableId,
      guests: created.guestCount,
      time: time || '19:00',
      phone: created.customerPhone || '',
      status: created.status,
    });
  } catch (error) {
    console.error('Create reservation error:', error);
    res.status(500).json({ error: 'Failed to create reservation' });
  }
});

// DELETE /api/reservations/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const resId = parseInt(id);

    if (isNaN(resId)) {
      return res.status(400).json({ error: 'Valid reservation ID required' });
    }

    await prisma.reservation.delete({
      where: { id: resId },
    });

    res.json({ message: 'Reservation removed successfully', id: resId });
  } catch (error) {
    console.error('Delete reservation error:', error);
    res.status(500).json({ error: 'Failed to delete reservation' });
  }
});

export default router;
