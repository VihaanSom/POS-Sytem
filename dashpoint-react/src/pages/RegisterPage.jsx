import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { usePos } from '../context/PosContext';

export default function RegisterPage({ onNavigate }) {
  const { setUser, showToast } = usePos();
  const [formData, setFormData] = useState({
    name: '',
    restaurant: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!formData.name.trim()) errs.name = 'Full name is required.';
    if (!formData.restaurant.trim()) errs.restaurant = 'Restaurant name is required.';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      errs.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setUser({
      name: formData.name.trim(),
      email: formData.email.trim(),
      restaurant: formData.restaurant.trim(),
      role: 'Owner / Manager'
    });

    showToast(`Account registered for ${formData.restaurant}! Welcome!`, 'success');
    onNavigate('dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: '480px' }}>
        <div className="auth-header">
          <button onClick={() => onNavigate('landing')} className="nav-logo" style={{ margin: '0 auto 0.5rem' }}>
            <img
              src="/assets/logo.png"
              alt="DashPoint"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/38x38/2563eb/ffffff?text=DP';
              }}
            />
            <span>DashPoint</span>
          </button>
          <h2>Create Restaurant Account</h2>
          <p>Get started with DashPoint Cloud POS today</p>
        </div>

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              placeholder="e.g. Easton Cox"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            {errors.name && <div className="error-text">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label>Restaurant Name *</label>
            <input
              type="text"
              placeholder="e.g. DashPoint Grand Bistro"
              value={formData.restaurant}
              onChange={(e) => setFormData({ ...formData, restaurant: e.target.value })}
            />
            {errors.restaurant && <div className="error-text">{errors.restaurant}</div>}
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              placeholder="manager@restaurant.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {errors.email && <div className="error-text">{errors.email}</div>}
          </div>

          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label>Password *</label>
              <input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              {errors.password && <div className="error-text">{errors.password}</div>}
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label>Confirm Password *</label>
              <input
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
              {errors.confirmPassword && <div className="error-text">{errors.confirmPassword}</div>}
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
            Create Account &amp; Enter POS <ArrowRight size={16} />
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <button onClick={() => onNavigate('login')} style={{ color: 'var(--primary)', fontWeight: 600 }}>
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
/*// ==========================================
// Project: DashPoint POS System
// Database Schema for dbdiagram.io (DBML)
// ==========================================

Project DashPoint_POS {
  database_type: 'PostgreSQL'
  Note: '''
    # DashPoint Restaurant POS Database
    Comprehensive database schema covering:
    - User/Staff Authentication & Roles
    - Menu Catalog & Categories
    - Restaurant Floor & Table Management
    - Order Processing & Historical Item Snapshots
    - Billing & Payment Transactions
    - Table Reservations & System Settings
  '''
}

// ------------------------------------------
// ENUMS
// ------------------------------------------

Enum user_role {
  admin
  manager
  cashier
  waiter
}

Enum table_status {
  available
  occupied
  reserved
}

Enum order_type {
  dine_in [note: 'Dine-In']
  take_out [note: 'Take-Out']
  delivery [note: 'Delivery']
}

Enum order_status {
  pending
  in_process [note: 'In Process']
  ready
  completed
  cancelled
}

Enum payment_method {
  cash
  card
  upi
}

Enum payment_status {
  pending
  completed
  refunded
  failed
}

Enum reservation_status {
  confirmed
  seated
  cancelled
}

// ------------------------------------------
// TABLES
// ------------------------------------------

Table users {
  user_id integer [pk, increment]
  username varchar(50) [unique, not null]
  email varchar(100) [unique, not null]
  password_hash varchar(255) [not null]
  full_name varchar(100) [not null]
  role user_role [not null, default: 'cashier']
  is_active boolean [not null, default: true]
  created_at timestamp [default: `now()`]

  Note: 'Staff accounts and credentials'
}

Table categories {
  category_id integer [pk, increment]
  name varchar(50) [unique, not null]
  slug varchar(50) [unique, not null]
  icon_url varchar(255)
  display_order integer [default: 0]

  Note: 'Menu item categories like Pizza, Burgers, Drinks'
}

Table menu_items {
  item_id integer [pk, increment]
  category_id integer [not null, ref: > categories.category_id]
  name varchar(100) [not null]
  description text
  price decimal(10,2) [not null]
  image_url varchar(500)
  badge varchar(50) [note: 'Popular, Chef Choice, Best Seller']
  is_available boolean [not null, default: true]
  created_at timestamp [default: `now()`]

  Note: 'Dishes and beverages available on the menu'
}

Table restaurant_tables {
  table_id integer [pk, increment]
  table_number varchar(10) [unique, not null, note: 'T1, T2, T6, etc.']
  seating_capacity integer [not null, default: 4]
  status table_status [not null, default: 'available']

  Note: 'Physical dining tables in the restaurant'
}

Table orders {
  order_id integer [pk, increment]
  order_code varchar(20) [unique, not null, note: 'e.g. ORD-1006']
  table_id integer [ref: > restaurant_tables.table_id, note: 'Null for takeout/delivery']
  user_id integer [ref: > users.user_id, note: 'Staff who placed order']
  customer_name varchar(100) [default: 'Guest']
  order_type order_type [not null, default: 'dine_in']
  status order_status [not null, default: 'in_process']
  subtotal decimal(10,2) [not null, default: 0.00]
  tax_rate decimal(5,2) [not null, default: 10.00]
  tax_amount decimal(10,2) [not null, default: 0.00]
  discount_amount decimal(10,2) [not null, default: 0.00]
  total_amount decimal(10,2) [not null, default: 0.00]
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]

  Note: 'Master order records'
}

Table order_items {
  order_item_id integer [pk, increment]
  order_id integer [not null, ref: > orders.order_id]
  item_id integer [ref: > menu_items.item_id]
  item_name varchar(100) [not null, note: 'Snapshot at time of purchase']
  unit_price decimal(10,2) [not null, note: 'Snapshot at time of purchase']
  quantity integer [not null]
  line_total decimal(10,2) [not null]
  notes varchar(255) [note: 'Special preparation requests']

  Note: 'Individual items contained within an order'
}

Table payments {
  payment_id integer [pk, increment]
  order_id integer [unique, not null, ref: - orders.order_id]
  payment_method payment_method [not null]
  amount_paid decimal(10,2) [not null]
  payment_status payment_status [not null, default: 'completed']
  transaction_ref varchar(100)
  paid_at timestamp [default: `now()`]

  Note: '1-to-1 payment transaction record per order'
}

Table reservations {
  reservation_id integer [pk, increment]
  customer_name varchar(100) [not null]
  customer_phone varchar(20)
  table_id integer [ref: > restaurant_tables.table_id]
  guest_count integer [not null]
  reservation_time timestamp [not null]
  status reservation_status [not null, default: 'confirmed']
  notes text
  created_at timestamp [default: `now()`]

  Note: 'Advance table reservations'
}

Table restaurant_settings {
  setting_id integer [pk, increment]
  restaurant_name varchar(100) [not null, default: 'DashPoint Restaurant']
  default_tax_rate decimal(5,2) [not null, default: 10.00]
  default_discount_rate decimal(5,2) [not null, default: 0.00]
  currency_symbol varchar(5) [not null, default: '$']
  updated_at timestamp [default: `now()`]

  Note: 'Global POS tax and currency configurations'
}

// ------------------------------------------
// TABLE GROUPS (Visual grouping in dbdiagram.io)
// ------------------------------------------

TableGroup Menu_Catalog {
  categories
  menu_items
}

TableGroup Sales_Billing {
  orders
  order_items
  payments
}

TableGroup Floor_Operations {
  restaurant_tables
  reservations
}
*/