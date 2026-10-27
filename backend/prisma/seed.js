import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

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
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {
      passwordHash: hashedPassword,
    },
    create: {
      username: 'admin',
      email: 'admin@dashpoint.pos',
      fullName: 'System Administrator',
      passwordHash: hashedPassword,
      role: 'ADMIN',
    },
  });

  // 3. Tables (T1 through T20)
  const tableData = [];
  for (let i = 1; i <= 20; i++) {
    const tableNumber = `T${i}`;
    let capacity = 4;
    if (i % 4 === 0) capacity = 6;
    if (i % 4 === 2) capacity = 2;
    // T6, T7, T8 will be occupied by initial orders
    const isOccupied = ['T6', 'T7', 'T8'].includes(tableNumber);
    tableData.push({
      tableNumber,
      seatingCapacity: capacity,
      status: isOccupied ? 'OCCUPIED' : 'AVAILABLE',
    });
  }

  const tableMap = {};
  for (const t of tableData) {
    const tableRecord = await prisma.restaurantTable.upsert({
      where: { tableNumber: t.tableNumber },
      update: {
        seatingCapacity: t.seatingCapacity,
        status: t.status,
      },
      create: t,
    });
    tableMap[t.tableNumber] = tableRecord.id;
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
      update: {
        iconUrl: cat.iconUrl,
        displayOrder: cat.displayOrder,
      },
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

  const itemMap = {};
  for (const dish of dishes) {
    const categoryId = catMap[dish.categorySlug];
    if (categoryId) {
      let existing = await prisma.menuItem.findFirst({
        where: { name: dish.name },
      });
      if (!existing) {
        existing = await prisma.menuItem.create({
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
      itemMap[dish.name] = existing;
    }
  }

  // 6. Initial Active Orders
  const initialOrders = [
    {
      orderCode: 'ORD-1006',
      tableNumber: 'T6',
      customerName: 'James Hall',
      orderType: 'DINE_IN',
      status: 'READY',
      items: [
        { name: 'Italian Pasta', price: 20.36, qty: 2 },
        { name: 'Burger Delux', price: 18.35, qty: 3 },
        { name: 'Japanese Sushi', price: 10.15, qty: 2 },
        { name: 'Orginal Meat Burger', price: 35.49, qty: 1 },
      ],
    },
    {
      orderCode: 'ORD-1007',
      tableNumber: 'T7',
      customerName: 'John Dukes',
      orderType: 'DINE_IN',
      status: 'IN_PROCESS',
      items: [
        { name: 'Mozarella Pizza', price: 46.23, qty: 1 },
        { name: 'Milky Banana Juice', price: 18.23, qty: 2 },
      ],
    },
    {
      orderCode: 'ORD-1008',
      tableNumber: 'T8',
      customerName: 'Paula Mora',
      orderType: 'DINE_IN',
      status: 'IN_PROCESS',
      items: [
        { name: 'Tacos Salsa With Chicken', price: 35.49, qty: 2 },
        { name: 'Burger Delux', price: 18.35, qty: 3 },
        { name: 'Milky Banana Juice', price: 18.23, qty: 2 },
      ],
    },
  ];

  for (const o of initialOrders) {
    const tableId = tableMap[o.tableNumber];
    const subtotal = o.items.reduce((s, i) => s + i.price * i.qty, 0);
    const taxAmount = subtotal * 0.1;
    const discountAmount = subtotal * 0.2;
    const totalAmount = subtotal + taxAmount - discountAmount;

    let order = await prisma.order.findUnique({
      where: { orderCode: o.orderCode },
    });

    if (!order) {
      order = await prisma.order.create({
        data: {
          orderCode: o.orderCode,
          tableId: tableId,
          customerName: o.customerName,
          orderType: o.orderType,
          status: o.status,
          subtotal: subtotal,
          taxRate: 10.0,
          taxAmount: taxAmount,
          discountAmount: discountAmount,
          totalAmount: totalAmount,
          orderItems: {
            create: o.items.map((it) => {
              const menuItem = itemMap[it.name];
              return {
                itemId: menuItem ? menuItem.id : null,
                itemName: it.name,
                unitPrice: it.price,
                quantity: it.qty,
                lineTotal: it.price * it.qty,
              };
            }),
          },
        },
      });
    }
  }

  // 7. Initial Reservations
  const reservations = [
    { customerName: 'Michael Scott', tableNumber: 'T1', guestCount: 4, reservationTime: new Date(Date.now() + 3600000 * 2) },
    { customerName: 'Pam Beesly', tableNumber: 'T4', guestCount: 2, reservationTime: new Date(Date.now() + 3600000 * 3) },
  ];

  for (const r of reservations) {
    const tableId = tableMap[r.tableNumber];
    const existing = await prisma.reservation.findFirst({
      where: { customerName: r.customerName, tableId: tableId },
    });
    if (!existing) {
      await prisma.reservation.create({
        data: {
          customerName: r.customerName,
          tableId: tableId,
          guestCount: r.guestCount,
          reservationTime: r.reservationTime,
          status: 'CONFIRMED',
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
