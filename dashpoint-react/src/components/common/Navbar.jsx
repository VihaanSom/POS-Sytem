import React from 'react';

export default function Navbar({ onNavigate, currentPage }) {
  return (
    <header className="navbar">
      <div className="nav-container">
        <button onClick={() => onNavigate('landing')} className="nav-logo">
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
          <button onClick={() => onNavigate('landing')} className="nav-item-link">
            Features
          </button>
          <button onClick={() => onNavigate('contact')} className="nav-item-link">
            Contact
          </button>
          <button onClick={() => onNavigate('login')} className="btn btn-outline">
            Log In
          </button>
          <button onClick={() => onNavigate('dashboard')} className="btn btn-primary">
            Launch POS
          </button>
        </nav>
      </div>
    </header>
  );
}
