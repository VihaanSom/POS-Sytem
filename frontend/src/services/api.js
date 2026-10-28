/**
 * DashPoint POS Centralized API Service
 * Connects frontend directly with backend Express + PostgreSQL server.
 */

const BASE_URL = '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('dashpoint_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.error || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // 1. Authentication
  auth: {
    login: (credentials) =>
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    register: (userData) =>
      request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    me: () => request('/auth/me'),
  },

  // 2. Categories
  categories: {
    getAll: () => request('/categories'),
  },

  // 3. Menu Items / Dishes
  dishes: {
    getAll: () => request('/menu-items'),
    create: (dishData) =>
      request('/menu-items', {
        method: 'POST',
        body: JSON.stringify(dishData),
      }),
  },

  // 4. Tables
  tables: {
    getAll: () => request('/tables'),
  },

  // 5. Orders
  orders: {
    getAll: () => request('/orders'),
    create: (orderData) =>
      request('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      }),
    update: (id, orderData) =>
      request(`/orders/${id}`, {
        method: 'PUT',
        body: JSON.stringify(orderData),
      }),
    delete: (id) =>
      request(`/orders/${id}`, {
        method: 'DELETE',
      }),
    pay: (id, paymentMethod) =>
      request(`/orders/${id}/pay`, {
        method: 'POST',
        body: JSON.stringify({ paymentMethod }),
      }),
  },

  // 6. Reservations
  reservations: {
    getAll: () => request('/reservations'),
    create: (resData) =>
      request('/reservations', {
        method: 'POST',
        body: JSON.stringify(resData),
      }),
    delete: (id) =>
      request(`/reservations/${id}`, {
        method: 'DELETE',
      }),
  },

  // 7. Settings
  settings: {
    get: () => request('/settings'),
    update: (settingsData) =>
      request('/settings', {
        method: 'PUT',
        body: JSON.stringify(settingsData),
      }),
  },
};

export default api;
