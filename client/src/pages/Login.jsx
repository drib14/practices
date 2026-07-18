import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import { loginUser, forgotPasswordUser, resetPasswordUser } from '../store/slices/authSlice.js';
import { checkPasswordStrength } from '../utils/password.js';
import api from '../utils/api.js';

export default function Login({ setView }) {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const [mode, setMode] = useState('login'); // 'login' | 'forgot' | 'reset'

  // Login fields
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');

  // Forgot password field
  const [email, setEmail] = useState('');

  // Reset password fields
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordChecks, setPasswordChecks] = useState({
    length: false, uppercase: false, lowercase: false, number: false, special: false
  });

  // Verify email token on mount (from registration verification link)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const verifyToken = urlParams.get('token');

    if (verifyToken) {
      Swal.fire({
        title: 'Verifying Email...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      api.get(`/auth/verify?token=${verifyToken}`)
        .then((res) => {
          Swal.fire({
            icon: 'success',
            title: 'Verified!',
            text: res.data.message,
            confirmButtonColor: '#0f172a'
          }).then(() => {
            window.history.replaceState({}, document.title, window.location.pathname);
          });
        })
        .catch((err) => {
          Swal.fire({
            icon: 'error',
            title: 'Verification Failed',
            text: err.response?.data?.error || 'Invalid or expired token.',
            confirmButtonColor: '#0f172a'
          }).then(() => {
            window.history.replaceState({}, document.title, window.location.pathname);
          });
        });
    }
  }, []);

  const handlePasswordChange = (val) => {
    setNewPassword(val);
    setPasswordChecks(checkPasswordStrength(val));
  };

  // --- Handlers ---

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!usernameOrEmail || !password) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'All fields are required.', confirmButtonColor: '#0f172a' });
      return;
    }
    dispatch(loginUser({ usernameOrEmail, password }));
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Email is required.', confirmButtonColor: '#0f172a' });
      return;
    }
    dispatch(forgotPasswordUser({ email })).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        setMode('reset'); // Transition directly to the code entry view
      }
    });
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Please enter the 6-digit verification code.', confirmButtonColor: '#0f172a' });
      return;
    }
    const isStrong = Object.values(passwordChecks).every(v => v);
    if (!isStrong) {
      Swal.fire({ icon: 'error', title: 'Weak Password', text: 'Please satisfy all password safety criteria.', confirmButtonColor: '#0f172a' });
      return;
    }
    dispatch(resetPasswordUser({ email, code: otpCode, newPassword })).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        setMode('login');
        setEmail('');
        setOtpCode('');
        setNewPassword('');
      }
    });
  };

  return (
    <main className="glass-card">

      {/* ─── LOGIN MODE ─── */}
      {mode === 'login' && (
        <section>
          <header className="brand-header">
            <img src="/favicon.png" alt="FixConnect Logo" className="brand-logo-img" onError={(e) => e.target.style.display = 'none'} />
            <h1 className="brand-logo">FixConnect</h1>
            <p className="brand-subtitle">Enter your credentials to sign in</p>
          </header>

          <form onSubmit={handleLoginSubmit} noValidate>
            <Input label="Username or Email" icon="fa-solid fa-user" placeholder="Enter username or email" value={usernameOrEmail} onChange={setUsernameOrEmail} required />
            <Input label="Password" icon="fa-solid fa-lock" type="password" placeholder="Enter password" value={password} onChange={setPassword} required />
            <Button type="submit" loading={loading}>Sign In</Button>
          </form>

          <footer className="auth-footer">
            <p style={{ marginBottom: '8px' }}>
              <span onClick={() => setMode('forgot')} className="auth-link">Forgot Password?</span>
            </p>
            <p>Don't have an account? <span onClick={() => setView('register')} className="auth-link">Register here</span></p>
          </footer>
        </section>
      )}

      {/* ─── FORGOT PASSWORD MODE ─── */}
      {mode === 'forgot' && (
        <section>
          <header className="brand-header">
            <img src="/favicon.png" alt="FixConnect Logo" className="brand-logo-img" onError={(e) => e.target.style.display = 'none'} />
            <h2 className="brand-logo">Forgot Password</h2>
            <p className="brand-subtitle">We'll send a 6-digit code to your email</p>
          </header>

          <form onSubmit={handleForgotSubmit} noValidate>
            <Input label="Email Address" icon="fa-solid fa-envelope" type="email" placeholder="yourname@example.com" value={email} onChange={setEmail} required />
            <Button type="submit" loading={loading}>Send Verification Code</Button>
            <Button variant="secondary" onClick={() => { setMode('login'); setEmail(''); }} style={{ marginTop: '12px' }}>
              Back to Login
            </Button>
          </form>
        </section>
      )}

      {/* ─── RESET PASSWORD MODE (OTP + New Password) ─── */}
      {mode === 'reset' && (
        <section>
          <header className="brand-header">
            <img src="/favicon.png" alt="FixConnect Logo" className="brand-logo-img" onError={(e) => e.target.style.display = 'none'} />
            <h2 className="brand-logo">Reset Password</h2>
            <p className="brand-subtitle">Enter the 6-digit code sent to <strong>{email}</strong></p>
          </header>

          <form onSubmit={handleResetSubmit} noValidate>

            {/* OTP Code Input */}
            <div className="form-group">
              <label className="form-label">Verification Code</label>
              <div className="input-wrapper">
                <i className="fa-solid fa-shield-halved input-icon"></i>
                <input
                  type="text"
                  className="form-control otp-input"
                  placeholder="000000"
                  value={otpCode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setOtpCode(val);
                  }}
                  maxLength={6}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                />
              </div>
            </div>

            {/* New Password with Checklist */}
            <Input
              label="New Password"
              icon="fa-solid fa-lock"
              type="password"
              placeholder="Minimum 8 characters"
              value={newPassword}
              onChange={handlePasswordChange}
              required
            />

            <div className="password-checklists">
              <span className={`check-item ${passwordChecks.length ? 'valid' : 'invalid'}`}>
                <i className={`fa-solid ${passwordChecks.length ? 'fa-circle-check' : 'fa-circle-xmark'}`}></i> 8+ Chars
              </span>
              <span className={`check-item ${passwordChecks.uppercase ? 'valid' : 'invalid'}`}>
                <i className={`fa-solid ${passwordChecks.uppercase ? 'fa-circle-check' : 'fa-circle-xmark'}`}></i> Uppercase
              </span>
              <span className={`check-item ${passwordChecks.lowercase ? 'valid' : 'invalid'}`}>
                <i className={`fa-solid ${passwordChecks.lowercase ? 'fa-circle-check' : 'fa-circle-xmark'}`}></i> Lowercase
              </span>
              <span className={`check-item ${passwordChecks.number ? 'valid' : 'invalid'}`}>
                <i className={`fa-solid ${passwordChecks.number ? 'fa-circle-check' : 'fa-circle-xmark'}`}></i> Number
              </span>
              <span className={`check-item ${passwordChecks.special ? 'valid' : 'invalid'}`}>
                <i className={`fa-solid ${passwordChecks.special ? 'fa-circle-check' : 'fa-circle-xmark'}`}></i> Special Char
              </span>
            </div>

            <Button type="submit" loading={loading}>Verify &amp; Reset Password</Button>
            <Button variant="secondary" onClick={() => { setMode('forgot'); setOtpCode(''); setNewPassword(''); }} style={{ marginTop: '12px' }}>
              Resend Code
            </Button>
          </form>
        </section>
      )}

    </main>
  );
}
