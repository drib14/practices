import React from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function Dashboard({ setView, user, setUser }) {
  const handleLogout = async () => {
    try {
      await axios.post('/auth/logout');
      setUser(null);
      setView('login');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Logout Error',
        text: 'Failed to sign out correctly.',
        confirmButtonColor: '#0f172a'
      });
    }
  };

  const handleLogoutAll = async () => {
    try {
      await axios.post('/auth/logout-all');
      setUser(null);
      setView('login');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Logout Error',
        text: 'Failed to sign out from all devices.',
        confirmButtonColor: '#0f172a'
      });
    }
  };

  if (!user) return null;

  return (
    <main class="dashboard-container">
      
      {/* Top Header */}
      <header class="dashboard-header">
        <div>
          <h1 class="dashboard-title-logo">FixConnect</h1>
          <p class="brand-subtitle">Service Booking Portal</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontWeight: 600 }}>{user.firstName} {user.lastName}</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Role: {user.role?.toUpperCase()}
          </p>
        </div>
      </header>

      {/* Profile Card */}
      <section class="profile-card">
        <header>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '24px', color: 'var(--text-primary)' }}>
            Profile Information
          </h2>
        </header>

        <div class="profile-grid">
          <div class="profile-item">
            <div class="profile-item-label">First Name</div>
            <div class="profile-item-value">{user.firstName}</div>
          </div>
          <div class="profile-item">
            <div class="profile-item-label">Last Name</div>
            <div class="profile-item-value">{user.lastName}</div>
          </div>
          <div class="profile-item">
            <div class="profile-item-label">Username</div>
            <div class="profile-item-value">{user.username}</div>
          </div>
          <div class="profile-item">
            <div class="profile-item-label">Email Address</div>
            <div class="profile-item-value">{user.email}</div>
          </div>
          <div class="profile-item" id="p-role-box" style={user.role === 'provider' ? { borderLeftColor: 'var(--warning)' } : {}}>
            <div class="profile-item-label">Account Role</div>
            <div class="profile-item-value">
              {user.role === 'provider' ? 'Service Provider' : 'Customer'}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <footer class="btn-group">
          <button onClick={handleLogout} class="btn-premium">
            <i class="fa-solid fa-right-from-bracket"></i> Sign Out (Current Device)
          </button>
          <button onClick={handleLogoutAll} class="btn-premium btn-secondary">
            <i class="fa-solid fa-desktop"></i> Sign Out (All Devices)
          </button>
        </footer>
      </section>

    </main>
  );
}
