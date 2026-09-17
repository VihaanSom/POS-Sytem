import React, { useState } from 'react';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { usePos } from '../context/PosContext';

export default function LoginPage({ onNavigate }) {
  const { setUser, showToast } = usePos();
  const [email, setEmail] = useState('easton@dashpoint.com');
  const [password, setPassword] = useState('password123');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!emailRegex.test(email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setUser({
      name: 'Easton Cox',
      email: email.trim(),
      role: 'Store Manager'
    });

    showToast('Welcome back, Easton! Opening POS...', 'success');
    onNavigate('dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
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
          <h2>Welcome Back</h2>
          <p>Sign in with your restaurant staff credentials</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {errors.email && <div className="error-text">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <div className="error-text">{errors.password}</div>}
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
            Log In to POS <ArrowRight size={16} />
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <button onClick={() => onNavigate('register')} style={{ color: 'var(--primary)', fontWeight: 600 }}>
              Sign up
            </button>
          </p>
          <p style={{ marginTop: '0.5rem' }}>
            <button onClick={() => onNavigate('landing')} style={{ color: 'var(--text-muted)' }}>
              &larr; Back to Website
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
