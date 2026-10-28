import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { usePos } from '../../context/PosContext';

/**
 * ============================================================================
 * LEARNING NOTE: CONTROLLED FORMS IN REACT
 * ============================================================================
 * In vanilla JS, you retrieved values on submit using:
 * const name = document.getElementById('res-name').value;
 *
 * In React, we use "controlled components":
 * We bind `<input value={formData.name} onChange={...} />`.
 * The component's state is always the single source of truth!
 * ============================================================================
 */
export default function TablesView({ onSwitchTab }) {
  const {
    tables,
    activeTable,
    setActiveTable,
    reservations,
    addReservation,
    deleteReservation,
    openCreateOrder
  } = usePos();

  const [formData, setFormData] = useState({
    name: '',
    table: 'T1',
    guests: 2,
    time: '19:00'
  });

  const [formErrors, setFormErrors] = useState({});

  const occupiedCount = tables.filter((t) => t.isOccupied).length;
  const vacantCount = 20 - occupiedCount;

  // List of currently vacant tables for reservation dropdown
  const vacantTables = tables.filter((t) => !t.isOccupied);

  const handleTableClick = (table) => {
    setActiveTable(table.id);
    if (!table.isOccupied) {
      openCreateOrder({ table: table.id, customer: '', items: [] });
    } else {
      onSwitchTab('menu');
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Customer name is required.';
    if (!formData.table) errors.table = 'Please select a table.';
    if (!formData.time) errors.time = 'Please pick a reservation time.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    addReservation({
      name: formData.name.trim(),
      table: formData.table,
      guests: Number(formData.guests),
      time: formData.time
    });

    // Reset form
    setFormData({
      name: '',
      table: vacantTables[0]?.id || 'T1',
      guests: 2,
      time: '19:00'
    });
    setFormErrors({});
  };

  return (
    <div className="tables-view-layout">
      {/* 1. FLOOR MAP */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Table Floor Map (20 Tables)</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Click any table to view or create an order
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#94a3b8' }}></span>
              Vacant ({vacantCount})
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)' }}></span>
              Occupied ({occupiedCount})
            </span>
          </div>
        </div>

        <div className="tables-map-grid">
          {tables.map((table) => {
            const isSelected = table.id === activeTable;

            return (
              <div
                key={table.id}
                className={`table-card ${table.isOccupied ? 'occupied' : ''} ${
                  isSelected ? 'active-table' : ''
                }`}
                onClick={() => handleTableClick(table)}
              >
                <div className="table-icon-badge">{table.id}</div>
                {table.isOccupied ? (
                  <>
                    <span className="badge badge-primary" style={{ margin: '4px 0', fontSize: '0.7rem' }}>
                      Occupied
                    </span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{table.order.customer}</span>
                    <span className="table-subinfo">{table.order.items.length} items</span>
                  </>
                ) : (
                  <>
                    <span
                      style={{
                        backgroundColor: '#f1f5f9',
                        color: 'var(--text-muted)',
                        margin: '4px 0',
                        fontSize: '0.7rem',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        fontWeight: 600
                      }}
                    >
                      Vacant
                    </span>
                    <span className="table-subinfo">Click to open</span>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. RESERVATION FORM & LIST */}
      <div className="card">
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.25rem' }}>
          Reserve a Table
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Book upcoming guest arrivals
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Customer Name *</label>
            <input
              type="text"
              placeholder="e.g. Sarah Jenkins"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            {formErrors.name && <div className="error-text">{formErrors.name}</div>}
          </div>

          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label>Table # *</label>
              <select
                value={formData.table}
                onChange={(e) => setFormData({ ...formData, table: e.target.value })}
              >
                {tables.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.id} {t.isOccupied ? '(Occupied)' : '(Vacant)'}
                  </option>
                ))}
              </select>
              {formErrors.table && <div className="error-text">{formErrors.table}</div>}
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label>Guests *</label>
              <input
                type="number"
                min="1"
                max="12"
                value={formData.guests}
                onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Booking Time *</label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            />
            {formErrors.time && <div className="error-text">{formErrors.time}</div>}
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Confirm Reservation
          </button>
        </form>

        <div style={{ marginTop: '2rem' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            Upcoming Reservations ({reservations.length})
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto' }}>
            {reservations.map((res) => (
              <div
                key={res.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.6rem 0.8rem',
                  background: '#f8fafc',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div>
                  <strong style={{ fontSize: '0.85rem' }}>{res.name}</strong> &bull;{' '}
                  <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{res.table}</span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {res.guests} Guests &bull; {res.time}
                  </div>
                </div>
                <button
                  onClick={() => deleteReservation(res.id)}
                  style={{ color: 'var(--danger)', padding: '4px' }}
                  title="Cancel reservation"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
