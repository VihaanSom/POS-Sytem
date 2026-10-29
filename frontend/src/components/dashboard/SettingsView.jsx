import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { usePos } from '../../context/PosContext';

export default function SettingsView() {
  const { settings, setSettings, showToast } = usePos();

  const [formSettings, setFormSettings] = useState({
    tax: settings.tax,
    discount: settings.discount,
    currency: settings.currency
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    try {
      await setSettings(formSettings);
      showToast('POS settings saved successfully!', 'success');
    } catch (err) {
      showToast('Failed to save settings on server', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '600px' }}>
      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.25rem' }}>
        POS Configuration &amp; Taxes
      </h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        Adjust taxation rates, promotional discount defaults, and currency formatting
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tax Percentage (%)</label>
          <input
            type="number"
            min="0"
            max="40"
            step="0.1"
            value={formSettings.tax}
            onChange={(e) => setFormSettings({ ...formSettings, tax: parseFloat(e.target.value) || 0 })}
            required
          />
        </div>

        <div className="form-group">
          <label>Default Discount Percentage (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={formSettings.discount}
            onChange={(e) =>
              setFormSettings({ ...formSettings, discount: parseFloat(e.target.value) || 0 })
            }
            required
          />
        </div>

        <div className="form-group">
          <label>Currency Symbol</label>
          <input
            type="text"
            maxLength="3"
            value={formSettings.currency}
            onChange={(e) => setFormSettings({ ...formSettings, currency: e.target.value })}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ marginTop: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Saving Settings...
            </>
          ) : (
            'Save Settings'
          )}
        </button>
      </form>
    </div>
  );
}
