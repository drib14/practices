import React from 'react';

export default function Button({ children, type = 'button', onClick, variant = 'primary', loading = false, style }) {
  const className = variant === 'secondary' ? 'btn-premium btn-secondary' : 'btn-premium';
  
  return (
    <button 
      type={type} 
      className={className} 
      onClick={onClick} 
      disabled={loading} 
      style={style}
    >
      {loading ? (
        <span><i className="fa-solid fa-circle-notch fa-spin"></i> Processing...</span>
      ) : children}
    </button>
  );
}
