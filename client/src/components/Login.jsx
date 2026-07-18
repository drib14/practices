import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function Login({ setView, setUser, resetToken }) {
  // Mode can be 'login', 'forgot', or 'reset'
  const [mode, setMode] = useState(resetToken ? 'reset' : 'login');

  // Input states
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  
  const [newPassword, setNewPassword] = useState('');
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  useEffect(() => {
    if (resetToken) {
      setMode('reset');
    }
  }, [resetToken]);

  // Evaluate Password rules dynamically (8 Chars minimum)
  const handlePasswordChange = (val) => {
    setNewPassword(val);
    setPasswordChecks({
      length: val.length >= 8,
      uppercase: /[A-Z]/.test(val),
      lowercase: /[a-z]/.test(val),
      number: /[0-9]/.test(val),
      special: /[!@#$%^&*(),.?":{}|<>_+-]/.test(val)
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!usernameOrEmail || !password) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'All fields are required.', confirmButtonColor: '#0f172a' });
      return;
    }

    try {
      const res = await axios.post('/auth/login', { usernameOrEmail, password });
      setUser(res.data.user);
      setView('dashboard');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Login Error',
        text: err.response?.data?.error || 'Invalid credentials.',
        confirmButtonColor: '#0f172a'
      });
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Email is required.', confirmButtonColor: '#0f172a' });
      return;
    }

    try {
      const res = await axios.post('/auth/forgot-password', { email });
      Swal.fire({
        icon: 'info',
        title: 'Check Your Inbox',
        text: res.data.message,
        confirmButtonColor: '#0f172a'
      }).then(() => {
        setMode('login');
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Request Failed',
        text: err.response?.data?.error || 'An error occurred.',
        confirmButtonColor: '#0f172a'
      });
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    const isStrong = Object.values(passwordChecks).every(v => v);
    if (!isStrong) {
      Swal.fire({
        icon: 'error',
        title: 'Weak Password',
        text: 'Please satisfy all password safety criteria.',
        confirmButtonColor: '#0f172a'
      });
      return;
    }

    try {
      const res = await axios.post('/auth/reset-password', { token: resetToken, newPassword });
      Swal.fire({
        icon: 'success',
        title: 'Reset Complete',
        text: res.data.message,
        confirmButtonColor: '#0f172a'
      }).then(() => {
        setView('login');
        setMode('login');
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Reset Failed',
        text: err.response?.data?.error || 'Failed to reset password.',
        confirmButtonColor: '#0f172a'
      });
    }
  };

  return (
    <main class="glass-card">
      
      {/* 1. LOGIN MODE */}
      {mode === 'login' && (
        <section>
          <header class="brand-header">
            <img src="/favicon.png" alt="FixConnect Logo" class="brand-logo-img" onError={(e) => e.target.style.display = 'none'} />
            <h1 class="brand-logo">FixConnect</h1>
            <p class="brand-subtitle">Enter your credentials to sign in</p>
          </header>

          <form onSubmit={handleLoginSubmit} novalidate>
            <div class="form-group">
              <label class="form-label">Username or Email</label>
              <div class="input-wrapper">
                <i class="fa-solid fa-user input-icon"></i>
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Enter username or email" 
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Password</label>
              <div class="input-wrapper">
                <i class="fa-solid fa-lock input-icon"></i>
                <input 
                  type="password" 
                  class="form-control" 
                  placeholder="Enter password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            </div>

            <button type="submit" class="btn-premium">Sign In</button>
          </form>

          <footer class="auth-footer">
            <p style={{ marginBottom: '8px' }}>
              <span onClick={() => setMode('forgot')} class="auth-link">Forgot Password?</span>
            </p>
            <p>Don't have an account? <span onClick={() => setView('register')} class="auth-link">Register here</span></p>
          </footer>
        </section>
      )}

      {/* 2. FORGOT MODE */}
      {mode === 'forgot' && (
        <section>
          <header class="brand-header">
            <img src="/favicon.png" alt="FixConnect Logo" class="brand-logo-img" onError={(e) => e.target.style.display = 'none'} />
            <h2 class="brand-logo">Reset Password</h2>
            <p class="brand-subtitle">Enter email to receive password reset link</p>
          </header>

          <form onSubmit={handleForgotSubmit} novalidate>
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <div class="input-wrapper">
                <i class="fa-solid fa-envelope input-icon"></i>
                <input 
                  type="email" 
                  class="form-control" 
                  placeholder="yourname@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <button type="submit" class="btn-premium">Send Reset Link</button>
            <button type="button" onClick={() => setMode('login')} class="btn-premium btn-secondary" style={{ marginTop: '12px' }}>
              Back to Login
            </button>
          </form>
        </section>
      )}

      {/* 3. RESET MODE */}
      {mode === 'reset' && (
        <section>
          <header class="brand-header">
            <img src="/favicon.png" alt="FixConnect Logo" class="brand-logo-img" onError={(e) => e.target.style.display = 'none'} />
            <h2 class="brand-logo">New Password</h2>
            <p class="brand-subtitle">Choose a secure password for your account</p>
          </header>

          <form onSubmit={handleResetSubmit} novalidate>
            <div class="form-group">
              <label class="form-label">New Password</label>
              <div class="input-wrapper">
                <i class="fa-solid fa-lock input-icon"></i>
                <input 
                  type="password" 
                  class="form-control" 
                  placeholder="Minimum 8 characters" 
                  value={newPassword}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  required 
                />
              </div>
              
              <div class="password-checklists">
                <span class={`check-item ${passwordChecks.length ? 'valid' : 'invalid'}`}>
                  <i class={`fa-solid ${passwordChecks.length ? 'fa-circle-check' : 'fa-circle-xmark'}`}></i> 8+ Chars
                </span>
                <span class={`check-item ${passwordChecks.uppercase ? 'valid' : 'invalid'}`}>
                  <i class={`fa-solid ${passwordChecks.uppercase ? 'fa-circle-check' : 'fa-circle-xmark'}`}></i> Uppercase
                </span>
                <span class={`check-item ${passwordChecks.lowercase ? 'valid' : 'invalid'}`}>
                  <i class={`fa-solid ${passwordChecks.lowercase ? 'fa-circle-check' : 'fa-circle-xmark'}`}></i> Lowercase
                </span>
                <span class={`check-item ${passwordChecks.number ? 'valid' : 'invalid'}`}>
                  <i class={`fa-solid ${passwordChecks.number ? 'fa-circle-check' : 'fa-circle-xmark'}`}></i> Number
                </span>
                <span class={`check-item ${passwordChecks.special ? 'valid' : 'invalid'}`}>
                  <i class={`fa-solid ${passwordChecks.special ? 'fa-circle-check' : 'fa-circle-xmark'}`}></i> Special Char
                </span>
              </div>
            </div>

            <button type="submit" class="btn-premium">Update Password</button>
          </form>
        </section>
      )}

    </main>
  );
}
