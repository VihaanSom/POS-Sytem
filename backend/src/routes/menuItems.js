import { Router } from 'express';
import prisma from '../prisma.js';

const router = Router();

// GET /api/menu-items
router.get('/', async (req, res) => {
  try {
    const items = await prisma.menuItem.findMany({
      where: { isAvailable: true },
      include: {
        category: true,
      },
      orderBy: { id: 'asc' },
    });

    const formatted = items.map((item) => ({
      id: `dish-${item.id}`,
      dbId: item.id,
      name: item.name,
      category: item.category.slug,
      categoryName: item.category.name,
      price: Number(item.price),
      desc: item.description || '',
      image: item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      badge: item.badge || '',
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Fetch menu items error:', error);
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
});

// POST /api/menu-items (Add custom dish)
router.post('/', async (req, res) => {
  try {
    const { name, category, price, desc, image, badge } = req.body;

    if (!name || price === undefined || isNaN(price)) {
      return res.status(400).json({ error: 'Name and valid price are required' });
    }

    const catSlug = (category || 'burger').toLowerCase();
    let cat = await prisma.category.findUnique({
      where: { slug: catSlug },
    });

    if (!cat) {
      cat = await prisma.category.create({
        data: {
          name: catSlug.charAt(0).toUpperCase() + catSlug.slice(1),
          slug: catSlug,
          displayOrder: 99,
        },
      });
    }

    const created = await prisma.menuItem.create({
      data: {
        name: name.trim(),
        categoryId: cat.id,
        price: Number(price),
        description: desc?.trim() || '',
        imageUrl: image?.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
        badge: badge?.trim() || 'New',
        isAvailable: true,
      },
      include: {
        category: true,
      },
    });

    res.status(201).json({
      id: `dish-${created.id}`,
      dbId: created.id,
      name: created.name,
      category: created.category.slug,
      categoryName: created.category.name,
      price: Number(created.price),
      desc: created.description,
      image: created.imageUrl,
      badge: created.badge,
    });
  } catch (error) {
    console.error('Create menu item error:', error);
    res.status(500).json({ error: 'Failed to create menu item' });
  }
});

export default router;
