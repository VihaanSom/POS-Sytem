import React, { useState } from 'react';
import { Edit2, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';
import { usePos } from '../../context/PosContext';

/**
 * ============================================================================
 * LEARNING NOTE: REACTIVE CALCULATIONS
 * ============================================================================
 * In vanilla JS, whenever an item was added or a quantity changed, you had
 * to manually recalculate subtotal, tax, and discount and update 4 DOM labels:
 * billSubtotal.textContent = ...
 * billTax.textContent = ...
 * billGrandTotal.textContent = ...
 *
 * In React, `subtotal`, `taxAmount`, and `grandTotal` are calculated automatically
 * from the state in `PosContext.jsx`. The moment `items` change, this component
 * immediately reflects the new math!
 * ============================================================================
 */
export default function BillingSidebar() {
  const {
    activeTable,
    activeOrder,
    settings,
    subtotal,
    taxAmount,
    discountAmount,
    grandTotal,
    updateItemQty,
    removeFromCart,
    setOrderType,
    openCreateOrder,
    payBill
  } = usePos();

  const [paymentMethod, setPaymentMethod] = useState('Cash');

  const orderType = activeOrder ? activeOrder.orderType : 'dine-in';
  const customerName = activeOrder ? activeOrder.customer : 'Guest';
  const items = activeOrder ? activeOrder.items : [];

  return (
    <aside className="billing-sidebar">
      {/* 1. Header: Table & Customer */}
      <div className="billing-header">
        <div className="table-info">
          <h2 className="current-table-name">Table {activeTable}</h2>
          <span className="current-customer-name">{customerName}</span>
        </div>
        {activeOrder && (
          <button
            className="icon-btn edit-order-btn"
            title="Edit Order"
            onClick={() => openCreateOrder(activeOrder)}
          >
            <Edit2 size={16} />
          </button>
        )}
      </div>

      {/* 2. Order Type Selector */}
      <div className="order-type-selector">
        <button
          type="button"
          className={`type-btn ${orderType === 'dine-in' ? 'active' : ''}`}
          onClick={() => setOrderType('dine-in')}
        >
          Dine In
        </button>
        <button
          type="button"
          className={`type-btn ${orderType === 'take-away' ? 'active' : ''}`}
          onClick={() => setOrderType('take-away')}
        >
          Take Away
        </button>
      </div>

      {/* 3. Cart Items */}
      <div className="cart-items-container">
        {items.length === 0 ? (
          <div className="empty-cart-state">
            <ShoppingBag size={40} strokeWidth={1.5} color="var(--text-light)" />
            <p>No items in active order</p>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Click any dish in the menu to add
            </span>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-info">
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-img"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/44x44/eff6ff/2563eb?text=Food';
                  }}
                />
                <div>
                  <div className="cart-item-name" title={item.name}>
                    {item.name}
                  </div>
                  <div className="cart-item-price">
                    {settings.currency}
                    {item.price.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="cart-item-controls">
                <button
                  className="qty-btn"
                  onClick={() => updateItemQty(item.id, -1)}
                  title="Decrease quantity"
                >
                  <Minus size={12} />
                </button>
                <span className="cart-item-qty">{item.qty}</span>
                <button
                  className="qty-btn"
                  onClick={() => updateItemQty(item.id, 1)}
                  title="Increase quantity"
                >
                  <Plus size={12} />
                </button>
              </div>

              <div className="cart-item-total">
                {settings.currency}
                {(item.price * item.qty).toFixed(2)}
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                title="Remove item"
                style={{ color: 'var(--text-muted)', padding: '2px' }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* 4. Billing Totals Breakdown */}
      <div className="billing-totals-card">
        <div className="total-row">
          <span>Subtotal</span>
          <span>
            {settings.currency}
            {subtotal.toFixed(2)}
          </span>
        </div>
        <div className="total-row">
          <span>Tax ({settings.tax}%)</span>
          <span>
            {settings.currency}
            {taxAmount.toFixed(2)}
          </span>
        </div>
        <div className="total-row discount-row">
          <span>Discount ({settings.discount}%)</span>
          <span>
            -{settings.currency}
            {discountAmount.toFixed(2)}
          </span>
        </div>
        <div className="total-divider"></div>
        <div className="total-row grand-total-row">
          <span>Total</span>
          <span className="grand-total">
            {settings.currency}
            {grandTotal.toFixed(2)}
          </span>
        </div>
      </div>

      {/* 5. Payment Method Selector */}
      <div className="payment-method-block">
        <span className="payment-title">Payment Method</span>
        <div className="payment-options">
          {['Cash', 'Debit Card', 'E-Wallet'].map((method) => (
            <button
              key={method}
              type="button"
              className={`payment-pill ${paymentMethod === method ? 'active' : ''}`}
              onClick={() => setPaymentMethod(method)}
            >
              {method}
            </button>
          ))}
        </div>
      </div>

      {/* 6. Pay Bills CTA */}
      <div className="billing-action-area">
        <button
          type="button"
          className="btn-pay-bills"
          disabled={!activeOrder || items.length === 0}
          onClick={() => payBill(paymentMethod)}
        >
          Pay Bills ({settings.currency}
          {grandTotal.toFixed(2)})
        </button>
      </div>
    </aside>
  );
}
