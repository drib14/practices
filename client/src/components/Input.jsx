import React, { useState } from 'react';

export default function Input({ label, icon, type = 'text', placeholder, value, onChange, required = false }) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <div className="input-wrapper">
        {icon && <i className={`${icon} input-icon`}></i>}
        <input 
          type={inputType} 
          className="form-control" 
          placeholder={placeholder} 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          required={required} 
          style={isPassword ? { paddingRight: '40px' } : {}}
        />
        {isPassword && (
          <button
            type="button"
            className="password-toggle-btn"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            style={{
              position: 'absolute',
              right: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: 0,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
          </button>
        )}
      </div>
    </div>
  );
}
