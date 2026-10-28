import React from 'react';
import { Check, Printer } from 'lucide-react';
import { usePos } from '../../context/PosContext';

export default function ReceiptModal() {
  const { receiptData, setReceiptData, settings } = usePos();

  if (!receiptData) return null;

  return (
    <div className="modal-overlay" onClick={() => setReceiptData(null)}>
      <div
        className="modal-card"
        style={{ maxWidth: '460px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="receipt-header">
          <div className="receipt-check-icon">
            <Check size={28} />
          </div>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Payment Successful!</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            {receiptData.timestamp} &bull; {receiptData.orderId}
          </p>
        </div>

        <div className="modal-body">
          <div className="receipt-bill-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Customer:</span>
              <strong>{receiptData.customer}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Table / Order Type:</span>
              <strong>
                Table {receiptData.table} ({receiptData.orderType})
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Payment Method:</span>
              <strong style={{ color: 'var(--primary)' }}>{receiptData.paymentMethod}</strong>
            </div>
          </div>

          <div style={{ margin: '1rem 0' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Ordered Items
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '150px', overflowY: 'auto' }}>
              {receiptData.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                  <span>
                    {item.qty}x {item.name}
                  </span>
                  <span style={{ fontWeight: 600 }}>
                    {settings.currency}
                    {(item.price * item.qty).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Subtotal</span>
              <span>{settings.currency}{receiptData.subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Tax ({receiptData.taxPercent}%)</span>
              <span>{settings.currency}{receiptData.taxAmount.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)' }}>
              <span>Discount ({receiptData.discountPercent}%)</span>
              <span>-{settings.currency}{receiptData.discountAmount.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800, marginTop: '6px', color: 'var(--text-main)' }}>
              <span>Total Paid</span>
              <span style={{ color: 'var(--primary)' }}>
                {settings.currency}{receiptData.grandTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="modal-footer" style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className="btn btn-outline"
            style={{ flex: 1 }}
            onClick={() => window.print()}
          >
            <Printer size={16} /> Print Receipt
          </button>
          <button
            type="button"
            className="btn btn-primary"
            style={{ flex: 1 }}
            onClick={() => setReceiptData(null)}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
