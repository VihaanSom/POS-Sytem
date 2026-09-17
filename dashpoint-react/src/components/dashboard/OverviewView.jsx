import React from 'react';
import { DollarSign, ShoppingCart, Users } from 'lucide-react';
import { usePos } from '../../context/PosContext';

export default function OverviewView({ onSwitchTab }) {
  const { orders, tables, settings, openCreateOrder, setIsAddDishOpen, user } = usePos();

  const occupiedCount = tables.filter((t) => t.isOccupied).length;
  const vacantCount = 20 - occupiedCount;

  // Compute total active order revenue
  const currentActiveRevenue = orders.reduce((total, order) => {
    return total + order.items.reduce((s, i) => s + i.price * i.qty, 0);
  }, 0);

  const estimatedTodayRevenue = (1428.5 + currentActiveRevenue).toFixed(2);

  return (
    <div className="view-dashboard">
      {/* 1. KPI CARDS */}
      <div className="overview-grid">
        <div className="kpi-card">
          <div className="kpi-icon-wrap kpi-blue">
            <DollarSign size={26} />
          </div>
          <div>
            <span className="kpi-label">Today's Revenue</span>
            <h3 className="kpi-value">
              {settings.currency}
              {estimatedTodayRevenue}
            </h3>
            <span className="kpi-trend positive">+14.2% vs yesterday</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap kpi-green">
            <ShoppingCart size={26} />
          </div>
          <div>
            <span className="kpi-label">Total Orders</span>
            <h3 className="kpi-value">{35 + orders.length}</h3>
            <span className="kpi-trend positive">+{orders.length} active now</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap kpi-amber">
            <Users size={26} />
          </div>
          <div>
            <span className="kpi-label">Active Tables</span>
            <h3 className="kpi-value">
              {occupiedCount} / 20
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {vacantCount} vacant tables available
            </span>
          </div>
        </div>
      </div>

      {/* 2. RESTAURANT INFORMATION & QUICK ACTIONS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
            Restaurant Information
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Restaurant:</span>
              <strong>DashPoint Grand Multicuisine</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Location:</span>
              <span>742 Evergreen Terrace</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Manager on Duty:</span>
              <span>{user?.name || 'Easton Cox'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Current Status:</span>
              <span className="badge badge-success">Open for Dine-In &amp; Takeaway</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
            Quick Actions
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <button className="btn btn-primary" onClick={() => openCreateOrder()}>
              + Create Order
            </button>
            <button className="btn btn-outline" onClick={() => onSwitchTab('tables')}>
              Book a Table
            </button>
            <button className="btn btn-outline" onClick={() => setIsAddDishOpen(true)}>
              + Add New Dish
            </button>
            <button className="btn btn-outline" onClick={() => onSwitchTab('orders')}>
              View All Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
