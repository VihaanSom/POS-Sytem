import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial data into pos_db...');

  // 1. Settings
  await prisma.restaurantSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      restaurantName: 'DashPoint Restaurant',
      defaultTaxRate: 10.0,
      defaultDiscountRate: 20.0,
      currencySymbol: '$',
    },
  });

  // 2. Default Staff User
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@dashpoint.pos',
      fullName: 'System Administrator',
      passwordHash: 'admin123', // In production use bcrypt
      role: 'ADMIN',
    },
  });

  // 3. Tables
  const tables = [
    { tableNumber: 'T1', seatingCapacity: 4, status: 'AVAILABLE' },
    { tableNumber: 'T2', seatingCapacity: 2, status: 'AVAILABLE' },
    { tableNumber: 'T3', seatingCapacity: 4, status: 'AVAILABLE' },
    { tableNumber: 'T4', seatingCapacity: 6, status: 'AVAILABLE' },
    { tableNumber: 'T5', seatingCapacity: 2, status: 'AVAILABLE' },
    { tableNumber: 'T6', seatingCapacity: 4, status: 'OCCUPIED' },
    { tableNumber: 'T7', seatingCapacity: 4, status: 'OCCUPIED' },
    { tableNumber: 'T8', seatingCapacity: 6, status: 'OCCUPIED' },
  ];

  for (const t of tables) {
    await prisma.restaurantTable.upsert({
      where: { tableNumber: t.tableNumber },
      update: {},
      create: t,
    });
  }

  // 4. Categories
  const categories = [
    { name: 'Pizza', slug: 'pizza', iconUrl: 'https://cdn-icons-png.flaticon.com/512/1404/1404945.png', displayOrder: 1 },
    { name: 'Burger', slug: 'burger', iconUrl: 'https://cdn-icons-png.flaticon.com/512/877/877951.png', displayOrder: 2 },
    { name: 'Salads', slug: 'salads', iconUrl: 'https://cdn-icons-png.flaticon.com/512/2515/2515228.png', displayOrder: 3 },
    { name: 'Pastas', slug: 'pastas', iconUrl: 'https://cdn-icons-png.flaticon.com/512/1147/1147805.png', displayOrder: 4 },
    { name: 'Drinks', slug: 'drinks', iconUrl: 'https://cdn-icons-png.flaticon.com/512/2405/2405479.png', displayOrder: 5 },
    { name: 'Sweets', slug: 'sweets', iconUrl: 'https://cdn-icons-png.flaticon.com/512/992/992717.png', displayOrder: 6 },
  ];

  const catMap = {};
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    catMap[cat.slug] = created.id;
  }

  // 5. Dishes / Menu Items
  const dishes = [
    {
      name: 'Japanese Sushi',
      categorySlug: 'sweets',
      price: 10.15,
      description: 'Fresh salmon, tuna rolls with avocado & wasabi',
      imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80',
      badge: 'Popular',
    },
    {
      name: 'Italian Pasta',
      categorySlug: 'pastas',
      price: 20.36,
      description: 'Penne arrabbiata tossed in garlic herbs & rich tomato sauce',
      imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3d5d628120b?auto=format&fit=crop&w=600&q=80',
      badge: 'Chef Choice',
    },
    {
      name: 'Luxury Indomie',
      categorySlug: 'pastas',
      price: 24.86,
      description: 'Gourmet ramen noodles with soft poached egg & scallions',
      imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
      badge: 'Special',
    },
    {
      name: 'Milky Banana Juice',
      categorySlug: 'drinks',
      price: 18.23,
      description: 'Creamy banana puree with vanilla cream & cold milk',
      imageUrl: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80',
      badge: 'Drinks',
    },
    {
      name: 'Mozarella Pizza',
      categorySlug: 'pizza',
      price: 46.23,
      description: 'Wood-fired crust with fresh basil & buffalo mozzarella',
      imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
      badge: 'Best Seller',
    },
    {
      name: 'Burger Delux',
      categorySlug: 'burger',
      price: 18.35,
      description: 'Double beef patty with melted cheddar, lettuce & crispy fries',
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
      badge: 'Top Rated',
    },
    {
      name: 'Tacos Salsa With Chicken',
      categorySlug: 'burger',
      price: 35.49,
      description: 'Three grilled chicken soft corn tacos with lime & salsa verde',
      imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80',
      badge: 'Mexican',
    },
    {
      name: 'Orginal Meat Burger',
      categorySlug: 'burger',
      price: 25.54,
      description: 'Brioche bun, charred angus beef patty with truffle mayo',
      imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80',
      badge: 'Signature',
    },
  ];

  for (const dish of dishes) {
    const categoryId = catMap[dish.categorySlug];
    if (categoryId) {
      await prisma.menuItem.create({
        data: {
          name: dish.name,
          categoryId: categoryId,
          price: dish.price,
          description: dish.description,
          imageUrl: dish.imageUrl,
          badge: dish.badge,
        },
      });
    }
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
