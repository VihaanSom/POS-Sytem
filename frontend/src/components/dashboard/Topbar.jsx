import React from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { usePos } from '../../context/PosContext';

export default function Topbar({ currentTab }) {
  const { searchQuery, setSearchQuery, user, showToast } = usePos();

  const titles = {
    menu: 'Menu',
    dashboard: 'Dashboard Overview',
    orders: 'Orders Management',
    tables: 'Tables & Reservations',
    analytics: 'Analytics & Insights',
    chat: 'Kitchen & Staff Chat',
    settings: 'POS Settings'
  };

  return (
    <header className="topbar">
      <div className="topbar-title-area">
        <h1 className="page-heading">{titles[currentTab] || 'Menu'}</h1>
      </div>

      {currentTab === 'menu' && (
        <div className="topbar-search">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search dishes by name or ingredient..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="topbar-actions">
        <button
          className="icon-btn"
          title="Notifications"
          onClick={() => showToast('All kitchen stations are operational.', 'info')}
        >
          <Bell size={20} />
          <span className="notif-indicator"></span>
        </button>

        <div className="user-profile-pill">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
            alt={user?.name || 'User'}
            className="user-avatar"
          />
          <span className="user-name">{user?.name || 'Easton Cox'}</span>
          <ChevronDown size={16} color="var(--text-muted)" />
        </div>
      </div>
    </header>
  );
}
