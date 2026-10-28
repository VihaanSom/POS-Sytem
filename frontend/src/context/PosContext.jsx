import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DEFAULT_DISHES, INITIAL_ORDERS, INITIAL_RESERVATIONS, INITIAL_SETTINGS } from '../data/initialData';
import api from '../services/api';

const PosContext = createContext();

export function PosProvider({ children }) {
  // 1. ORDERS STATE
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('dashpoint_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  // 2. ACTIVE TABLE SELECTION
  const [activeTable, setActiveTable] = useState('T6');

  // 3. MENU DISHES (Loaded from PostgreSQL backend)
  const [allDishes, setAllDishes] = useState(DEFAULT_DISHES);

  // 4. RESERVATIONS
  const [reservations, setReservations] = useState(() => {
    const saved = localStorage.getItem('dashpoint_reservations');
    return saved ? JSON.parse(saved) : INITIAL_RESERVATIONS;
  });

  // 5. SETTINGS (Tax %, Discount %, Currency)
  const [settings, setSettingsState] = useState(() => {
    const saved = localStorage.getItem('dashpoint_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  // 6. LOGGED-IN USER INFO
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('dashpoint_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // 7. FILTER & SEARCH STATE
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 8. MODAL STATES
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
  const [orderToEdit, setOrderToEdit] = useState(null);
  const [isAddDishOpen, setIsAddDishOpen] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  // 9. TOAST NOTIFICATIONS
  const [toasts, setToasts] = useState([]);

  // Toast Helper
  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('dashpoint_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('dashpoint_reservations', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem('dashpoint_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('dashpoint_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('dashpoint_current_user');
    }
  }, [user]);

  // Initial Load: Fetch live data from backend API
  useEffect(() => {
    async function loadInitialData() {
      try {
        // Fetch Settings
        api.settings.get()
          .then((data) => {
            if (data) setSettingsState(data);
          })
          .catch((err) => console.warn('Could not fetch settings from backend:', err));

        // Fetch Dishes
        api.dishes.getAll()
          .then((dishes) => {
            if (dishes && dishes.length > 0) setAllDishes(dishes);
          })
          .catch((err) => console.warn('Could not fetch dishes from backend:', err));

        // Fetch Orders
        api.orders.getAll()
          .then((activeOrders) => {
            if (activeOrders && Array.isArray(activeOrders)) setOrders(activeOrders);
          })
          .catch((err) => console.warn('Could not fetch orders from backend:', err));

        // Fetch Reservations
        api.reservations.getAll()
          .then((resList) => {
            if (resList && Array.isArray(resList)) setReservations(resList);
          })
          .catch((err) => console.warn('Could not fetch reservations from backend:', err));

        // Verify user session if token exists
        const token = localStorage.getItem('dashpoint_token');
        if (token && !user) {
          api.auth.me()
            .then((res) => {
              if (res?.user) setUser(res.user);
            })
            .catch(() => {
              localStorage.removeItem('dashpoint_token');
            });
        }
      } catch (err) {
        console.error('Initial data loading error:', err);
      }
    }

    loadInitialData();
  }, []);

  // Logout helper
  const logout = () => {
    setUser(null);
    localStorage.removeItem('dashpoint_current_user');
    localStorage.removeItem('dashpoint_token');
    showToast('You have been logged out.', 'info');
  };

  // Active Order is the order currently loaded into the right billing sidebar
  const activeOrder = orders.find((o) => o.table === activeTable) || null;

  // Calculate bill totals for the active order
  const subtotal = activeOrder
    ? activeOrder.items.reduce((sum, item) => sum + item.price * item.qty, 0)
    : 0;
  const taxAmount = subtotal * (settings.tax / 100);
  const discountAmount = subtotal * (settings.discount / 100);
  const grandTotal = Math.max(0, subtotal + taxAmount - discountAmount);

  // Sync an order with the backend
  const syncOrderWithBackend = async (orderToSync) => {
    try {
      if (orderToSync.dbId || (orderToSync.id && orderToSync.id.startsWith('ORD-'))) {
        await api.orders.update(orderToSync.id, orderToSync);
      } else {
        const created = await api.orders.create(orderToSync);
        if (created?.id) {
          setOrders((prev) =>
            prev.map((o) => (o.table === orderToSync.table ? created : o))
          );
        }
      }
    } catch (err) {
      console.error('Failed to sync order with backend:', err);
    }
  };

  // CART ACTIONS: Add item to the active table order
  const addToCart = async (dish) => {
    let orderToSync = null;

    setOrders((prevOrders) => {
      const orderIndex = prevOrders.findIndex((o) => o.table === activeTable);

      if (orderIndex === -1) {
        // Create a new order for this table if none exists
        const newOrder = {
          id: `ORD-${Date.now().toString().slice(-4)}`,
          table: activeTable,
          customer: `Guest (${activeTable})`,
          orderType: 'dine-in',
          status: 'in process',
          items: [{ ...dish, qty: 1 }]
        };
        orderToSync = newOrder;
        showToast(`Started new order on Table ${activeTable}`, 'success');
        return [...prevOrders, newOrder];
      }

      const existingOrder = prevOrders[orderIndex];
      const existingItemIndex = existingOrder.items.findIndex((item) => item.id === dish.id);

      let updatedItems;
      if (existingItemIndex > -1) {
        updatedItems = existingOrder.items.map((item, idx) =>
          idx === existingItemIndex ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        updatedItems = [...existingOrder.items, { ...dish, qty: 1 }];
      }

      const updatedOrder = { ...existingOrder, items: updatedItems };
      orderToSync = updatedOrder;
      showToast(`Added "${dish.name}" to Table ${activeTable}`, 'info');

      return prevOrders.map((order, idx) =>
        idx === orderIndex ? updatedOrder : order
      );
    });

    if (orderToSync) {
      syncOrderWithBackend(orderToSync);
    }
  };

  // Update item quantity in active order (+1 or -1)
  const updateItemQty = (dishId, delta) => {
    if (!activeOrder) return;
    let orderToSync = null;

    setOrders((prevOrders) => {
      const nextOrders = prevOrders
        .map((order) => {
          if (order.table !== activeTable) return order;

          const updatedItems = order.items
            .map((item) => {
              if (item.id === dishId) {
                const newQty = item.qty + delta;
                return newQty > 0 ? { ...item, qty: newQty } : null;
              }
              return item;
            })
            .filter(Boolean);

          const updatedOrder = { ...order, items: updatedItems };
          orderToSync = updatedOrder;
          return updatedOrder;
        })
        .filter((order) => order.items.length > 0);

      return nextOrders;
    });

    if (orderToSync) {
      syncOrderWithBackend(orderToSync);
    }
  };

  // Remove item directly from cart
  const removeFromCart = (dishId) => {
    if (!activeOrder) return;
    let orderToSync = null;

    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.table !== activeTable) return order;
        const updated = {
          ...order,
          items: order.items.filter((item) => item.id !== dishId)
        };
        orderToSync = updated;
        return updated;
      })
    );

    showToast('Item removed from order', 'info');
    if (orderToSync) {
      syncOrderWithBackend(orderToSync);
    }
  };

  // Set order type ('dine-in' | 'take-away' | 'delivery')
  const setOrderType = (type) => {
    if (!activeOrder) return;
    const updated = { ...activeOrder, orderType: type };
    setOrders((prevOrders) =>
      prevOrders.map((o) => (o.table === activeTable ? updated : o))
    );
    syncOrderWithBackend(updated);
  };

  // Create or Update Order (via Modal)
  const saveOrder = async (orderData) => {
    try {
      if (orderData.id) {
        // Editing existing order
        const updated = await api.orders.update(orderData.id, orderData).catch(() => orderData);
        setOrders((prev) =>
          prev.map((o) => (o.id === orderData.id ? { ...o, ...updated } : o))
        );
        showToast(`Order ${orderData.id} updated`, 'success');
      } else {
        // Creating a new order
        const created = await api.orders.create(orderData).catch(() => ({
          ...orderData,
          id: `ORD-${Date.now().toString().slice(-4)}`,
          items: orderData.items || []
        }));
        setOrders((prev) => [...prev, created]);
        setActiveTable(created.table);
        showToast(`Created order for Table ${created.table}`, 'success');
      }
    } catch (err) {
      console.error('Error saving order:', err);
      showToast('Failed to save order on server', 'error');
    }

    setIsCreateOrderOpen(false);
    setOrderToEdit(null);
  };

  // Delete an order
  const deleteOrder = async (orderId) => {
    try {
      await api.orders.delete(orderId).catch(console.error);
    } catch (err) {
      console.error('Error deleting order:', err);
    }
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    showToast(`Order deleted`, 'info');
  };

  // Settle / Pay bill
  const payBill = async (paymentMethod) => {
    if (!activeOrder || activeOrder.items.length === 0) {
      showToast('No items to pay for!', 'error');
      return;
    }

    try {
      // Call backend payment API
      const res = await api.orders.pay(activeOrder.id, paymentMethod);
      const receipt = res.receipt || {
        orderId: activeOrder.id,
        table: activeOrder.table,
        customer: activeOrder.customer,
        orderType: activeOrder.orderType,
        items: [...activeOrder.items],
        subtotal,
        taxPercent: settings.tax,
        taxAmount,
        discountPercent: settings.discount,
        discountAmount,
        grandTotal,
        paymentMethod,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })
      };

      // Remove paid order from active orders list
      setOrders((prev) => prev.filter((o) => o.id !== activeOrder.id));

      // Show receipt modal
      setReceiptData(receipt);
      showToast(`Bill paid successfully via ${paymentMethod}!`, 'success');
    } catch (err) {
      console.error('Payment error:', err);
      showToast(err.message || 'Payment processing failed', 'error');
    }
  };

  // Add a custom dish
  const addCustomDish = async (dish) => {
    try {
      const created = await api.dishes.create(dish);
      setAllDishes((prev) => [created, ...prev]);
      showToast(`Added "${dish.name}" to the menu`, 'success');
      setIsAddDishOpen(false);
    } catch (err) {
      console.error('Add custom dish error:', err);
      // Fallback
      const newDish = {
        ...dish,
        id: `dish-${Date.now().toString().slice(-4)}`
      };
      setAllDishes((prev) => [newDish, ...prev]);
      showToast(`Added "${dish.name}" to menu (local fallback)`, 'success');
      setIsAddDishOpen(false);
    }
  };

  // Add reservation
  const addReservation = async (reservation) => {
    try {
      const created = await api.reservations.create(reservation);
      setReservations((prev) => [created, ...prev]);
      showToast(`Table ${reservation.table} reserved for ${reservation.name}`, 'success');
    } catch (err) {
      console.error('Add reservation error:', err);
      const newRes = {
        ...reservation,
        id: Date.now()
      };
      setReservations((prev) => [newRes, ...prev]);
      showToast(`Table ${reservation.table} reserved for ${reservation.name}`, 'success');
    }
  };

  // Delete reservation
  const deleteReservation = async (id) => {
    try {
      await api.reservations.delete(id).catch(console.error);
    } catch (err) {
      console.error('Delete reservation error:', err);
    }
    setReservations((prev) => prev.filter((r) => r.id !== id));
    showToast('Reservation removed', 'info');
  };

  // Update Settings
  const setSettings = async (newSettings) => {
    setSettingsState(newSettings);
    try {
      await api.settings.update(newSettings);
    } catch (err) {
      console.error('Failed to update settings in backend:', err);
    }
  };

  // Modals controls
  const openCreateOrder = (order = null) => {
    setOrderToEdit(order);
    setIsCreateOrderOpen(true);
  };

  const closeCreateOrder = () => {
    setIsCreateOrderOpen(false);
    setOrderToEdit(null);
  };

  // 20 Table status helper
  const tables = Array.from({ length: 20 }, (_, i) => {
    const tableId = `T${i + 1}`;
    const order = orders.find((o) => o.table === tableId);
    return {
      id: tableId,
      isOccupied: Boolean(order),
      order: order || null
    };
  });

  const value = {
    // State
    orders,
    activeTable,
    setActiveTable,
    allDishes,
    reservations,
    settings,
    setSettings,
    user,
    setUser,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    tables,
    activeOrder,
    toasts,

    // Billing calculations
    subtotal,
    taxAmount,
    discountAmount,
    grandTotal,

    // Actions
    addToCart,
    updateItemQty,
    removeFromCart,
    setOrderType,
    saveOrder,
    deleteOrder,
    payBill,
    addCustomDish,
    addReservation,
    deleteReservation,
    logout,
    showToast,
    removeToast,

    // Modals
    isCreateOrderOpen,
    openCreateOrder,
    closeCreateOrder,
    orderToEdit,
    isAddDishOpen,
    setIsAddDishOpen,
    receiptData,
    setReceiptData
  };

  return <PosContext.Provider value={value}>{children}</PosContext.Provider>;
}

export function usePos() {
  const context = useContext(PosContext);
  if (!context) {
    throw new Error('usePos must be used within a PosProvider');
  }
  return context;
}
