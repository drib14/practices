import rateLimit from 'express-rate-limit';

// Global API Limiter: Max 100 requests per minute per IP
export const globalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  message: {
    success: false,
    error: 'Too many requests. Please slow down.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Login Limiter: Max 5 attempts per 15 minutes per IP
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    success: false,
    error: 'Too many login attempts. Please try again in 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Registration Limiter: Max 3 signups per hour per IP
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: {
    success: false,
    error: 'Too many registration attempts. Please try again in an hour.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Forgot Password Limiter: Max 3 requests per hour per IP
export const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: {
    success: false,
    error: 'Too many password reset requests. Please try again in an hour.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Email Verification Limiter: Max 5 verification attempts per hour per IP
export const verifyEmailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: {
    success: false,
    error: 'Too many verification attempts. Please try again in an hour.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Reset Password (OTP) Limiter: Max 5 attempts per hour per IP
export const resetPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: {
    success: false,
    error: 'Too many reset attempts. Please try again in an hour.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

