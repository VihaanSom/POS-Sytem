import { Router } from 'express';
import prisma from '../prisma.js';

const router = Router();

// GET /api/categories
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { displayOrder: 'asc' },
    });

    const formatted = categories.map((c) => ({
      id: c.slug,
      dbId: c.id,
      name: c.name,
      icon: c.iconUrl || '',
      displayOrder: c.displayOrder,
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Fetch categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

export default router;
