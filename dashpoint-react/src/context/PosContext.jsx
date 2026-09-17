import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_DISHES, INITIAL_ORDERS, INITIAL_RESERVATIONS, INITIAL_SETTINGS } from '../data/initialData';

/**
 * ============================================================================
 * LEARNING NOTE: WHAT IS REACT CONTEXT?
 * ============================================================================
 * In your old vanilla JavaScript (dashboard.js), you had global variables
 * like `activeOrders`, `currentSelectedTable`, and `TAX_RATE`. Any function
 * could modify them, and you had to manually call `renderDishesGrid()`,
 * `renderCart()`, `renderOrderLists()`, etc., every time anything changed!
 *
 * In React, we use "Context" + "State":
 * 1. State: Whenever state changes using a `set...` function, React automatically
 *    re-renders only the components that use that data. No manual DOM manipulation!
 * 2. Context: Allows ANY component in your application to access or update
 *    this state by simply calling `usePos()`, without passing props through
 *    every intermediate component.
 * ============================================================================
 */

const PosContext = createContext();

export function PosProvider({ children }) {
  // 1. ORDERS STATE (persisted to localStorage)
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('dashpoint_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  // 2. ACTIVE TABLE SELECTION
  const [activeTable, setActiveTable] = useState('T6');

  // 3. CUSTOM DISHES ADDED BY USER
  const [customDishes, setCustomDishes] = useState(() => {
    const saved = localStorage.getItem('dashpoint_custom_dishes');
    return saved ? JSON.parse(saved) : [];
  });

  // 4. RESERVATIONS
  const [reservations, setReservations] = useState(() => {
    const saved = localStorage.getItem('dashpoint_reservations');
    return saved ? JSON.parse(saved) : INITIAL_RESERVATIONS;
  });

  // 5. SETTINGS (Tax %, Discount %, Currency)
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('dashpoint_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  // 6. LOGGED-IN USER INFO
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('dashpoint_current_user');
    return saved ? JSON.parse(saved) : { name: 'Easton Cox', email: 'easton@dashpoint.com', role: 'Store Manager' };
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

  // Sync state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('dashpoint_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('dashpoint_custom_dishes', JSON.stringify(customDishes));
  }, [customDishes]);

  useEffect(() => {
    localStorage.setItem('dashpoint_reservations', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem('dashpoint_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('dashpoint_current_user', JSON.stringify(user));
  }, [user]);

  // Toast Helper
  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Combine default dishes with custom user-created dishes
  const allDishes = [...DEFAULT_DISHES, ...customDishes];

  // Active Order is the order currently loaded into the right billing sidebar
  const activeOrder = orders.find((o) => o.table === activeTable) || null;

  // Calculate bill totals for the active order
  const subtotal = activeOrder
    ? activeOrder.items.reduce((sum, item) => sum + item.price * item.qty, 0)
    : 0;
  const taxAmount = subtotal * (settings.tax / 100);
  const discountAmount = subtotal * (settings.discount / 100);
  const grandTotal = Math.max(0, subtotal + taxAmount - discountAmount);

  // CART ACTIONS: Add item to the active table order
  const addToCart = (dish) => {
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
        showToast(`Started new order on Table ${activeTable}`, 'success');
        return [...prevOrders, newOrder];
      }

      const existingOrder = prevOrders[orderIndex];
      const existingItemIndex = existingOrder.items.findIndex((item) => item.id === dish.id);

      let updatedItems;
      if (existingItemIndex > -1) {
        // Increment quantity of existing item
        updatedItems = existingOrder.items.map((item, idx) =>
          idx === existingItemIndex ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        // Append new item with qty 1
        updatedItems = [...existingOrder.items, { ...dish, qty: 1 }];
      }

      showToast(`Added "${dish.name}" to Table ${activeTable}`, 'info');

      return prevOrders.map((order, idx) =>
        idx === orderIndex ? { ...order, items: updatedItems } : order
      );
    });
  };

  // Update item quantity in active order (+1 or -1)
  const updateItemQty = (dishId, delta) => {
    if (!activeOrder) return;

    setOrders((prevOrders) =>
      prevOrders
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
            .filter(Boolean); // Remove null items whose quantity reached 0

          return { ...order, items: updatedItems };
        })
        .filter((order) => order.items.length > 0) // Remove empty orders if desired
    );
  };

  // Remove item directly from cart
  const removeFromCart = (dishId) => {
    if (!activeOrder) return;
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.table !== activeTable) return order;
        return {
          ...order,
          items: order.items.filter((item) => item.id !== dishId)
        };
      })
    );
    showToast('Item removed from order', 'info');
  };

  // Set order type ('dine-in' | 'take-away' | 'delivery')
  const setOrderType = (type) => {
    if (!activeOrder) return;
    setOrders((prevOrders) =>
      prevOrders.map((o) => (o.table === activeTable ? { ...o, orderType: type } : o))
    );
  };

  // Create or Update Order (via Modal)
  const saveOrder = (orderData) => {
    if (orderData.id) {
      // Editing existing order
      setOrders((prev) =>
        prev.map((o) => (o.id === orderData.id ? { ...o, ...orderData } : o))
      );
      showToast(`Order ${orderData.id} updated`, 'success');
    } else {
      // Creating a new order
      const newOrder = {
        ...orderData,
        id: `ORD-${Date.now().toString().slice(-4)}`,
        items: orderData.items || []
      };
      setOrders((prev) => [...prev, newOrder]);
      setActiveTable(newOrder.table);
      showToast(`Created order for Table ${newOrder.table}`, 'success');
    }
    setIsCreateOrderOpen(false);
    setOrderToEdit(null);
  };

  // Delete an order
  const deleteOrder = (orderId) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    showToast(`Order deleted`, 'info');
  };

  // Settle / Pay bill
  const payBill = (paymentMethod) => {
    if (!activeOrder || activeOrder.items.length === 0) {
      showToast('No items to pay for!', 'error');
      return;
    }

    // Prepare receipt data
    const receipt = {
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
  };

  // Add a custom dish
  const addCustomDish = (dish) => {
    const newDish = {
      ...dish,
      id: `dish-${Date.now().toString().slice(-4)}`
    };
    setCustomDishes((prev) => [newDish, ...prev]);
    showToast(`Added "${dish.name}" to the menu`, 'success');
    setIsAddDishOpen(false);
  };

  // Add reservation
  const addReservation = (reservation) => {
    const newRes = {
      ...reservation,
      id: Date.now()
    };
    setReservations((prev) => [newRes, ...prev]);
    showToast(`Table ${reservation.table} reserved for ${reservation.name}`, 'success');
  };

  // Delete reservation
  const deleteReservation = (id) => {
    setReservations((prev) => prev.filter((r) => r.id !== id));
    showToast('Reservation removed', 'info');
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
    customDishes,
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

// Custom hook so any component can simply call: const { activeOrder, addToCart } = usePos();
export function usePos() {
  const context = useContext(PosContext);
  if (!context) {
    throw new Error('usePos must be used within a PosProvider');
  }
  return context;
}
