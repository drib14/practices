import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkSession } from './store/slices/authSlice.js';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';

export default function App() {
  const dispatch = useDispatch();
  const { user, isInitialized } = useSelector((state) => state.auth);
  
  const [view, setView] = useState('login'); // 'login' | 'register'

  // Check initial session
  useEffect(() => {
    dispatch(checkSession());
  }, [dispatch]);

  if (!isInitialized) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#475569' }}>
        <p style={{ fontWeight: 500 }}><i className="fa-solid fa-circle-notch fa-spin"></i> Initializing FixConnect...</p>
      </div>
    );
  }

  // Redirect to Dashboard if authenticated
  if (user) {
    return <Dashboard />;
  }

  return (
    <>
      {view === 'login' && <Login setView={setView} />}
      {view === 'register' && <Register setView={setView} />}
    </>
  );
}
