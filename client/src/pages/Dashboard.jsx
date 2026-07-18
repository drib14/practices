import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, logoutAllUser } from '../store/slices/authSlice.js';
import Button from '../components/Button.jsx';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  if (!user) return null;

  return (
    <main className="dashboard-container">

      {/* Top Header */}
      <header className="dashboard-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/favicon.png" alt="FixConnect Logo" className="brand-logo-img" style={{ width: '40px', height: '40px' }} onError={(e) => e.target.style.display = 'none'} />
          <div>
            <h1 className="dashboard-title-logo">FixConnect</h1>
            <p className="brand-subtitle">Service Booking Portal</p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontWeight: 600 }}>{user.firstName} {user.lastName}</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Role: {user.role?.toUpperCase()}
          </p>
        </div>
      </header>

      {/* Profile Card */}
      <section className="profile-card">
        <header>
          <h2 className="dashboard-welcome">Welcome back, {user.firstName}!</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Here is your account profile details.
          </p>
        </header>

        <div className="profile-grid">
          <div className="profile-item">
            <div className="profile-item-label">First Name</div>
            <div className="profile-item-value">{user.firstName}</div>
          </div>
          <div className="profile-item">
            <div className="profile-item-label">Last Name</div>
            <div className="profile-item-value">{user.lastName}</div>
          </div>
          <div className="profile-item">
            <div className="profile-item-label">Username</div>
            <div className="profile-item-value">{user.username}</div>
          </div>
          <div className="profile-item">
            <div className="profile-item-label">Email Address</div>
            <div className="profile-item-value">{user.email}</div>
          </div>
          <div className="profile-item" id="p-role-box" style={user.role === 'provider' ? { borderLeftColor: 'var(--warning)' } : {}}>
            <div className="profile-item-label">Account Role</div>
            <div className="profile-item-value">
              {user.role === 'provider' ? 'Service Provider' : 'Customer'}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <footer className="btn-group">
          <Button onClick={() => dispatch(logoutUser())}>
            <i className="fa-solid fa-right-from-bracket"></i> Sign Out (Current Device)
          </Button>
          <Button variant="secondary" onClick={() => dispatch(logoutAllUser())}>
            <i className="fa-solid fa-desktop"></i> Sign Out (All Devices)
          </Button>
        </footer>
      </section>

    </main>
  );
}
