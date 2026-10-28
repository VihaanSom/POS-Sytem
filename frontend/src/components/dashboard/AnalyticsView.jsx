import React from 'react';
import { TrendingUp, Award, Utensils } from 'lucide-react';
import { usePos } from '../../context/PosContext';

export default function AnalyticsView() {
  const { settings } = usePos();

  const categoriesData = [
    { name: 'Burgers & Sandwiches', pct: 38, count: '142 orders' },
    { name: 'Pizza & Italian', pct: 28, count: '105 orders' },
    { name: 'Pastas & Noodles', pct: 18, count: '68 orders' },
    { name: 'Drinks & Beverages', pct: 16, count: '60 orders' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card">
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>
          Sales &amp; Performance Analytics
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Real-time daily POS transaction breakdown and category distribution
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
          <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Average Ticket Size
            </span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.5rem 0' }}>
              {settings.currency}46.80
            </h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>
              +5.4% from last week
            </span>
          </div>

          <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Top Selling Cuisine
            </span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.5rem 0' }}>
              American Burgers
            </h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>
              38% of total volume
            </span>
          </div>

          <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Dine-In vs Takeaway
            </span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.5rem 0' }}>
              72% / 28%
            </h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              20 Dine-in tables active
            </span>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
          Category Sales Breakdown
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {categoriesData.map((cat) => (
            <div key={cat.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                <span style={{ fontWeight: 600 }}>{cat.name}</span>
                <span style={{ color: 'var(--text-muted)' }}>
                  {cat.pct}% ({cat.count})
                </span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${cat.pct}%`,
                    height: '100%',
                    background: 'var(--primary)',
                    borderRadius: '9999px'
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
