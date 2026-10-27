import { Router } from 'express';
import prisma from '../prisma.js';

const router = Router();

// GET /api/settings
router.get('/', async (req, res) => {
  try {
    let settings = await prisma.restaurantSettings.findFirst({
      where: { id: 1 },
    });

    if (!settings) {
      settings = await prisma.restaurantSettings.create({
        data: {
          id: 1,
          restaurantName: 'DashPoint Restaurant',
          defaultTaxRate: 10.0,
          defaultDiscountRate: 20.0,
          currencySymbol: '$',
        },
      });
    }

    res.json({
      tax: Number(settings.defaultTaxRate),
      discount: Number(settings.defaultDiscountRate),
      currency: settings.currencySymbol,
      restaurantName: settings.restaurantName,
    });
  } catch (error) {
    console.error('Fetch settings error:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// PUT /api/settings
router.put('/', async (req, res) => {
  try {
    const { tax, discount, currency, restaurantName } = req.body;

    const updated = await prisma.restaurantSettings.upsert({
      where: { id: 1 },
      update: {
        ...(tax !== undefined ? { defaultTaxRate: Number(tax) } : {}),
        ...(discount !== undefined ? { defaultDiscountRate: Number(discount) } : {}),
        ...(currency ? { currencySymbol: currency } : {}),
        ...(restaurantName ? { restaurantName } : {}),
      },
      create: {
        id: 1,
        restaurantName: restaurantName || 'DashPoint Restaurant',
        defaultTaxRate: Number(tax ?? 10.0),
        defaultDiscountRate: Number(discount ?? 20.0),
        currencySymbol: currency || '$',
      },
    });

    res.json({
      tax: Number(updated.defaultTaxRate),
      discount: Number(updated.defaultDiscountRate),
      currency: updated.currencySymbol,
      restaurantName: updated.restaurantName,
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

export default router;
