import React from 'react';

export const AlertMessage = ({ message, variant = 'info', onClose }) => {
  if (!message) return null;

  return (
    <div 
      className={`alert alert-${variant} rounded-0 border-0 shadow-sm d-flex justify-content-between align-items-center py-3 px-4 fs-7`}
      role="alert"
    >
      <div className="flex-grow-1">{message}</div>
      {onClose && (
        <button 
          type="button" 
          className="btn-close ms-3 border-0 bg-transparent" 
          aria-label="Close"
          onClick={onClose}
          style={{ filter: 'none', opacity: 0.6 }}
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default AlertMessage;
