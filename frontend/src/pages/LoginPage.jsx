import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { usePos } from '../context/PosContext';
import api from '../services/api';

export default function LoginPage({ onNavigate }) {
  const { setUser, showToast } = usePos();
  const [email, setEmail] = useState('admin@dashpoint.pos');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email address or username is required.';
    }

    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 5) {
      errs.password = 'Password must be at least 5 characters.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await api.auth.login({ email: email.trim(), password });
      if (res.token) {
        localStorage.setItem('dashpoint_token', res.token);
      }
      setUser(res.user);
      showToast(`Welcome back, ${res.user.name}! Opening POS...`, 'success');
      onNavigate('dashboard');
    } catch (err) {
      showToast(err.message || 'Invalid credentials', 'error');
    } finally {
      setLoading(false);
    }
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
                disabled={loading}
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
              disabled={loading}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <div className="error-text">{errors.password}</div>}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Logging In...
              </>
            ) : (
              <>
                Log In to POS <ArrowRight size={16} />
              </>
            )}
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
