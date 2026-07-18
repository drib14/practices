import express from 'express';
import {
  register,
  verifyEmail,
  login,
  refresh,
  logout,
  logoutAll,
  forgotPassword,
  resetPassword,
  getProfile
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import {
  loginLimiter,
  registerLimiter,
  forgotPasswordLimiter,
  resetPasswordLimiter,
  verifyEmailLimiter
} from '../middleware/rateLimiter.js';

const router = express.Router();

// Registration
router.post('/register', registerLimiter, register);

// Email Verification
router.get('/verify', verifyEmailLimiter, verifyEmail);

// Login
router.post('/login', loginLimiter, login);

// Token Refresh
router.post('/refresh', refresh);

// Logouts
router.post('/logout', logout);
router.post('/logout-all', logoutAll);

// Password Resets
router.post('/forgot-password', forgotPasswordLimiter, forgotPassword);
router.post('/reset-password', resetPasswordLimiter, resetPassword);

// Profile
router.get('/profile', protect, getProfile);

export default router;
