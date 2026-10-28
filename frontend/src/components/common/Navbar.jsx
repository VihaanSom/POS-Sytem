import React from 'react';
import { usePos } from '../../context/PosContext';

export default function Navbar({ onNavigate, currentPage }) {
  const { user, logout } = usePos();

  return (
    <header className="navbar">
      <div className="nav-container">
        <button onClick={() => onNavigate('landing')} className="nav-logo" title="DashPoint Home">
          <img
            src="/assets/logo.png"
            alt="DashPoint Logo"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/38x38/2563eb/ffffff?text=DP';
            }}
          />
          <span>DashPoint</span>
        </button>

        <nav className="nav-links">
          <button
            onClick={() => onNavigate('landing')}
            className={`nav-item-link ${currentPage === 'landing' ? 'active' : ''}`}
          >
            Features
          </button>
          <button
            onClick={() => onNavigate('about')}
            className={`nav-item-link ${currentPage === 'about' ? 'active' : ''}`}
          >
            About
          </button>
          <button
            onClick={() => onNavigate('contact')}
            className={`nav-item-link ${currentPage === 'contact' ? 'active' : ''}`}
          >
            Contact
          </button>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button onClick={() => onNavigate('dashboard')} className="btn btn-primary">
                POS Dashboard
              </button>
              <button onClick={logout} className="btn btn-outline">
                Log Out
              </button>
            </div>
          ) : (
            <button onClick={() => onNavigate('login')} className="btn btn-primary">
              Log In
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
