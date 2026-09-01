import { useState, useEffect, useCallback } from 'react';

let showToast = null;
let toastCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = ++toastCounter;
    setToasts(prev => [...prev, { id, message, type }]);
    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
  }, []);

  showToast = addToast;

  return (
    <>
      {children}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        {toasts.map(toast => (
          <div
            key={toast.id}
            style={{
              padding: '12px 20px',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              background: toast.type === 'error' ? '#ef4444' :
                         toast.type === 'success' ? '#22c55e' :
                         toast.type === 'warning' ? '#f59e0b' : '#3b82f6',
              animation: 'slideIn 0.3s ease'
            }}
          >
            {toast.message}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}

export function toast(message, type = 'info') {
  if (showToast) {
    showToast(message, type);
  }
}
