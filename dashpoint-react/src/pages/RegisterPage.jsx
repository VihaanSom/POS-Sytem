import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { usePos } from '../context/PosContext';

export default function RegisterPage({ onNavigate }) {
  const { setUser, showToast } = usePos();
  const [formData, setFormData] = useState({
    name: '',
    restaurant: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!formData.name.trim()) errs.name = 'Full name is required.';
    if (!formData.restaurant.trim()) errs.restaurant = 'Restaurant name is required.';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      errs.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setUser({
      name: formData.name.trim(),
      email: formData.email.trim(),
      restaurant: formData.restaurant.trim(),
      role: 'Owner / Manager'
    });

    showToast(`Account registered for ${formData.restaurant}! Welcome!`, 'success');
    onNavigate('dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: '480px' }}>
        <div className="auth-header">
          <button onClick={() => onNavigate('landing')} className="nav-logo" style={{ margin: '0 auto 0.5rem' }}>
            <img
              src="/assets/logo.png"
              alt="DashPoint"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/38x38/2563eb/ffffff?text=DP';
              }}
            />
            <span>DashPoint</span>
          </button>
          <h2>Create Restaurant Account</h2>
          <p>Get started with DashPoint Cloud POS today</p>
        </div>

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              placeholder="e.g. Easton Cox"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            {errors.name && <div className="error-text">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label>Restaurant Name *</label>
            <input
              type="text"
              placeholder="e.g. DashPoint Grand Bistro"
              value={formData.restaurant}
              onChange={(e) => setFormData({ ...formData, restaurant: e.target.value })}
            />
            {errors.restaurant && <div className="error-text">{errors.restaurant}</div>}
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              placeholder="manager@restaurant.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {errors.email && <div className="error-text">{errors.email}</div>}
          </div>

          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label>Password *</label>
              <input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              {errors.password && <div className="error-text">{errors.password}</div>}
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label>Confirm Password *</label>
              <input
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
              {errors.confirmPassword && <div className="error-text">{errors.confirmPassword}</div>}
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
            Create Account &amp; Enter POS <ArrowRight size={16} />
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <button onClick={() => onNavigate('login')} style={{ color: 'var(--primary)', fontWeight: 600 }}>
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
