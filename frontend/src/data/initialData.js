/**
 * Initial mock data for the DashPoint POS system.
 * In a production app, these would come from a backend API or database.
 * In React, keeping initial data isolated makes code clean and easy to test.
 */

export const DEFAULT_DISHES = [
  {
    id: 'dish-1',
    name: 'Japanese Sushi',
    category: 'sweets',
    price: 10.15,
    desc: 'Fresh salmon, tuna rolls with avocado & wasabi',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80',
    badge: 'Popular'
  },
  {
    id: 'dish-2',
    name: 'Italian Pasta',
    category: 'pastas',
    price: 20.36,
    desc: 'Penne arrabbiata tossed in garlic herbs & rich tomato sauce',
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d628120b?auto=format&fit=crop&w=600&q=80',
    badge: 'Chef Choice'
  },
  {
    id: 'dish-3',
    name: 'Luxury Indomie',
    category: 'pastas',
    price: 24.86,
    desc: 'Gourmet ramen noodles with soft poached egg & scallions',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
    badge: 'Special'
  },
  {
    id: 'dish-4',
    name: 'Milky Banana Juice',
    category: 'drinks',
    price: 18.23,
    desc: 'Creamy banana puree with vanilla cream & cold milk',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80',
    badge: 'Drinks'
  },
  {
    id: 'dish-5',
    name: 'Mozarella Pizza',
    category: 'pizza',
    price: 46.23,
    desc: 'Wood-fired crust with fresh basil & buffalo mozzarella',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    badge: 'Best Seller'
  },
  {
    id: 'dish-6',
    name: 'Burger Delux',
    category: 'burger',
    price: 18.35,
    desc: 'Double beef patty with melted cheddar, lettuce & crispy fries',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    badge: 'Top Rated'
  },
  {
    id: 'dish-7',
    name: 'Tacos Salsa With Chicken',
    category: 'burger',
    price: 35.49,
    desc: 'Three grilled chicken soft corn tacos with lime & salsa verde',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80',
    badge: 'Mexican'
  },
  {
    id: 'dish-8',
    name: 'Orginal Meat Burger',
    category: 'burger',
    price: 25.54,
    desc: 'Brioche bun, charred angus beef patty with truffle mayo',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80',
    badge: 'Signature'
  }
];

export const CATEGORIES = [
  { id: 'all', name: 'All', icon: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png' },
  { id: 'pizza', name: 'Pizza', icon: 'https://cdn-icons-png.flaticon.com/512/1404/1404945.png' },
  { id: 'burger', name: 'Burger', icon: 'https://cdn-icons-png.flaticon.com/512/877/877951.png' },
  { id: 'salads', name: 'Salads', icon: 'https://cdn-icons-png.flaticon.com/512/2515/2515228.png' },
  { id: 'pastas', name: 'Pastas', icon: 'https://cdn-icons-png.flaticon.com/512/1147/1147805.png' },
  { id: 'drinks', name: 'Drinks', icon: 'https://cdn-icons-png.flaticon.com/512/2405/2405479.png' },
  { id: 'sweets', name: 'Sweets', icon: 'https://cdn-icons-png.flaticon.com/512/992/992717.png' }
];

export const INITIAL_ORDERS = [
  {
    id: 'ORD-1006',
    table: 'T6',
    customer: 'James Hall',
    orderType: 'dine-in',
    status: 'Ready',
    items: [
      { id: 'dish-2', name: 'Italian Pasta', price: 20.36, qty: 2, image: 'https://images.unsplash.com/photo-1621996346565-e3d5d628120b?auto=format&fit=crop&w=600&q=80' },
      { id: 'dish-6', name: 'Burger Delux', price: 18.35, qty: 3, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80' },
      { id: 'dish-1', name: 'Japanese Sushi', price: 10.15, qty: 2, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80' },
      { id: 'dish-8', name: 'Orginal Meat Burger', price: 35.49, qty: 1, image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80' }
    ]
  },
  {
    id: 'ORD-1007',
    table: 'T7',
    customer: 'John Dukes',
    orderType: 'dine-in',
    status: 'in process',
    items: [
      { id: 'dish-5', name: 'Mozarella Pizza', price: 46.23, qty: 1, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80' },
      { id: 'dish-4', name: 'Milky Banana Juice', price: 18.23, qty: 2, image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80' }
    ]
  },
  {
    id: 'ORD-1008',
    table: 'T8',
    customer: 'Paula Mora',
    orderType: 'dine-in',
    status: 'in process',
    items: [
      { id: 'dish-7', name: 'Tacos Salsa With Chicken', price: 35.49, qty: 2, image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80' },
      { id: 'dish-6', name: 'Burger Delux', price: 18.35, qty: 3, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80' },
      { id: 'dish-4', name: 'Milky Banana Juice', price: 18.23, qty: 2, image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80' }
    ]
  }
];

export const INITIAL_RESERVATIONS = [
  { id: 1, name: 'Michael Scott', table: 'T1', guests: 4, time: '19:30' },
  { id: 2, name: 'Pam Beesly', table: 'T4', guests: 2, time: '20:00' }
];

export const INITIAL_SETTINGS = {
  tax: 10,
  discount: 20,
  currency: '$'
};
