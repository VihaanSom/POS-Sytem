import React from 'react';
import { Plus } from 'lucide-react';
import { CATEGORIES } from '../../data/initialData';
import { usePos } from '../../context/PosContext';

/**
 * ============================================================================
 * LEARNING NOTE: FILTERING & RENDERING LISTS IN REACT
 * ============================================================================
 * In vanilla JS, when a user clicked a category or typed in search, you had
 * to run a loop, manually generate HTML strings with template literals, and set
 * `container.innerHTML = dishesHtml`.
 *
 * In React, it's pure logic:
 * We take `allDishes`, filter it based on `selectedCategory` and `searchQuery`,
 * and then `.map()` each dish to a `<div className="dish-card">`.
 * React handles DOM diffing and updates efficiently!
 * ============================================================================
 */
export default function MenuView() {
  const {
    orders,
    activeTable,
    setActiveTable,
    allDishes,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    addToCart,
    openCreateOrder,
    setIsAddDishOpen,
    settings
  } = usePos();

  // Filter dishes by category and search query
  const filteredDishes = allDishes.filter((dish) => {
    const matchesCategory =
      selectedCategory === 'all' || dish.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      !searchQuery.trim() ||
      dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="view-menu">
      {/* 1. ORDER LISTS CAROUSEL (Active Tables) */}
      <div className="section-block">
        <div className="section-header">
          <h2 className="section-title">Active Orders</h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Click an order card to manage its table
          </span>
        </div>

        <div className="order-cards-scroll">
          {orders.map((order) => {
            const isActive = order.table === activeTable;
            const totalItemsCount = order.items.reduce((sum, i) => sum + i.qty, 0);

            return (
              <div
                key={order.id}
                className={`order-card ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTable(order.table)}
              >
                <div className="table-badge">{order.table}</div>
                <div className="order-details">
                  <div className="customer-row">
                    <span className="customer-name">{order.customer}</span>
                    <span
                      className={`status-pill ${
                        order.status === 'Ready' ? 'status-ready' : 'status-process'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="items-status">
                    {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} &bull;{' '}
                    {order.status === 'Ready' ? 'Ready to serve' : 'In Kitchen'}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Quick New Order Button */}
          <button
            type="button"
            className="order-card add-order-card"
            onClick={() => openCreateOrder()}
            title="Create a new order"
          >
            <div className="add-icon">+</div>
            <span>New Order</span>
          </button>
        </div>
      </div>

      {/* 2. CATEGORY PICKER */}
      <div className="section-block">
        <div className="section-header">
          <h2 className="section-title">Choose Category</h2>
        </div>

        <div className="category-grid">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`category-card ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <div className="cat-icon-wrap">
                <img
                  src={cat.icon}
                  alt={cat.name}
                  className="cat-img"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              <span className="cat-name">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. DISHES CATALOG GRID */}
      <div className="section-block">
        <div className="section-header">
          <h2 className="section-title">
            Special Menu For You{' '}
            <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>
              ({filteredDishes.length} items)
            </span>
          </h2>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => setIsAddDishOpen(true)}
          >
            + Add Custom Dish
          </button>
        </div>

        {filteredDishes.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>No dishes found matching your search or category.</p>
          </div>
        ) : (
          <div className="dishes-grid">
            {filteredDishes.map((dish) => (
              <div key={dish.id} className="dish-card">
                <div className="dish-img-wrap">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="dish-img"
                    onError={(e) => {
                      e.target.src =
                        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  {dish.badge && <span className="dish-badge">{dish.badge}</span>}
                </div>

                <div className="dish-body">
                  <h3 className="dish-title">{dish.name}</h3>
                  <p className="dish-desc">{dish.desc}</p>
                  <div className="dish-footer">
                    <span className="dish-price">
                      {settings.currency}
                      {dish.price.toFixed(2)}
                    </span>
                    <button
                      type="button"
                      className="dish-add-btn"
                      onClick={() => addToCart(dish)}
                      title={`Add ${dish.name} to Table ${activeTable}`}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
