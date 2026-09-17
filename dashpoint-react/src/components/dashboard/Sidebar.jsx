import React from 'react';
import {
  UtensilsCrossed,
  LayoutDashboard,
  ReceiptText,
  Users,
  TrendingUp,
  MessageSquare,
  Settings,
  LogOut
} from 'lucide-react';
import { usePos } from '../../context/PosContext';

/**
 * ============================================================================
 * LEARNING NOTE: DECLARATIVE NAVIGATION IN REACT
 * ============================================================================
 * In vanilla JS, you used:
 * document.querySelectorAll('.nav-link').forEach(...)
 * and manually added/removed class 'active', then hid/showed DOM sections.
 *
 * In React, navigation is driven by a single state variable: `currentTab`.
 * If `currentTab === item.id`, we render the `active` class!
 * ============================================================================
 */
export default function Sidebar({ currentTab, setCurrentTab, onExit }) {
  const { orders } = usePos();

  const menuItems = [
    { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ReceiptText, badge: orders.length },
    { id: 'tables', label: 'Tables', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside className="sidebar">
      <div className="brand-container">
        <button onClick={onExit} className="brand-logo" title="DashPoint Home">
          <img
            src="/assets/logo.png"
            alt="DashPoint"
            className="brand-logo-img"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/38x38/2563eb/ffffff?text=DP';
            }}
          />
          <span className="brand-text">
            DashPoint<span className="brand-dot">.</span>
          </span>
        </button>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`nav-link ${isActive ? 'active' : ''}`}
              title={item.label}
            >
              <Icon size={20} />
              <span>{item.label}</span>
              {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button onClick={onExit} className="logout-link" title="Return to Website">
          <LogOut size={18} />
          <span>Exit</span>
        </button>
      </div>
    </aside>
  );
}
