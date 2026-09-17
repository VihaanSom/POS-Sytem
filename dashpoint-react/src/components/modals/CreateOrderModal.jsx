import React, { useState, useEffect } from 'react';
import { Plus, Minus, Search } from 'lucide-react';
import { usePos } from '../../context/PosContext';

export default function CreateOrderModal() {
  const {
    isCreateOrderOpen,
    closeCreateOrder,
    orderToEdit,
    saveOrder,
    tables,
    allDishes,
    settings
  } = usePos();

  const [orderType, setOrderType] = useState('dine-in');
  const [customer, setCustomer] = useState('');
  const [status, setStatus] = useState('in process');
  const [table, setTable] = useState('T1');
  const [guests, setGuests] = useState(2);
  const [phoneOrAddress, setPhoneOrAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [dishSearch, setDishSearch] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (orderToEdit) {
      setOrderType(orderToEdit.orderType || 'dine-in');
      setCustomer(orderToEdit.customer || '');
      setStatus(orderToEdit.status || 'in process');
      setTable(orderToEdit.table || 'T1');
      setGuests(orderToEdit.guests || 2);
      setPhoneOrAddress(orderToEdit.phoneOrAddress || '');
      setNotes(orderToEdit.notes || '');
      setSelectedItems(orderToEdit.items ? [...orderToEdit.items] : []);
    } else {
      // Find first vacant table
      const firstVacant = tables.find((t) => !t.isOccupied);
      setTable(firstVacant ? firstVacant.id : 'T1');
      setOrderType('dine-in');
      setCustomer('');
      setStatus('in process');
      setGuests(2);
      setPhoneOrAddress('');
      setNotes('');
      setSelectedItems([]);
    }
    setErrors({});
  }, [orderToEdit, isCreateOrderOpen, tables]);

  if (!isCreateOrderOpen) return null;

  // Add dish to modal selection
  const handleAddDish = (dish) => {
    setSelectedItems((prev) => {
      const idx = prev.findIndex((i) => i.id === dish.id);
      if (idx > -1) {
        return prev.map((item, i) =>
          i === idx ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...dish, qty: 1 }];
    });
  };

  const handleUpdateQty = (dishId, delta) => {
    setSelectedItems((prev) =>
      prev
        .map((item) => {
          if (item.id === dishId) {
            const nextQty = item.qty + delta;
            return nextQty > 0 ? { ...item, qty: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  // Filter dishes in picker
  const filteredDishes = allDishes.filter((d) =>
    d.name.toLowerCase().includes(dishSearch.toLowerCase())
  );

  const itemsSubtotal = selectedItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!customer.trim()) newErrors.customer = 'Customer name is required.';
    if (orderType === 'dine-in' && !table) newErrors.table = 'Table is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    saveOrder({
      id: orderToEdit?.id,
      customer: customer.trim(),
      table: orderType === 'dine-in' ? table : 'Takeaway',
      orderType,
      status,
      guests,
      phoneOrAddress,
      notes,
      items: selectedItems
    });
  };

  return (
    <div className="modal-overlay" onClick={closeCreateOrder}>
      <div
        className="modal-card"
        style={{ maxWidth: '650px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h3>{orderToEdit ? 'Edit Order' : 'Create New Order'}</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Configure guest details, table assignment, and food items
            </p>
          </div>
          <button className="modal-close" onClick={closeCreateOrder}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* Order Type Segment */}
          <div className="form-group">
            <label>Order Type</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['dine-in', 'take-away', 'delivery'].map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`btn ${orderType === type ? 'btn-primary' : 'btn-outline'} btn-sm`}
                  style={{ textTransform: 'capitalize', flex: 1 }}
                  onClick={() => setOrderType(type)}
                >
                  {type.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group" style={{ flex: 2 }}>
              <label>Customer Name *</label>
              <input
                type="text"
                placeholder="e.g. Sophia Martinez"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
              />
              {errors.customer && <div className="error-text">{errors.customer}</div>}
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label>Initial Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="in process">In Kitchen</option>
                <option value="Ready">Ready to Serve</option>
              </select>
            </div>
          </div>

          {orderType === 'dine-in' ? (
            <div className="form-row">
              <div className="form-group" style={{ flex: 2 }}>
                <label>Table Assignment *</label>
                <select value={table} onChange={(e) => setTable(e.target.value)}>
                  {tables.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.id} {t.isOccupied && t.id !== orderToEdit?.table ? '(Occupied)' : '(Available)'}
                    </option>
                  ))}
                </select>
                {errors.table && <div className="error-text">{errors.table}</div>}
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label>Guests</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="form-group">
              <label>Contact Phone / Delivery Address</label>
              <input
                type="text"
                placeholder="e.g. (555) 234-5678 or 104 Main Street"
                value={phoneOrAddress}
                onChange={(e) => setPhoneOrAddress(e.target.value)}
              />
            </div>
          )}

          {/* Dishes Selector */}
          <div style={{ marginTop: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <label style={{ margin: 0 }}>Add Menu Items ({selectedItems.length} selected)</label>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>
                Subtotal: {settings.currency}{itemsSubtotal.toFixed(2)}
              </span>
            </div>

            <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
              <input
                type="text"
                placeholder="Search dishes to add..."
                value={dishSearch}
                onChange={(e) => setDishSearch(e.target.value)}
                style={{ paddingLeft: '32px' }}
              />
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
            </div>

            <div style={{ maxHeight: '140px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {filteredDishes.slice(0, 8).map((dish) => {
                const inOrder = selectedItems.find((i) => i.id === dish.id);
                return (
                  <div
                    key={dish.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 10px',
                      background: '#f8fafc',
                      borderRadius: 'var(--radius-sm)'
                    }}
                  >
                    <span style={{ fontSize: '0.85rem' }}>
                      <strong>{dish.name}</strong> - {settings.currency}{dish.price.toFixed(2)}
                    </span>
                    {inOrder ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button type="button" className="qty-btn" onClick={() => handleUpdateQty(dish.id, -1)}>
                          <Minus size={12} />
                        </button>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{inOrder.qty}</span>
                        <button type="button" className="qty-btn" onClick={() => handleUpdateQty(dish.id, 1)}>
                          <Plus size={12} />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                        onClick={() => handleAddDish(dish)}
                      >
                        + Add
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label>Kitchen Notes / Special Requests</label>
            <input
              type="text"
              placeholder="e.g. Extra sauce, no onions, gluten-free prep"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="modal-footer" style={{ padding: '1rem 0 0' }}>
            <button type="button" className="btn btn-outline" onClick={closeCreateOrder}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {orderToEdit ? 'Save Changes' : 'Create Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
