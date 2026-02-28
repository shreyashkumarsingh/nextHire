import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

const Toast = ({ message, type = 'success', duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!isVisible) return null;

  const bgColor = type === 'success' ? '#10b981' : '#ef4444';
  const bgLight = type === 'success' ? '#d1fae5' : '#fee2e2';
  const textColor = type === 'success' ? '#065f46' : '#7f1d1d';

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        backgroundColor: '#ffffff',
        border: `2px solid ${bgColor}`,
        borderRadius: '12px',
        padding: '16px 20px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minWidth: '300px',
        maxWidth: '400px',
        zIndex: 9999,
        animation: 'slideIn 0.3s ease-out'
      }}
    >
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
      
      <div
        style={{
          backgroundColor: bgLight,
          borderRadius: '50%',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        {type === 'success' ? (
          <CheckCircle style={{ width: '24px', height: '24px', color: bgColor }} />
        ) : (
          <AlertCircle style={{ width: '24px', height: '24px', color: bgColor }} />
        )}
      </div>

      <div style={{ flex: 1 }}>
        <p style={{ color: textColor, fontWeight: '600', margin: 0, fontSize: '14px' }}>
          {message}
        </p>
      </div>

      <button
        onClick={() => setIsVisible(false)}
        style={{
          background: 'none',
          border: 'none',
          color: '#9ca3af',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <X style={{ width: '20px', height: '20px' }} />
      </button>
    </div>
  );
};

export default Toast;
