import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dashpoint_jwt_super_secret_pos_key_2026';

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const identifier = (email || username || '').trim();

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Email/username and password are required' });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: identifier, mode: 'insensitive' } },
          { username: { equals: identifier, mode: 'insensitive' } },
        ],
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash).catch(() => false);
    // Allow fallback check in case of legacy plain-text seed
    const isValid = isMatch || password === user.passwordHash;

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, restaurant, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email: trimmedEmail },
          { username: trimmedEmail.split('@')[0] }
        ]
      }
    });

    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const username = trimmedEmail.split('@')[0] + Math.floor(Math.random() * 1000);

    const newUser = await prisma.user.create({
      data: {
        fullName: name.trim(),
        username: username.slice(0, 50),
        email: trimmedEmail,
        passwordHash: hashedPassword,
        role: 'MANAGER',
      },
    });

    // If restaurant name was provided, optionally update settings restaurant name
    if (restaurant && restaurant.trim()) {
      await prisma.restaurantSettings.upsert({
        where: { id: 1 },
        update: { restaurantName: restaurant.trim() },
        create: {
          id: 1,
          restaurantName: restaurant.trim(),
          defaultTaxRate: 10.0,
          defaultDiscountRate: 20.0,
          currencySymbol: '$',
        },
      });
    }

    const token = jwt.sign(
      { id: newUser.id, username: newUser.username, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: newUser.id,
        name: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        restaurant: restaurant?.trim() || 'DashPoint Restaurant',
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        fullName: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        name: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Fetch me error:', error);
    res.status(500).json({ error: 'Failed to fetch user session' });
  }
});

export default router;
