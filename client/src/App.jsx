import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Dashboard from './components/Dashboard.jsx';

// Configure Axios defaults
axios.defaults.baseURL = '/api';
axios.defaults.withCredentials = true;

export default function App() {
  const [view, setView] = useState('loading'); // 'loading' | 'login' | 'register' | 'dashboard' | 'reset-password'
  const [user, setUser] = useState(null);
  const [resetToken, setResetToken] = useState(null);

  // Axios Interceptor for automated token refreshing
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        if (
          error.response?.status === 401 && 
          error.response?.data?.code === 'TOKEN_EXPIRED' && 
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
          try {
            await axios.post('/auth/refresh');
            return axios(originalRequest);
          } catch (refreshError) {
            Swal.fire({
              icon: 'warning',
              title: 'Session Expired',
              text: 'Your security session has expired. Please log in again.',
              confirmButtonColor: '#0f172a'
            }).then(() => {
              setUser(null);
              setView('login');
            });
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  // Check URL parameters for email verification and password resets
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const verifyToken = urlParams.get('token');
    const resetTok = urlParams.get('resetToken');

    if (verifyToken) {
      Swal.fire({
        title: 'Verifying Email...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      axios.get(`/auth/verify?token=${verifyToken}`)
        .then((res) => {
          Swal.fire({
            icon: 'success',
            title: 'Verified!',
            text: res.data.message,
            confirmButtonColor: '#0f172a'
          }).then(() => {
            window.history.replaceState({}, document.title, window.location.pathname);
            setView('login');
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
            setView('login');
          });
        });
      return;
    }

    if (resetTok) {
      setResetToken(resetTok);
      setView('reset-password');
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    // Otherwise, check session profile
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const res = await axios.get('/auth/profile');
      if (res.data.success) {
        setUser(res.data.data);
        setView('dashboard');
      } else {
        setView('login');
      }
    } catch (err) {
      setView('login');
    }
  };

  if (view === 'loading') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#475569' }}>
        <p style={{ fontWeight: 500 }}><i className="fa-solid fa-circle-notch fa-spin"></i> Initializing FixConnect...</p>
      </div>
    );
  }

  return (
    <>
      {view === 'login' && (
        <Login 
          setView={setView} 
          setUser={setUser} 
          resetToken={null}
        />
      )}
      {view === 'reset-password' && (
        <Login 
          setView={setView} 
          setUser={setUser} 
          resetToken={resetToken}
        />
      )}
      {view === 'register' && (
        <Register 
          setView={setView} 
        />
      )}
      {view === 'dashboard' && (
        <Dashboard 
          setView={setView} 
          user={user} 
          setUser={setUser} 
        />
      )}
    </>
  );
}
