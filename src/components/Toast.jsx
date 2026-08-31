import React from 'react';

function Toast({ message, actionLabel, onAction }) {
  if (!message) return null;

  return (
    <div 
      role="status"
      aria-live="polite"
      style={{
      position: 'fixed',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#333',
      color: '#fff',
      padding: '12px 24px',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 1000,
      fontFamily: 'inherit'
    }}>
      <span style={{ fontSize: '1rem' }}>{message}</span>
      {actionLabel && onAction && (
        <button 
          onClick={onAction}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: '#4dabf7',
            fontWeight: 'bold',
            cursor: 'pointer',
            padding: 0,
            fontSize: '1rem'
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default Toast;
