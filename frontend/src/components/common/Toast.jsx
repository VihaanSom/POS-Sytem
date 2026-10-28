import React from 'react';
import { usePos } from '../../context/PosContext';

/**
 * ============================================================================
 * LEARNING NOTE: DECLARATIVE TOASTS IN REACT
 * ============================================================================
 * In vanilla JS, you used `document.createElement('div')` and `container.appendChild`.
 * In React, we simply map over an array in state (`toasts.map(...)`).
 * Whenever `toasts` changes, React automatically renders or unmounts the toasts!
 * ============================================================================
 */
export default function Toast() {
  const { toasts, removeToast } = usePos();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-message toast-${toast.type}`}>
          <span>{toast.message}</span>
          <button
            className="toast-close-btn"
            onClick={() => removeToast(toast.id)}
            aria-label="Close notification"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}
