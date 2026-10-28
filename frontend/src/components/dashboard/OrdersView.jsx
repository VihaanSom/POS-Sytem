import React from 'react';
import { Plus, Edit2, Trash2, ArrowRight } from 'lucide-react';
import { usePos } from '../../context/PosContext';

export default function OrdersView({ onSwitchTab }) {
  const { orders, setActiveTable, openCreateOrder, deleteOrder, settings } = usePos();

  const handleManageOrder = (table) => {
    setActiveTable(table);
    onSwitchTab('menu');
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Active Restaurant Orders</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Real-time tracking of all active kitchen &amp; dining tables
          </p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => openCreateOrder()}>
          <Plus size={16} /> Create Order
        </button>
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
          <p>No active orders in the restaurant right now.</p>
          <button className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }} onClick={() => openCreateOrder()}>
            Start a New Order
          </button>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Table</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const totalAmount = order.items.reduce((sum, item) => sum + item.price * item.qty, 0);
                const itemsCount = order.items.reduce((sum, item) => sum + item.qty, 0);

                return (
                  <tr key={order.id}>
                    <td><strong>{order.id}</strong></td>
                    <td>
                      <span className="badge badge-primary">{order.table}</span>
                    </td>
                    <td>{order.customer}</td>
                    <td>{itemsCount} items</td>
                    <td>
                      <strong>
                        {settings.currency}
                        {totalAmount.toFixed(2)}
                      </strong>
                    </td>
                    <td>
                      <span
                        className={`status-pill ${
                          order.status === 'Ready' ? 'status-ready' : 'status-process'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => handleManageOrder(order.table)}
                          title="Manage in Billing Sidebar"
                        >
                          Manage <ArrowRight size={14} />
                        </button>
                        <button
                          className="icon-btn"
                          style={{ width: '32px', height: '32px' }}
                          onClick={() => openCreateOrder(order)}
                          title="Edit Details"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          className="icon-btn"
                          style={{ width: '32px', height: '32px', color: 'var(--danger)' }}
                          onClick={() => deleteOrder(order.id)}
                          title="Delete Order"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
