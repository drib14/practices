import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Session } from '../models/Session.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendLockoutAlert,
  sendPasswordResetOTP
} from '../services/mail.js';

// Password Validation Helper
const validatePasswordStrength = (password, email) => {
  if (password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter.';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter.';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number.';
  }
  if (!/[!@#$%^&*(),.?":{}|<>_+-]/.test(password)) {
    return 'Password must contain at least one special character.';
  }
  
  // Reject email inclusion
  const emailUsername = email.split('@')[0];
  if (password.toLowerCase().includes(emailUsername.toLowerCase()) || password.toLowerCase().includes(email.toLowerCase())) {
    return 'Password must not contain parts of your email address.';
  }

  // Reject sequential characters (e.g. 12345, abcde)
  const isSequential = (str) => {
    for (let i = 0; i < str.length - 4; i++) {
      const code1 = str.charCodeAt(i);
      const code2 = str.charCodeAt(i + 1);
      const code3 = str.charCodeAt(i + 2);
      const code4 = str.charCodeAt(i + 3);
      const code5 = str.charCodeAt(i + 4);
      if (code2 === code1 + 1 && code3 === code2 + 1 && code4 === code3 + 1 && code5 === code4 + 1) {
        return true; // ascending sequence
      }
      if (code2 === code1 - 1 && code3 === code2 - 1 && code4 === code3 - 1 && code5 === code4 - 1) {
        return true; // descending sequence
      }
    }
    return false;
  };
  
  if (isSequential(password) || isSequential(password.toLowerCase())) {
    return 'Password must not contain sequential letters or numbers.';
  }

  // Reject common patterns
  const commonPasswords = ['password', 'admin123456', 'welcome12345', 'fixconnect2026', 'letmein12345'];
  if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
    return 'Password contains a common, easily guessable phrase.';
  }

  return null;
};

// JWT Generation Helper
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: '15m',
      issuer: 'fixconnect',
      audience: 'fixconnect-client'
    }
  );
};

const sendCookies = (res, accessToken, refreshToken) => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000 // 15 mins
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

const clearCookies = (res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
};

// @desc    Register a new user
// @route   POST /api/auth/register
export const register = async (req, res) => {
  // Input Validation and whitelisting to prevent NoSQL injection
  const allowedFields = ['username', 'email', 'password', 'firstName', 'lastName', 'role'];
  const extraFields = Object.keys(req.body).filter(key => !allowedFields.includes(key));
  if (extraFields.length > 0) {
    return res.status(400).json({ success: false, error: 'Registration failed: unexpected fields present' });
  }

  const { username, email, password, firstName, lastName, role } = req.body;

  if (!username || !email || !password || !firstName || !lastName) {
    return res.status(400).json({ success: false, error: 'All fields are required' });
  }

  if (
    typeof username !== 'string' ||
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    typeof firstName !== 'string' ||
    typeof lastName !== 'string' ||
    (role && typeof role !== 'string')
  ) {
    return res.status(400).json({ success: false, error: 'Invalid input types' });
  }

  const passwordError = validatePasswordStrength(password, email);
  if (passwordError) {
    return res.status(400).json({ success: false, error: passwordError });
  }

  try {
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase().trim() }, { username: username.trim() }]
    });

    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Registration failed: account credentials already in use' });
    }

    const salt = await bcrypt.genSalt(12); // bcrypt 12 rounds
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      role: role === 'provider' ? 'provider' : 'user',
      isVerified: true,
      verificationToken: null,
      verificationTokenExpires: null
    });

    // Send welcome email immediately instead of verification email
    sendWelcomeEmail(newUser.email, `${newUser.firstName} ${newUser.lastName}`);

    logger.info('User registered successfully (auto-verified)', { userId: newUser._id });

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to FixConnect.',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role
      }
    });
  } catch (error) {
    logger.error('Registration error', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// @desc    Verify email address
// @route   GET /api/auth/verify
export const verifyEmail = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ success: false, error: 'Invalid or missing verification token' });
  }

  try {
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, error: 'Verification token is invalid or has expired.' });
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await user.save();

    sendWelcomeEmail(user.email, `${user.firstName} ${user.lastName}`);
    logger.info('User verified email successfully', { userId: user._id });

    res.status(200).json({
      success: true,
      message: 'Email verified successfully! You can now log in.'
    });
  } catch (error) {
    logger.error('Verification error', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// @desc    Log in user
// @route   POST /api/auth/login
export const login = async (req, res) => {
  // Input Validation and whitelisting to prevent NoSQL injection
  const allowedFields = ['usernameOrEmail', 'password'];
  const extraFields = Object.keys(req.body).filter(key => !allowedFields.includes(key));
  if (extraFields.length > 0) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  }

  const { usernameOrEmail, password } = req.body;

  if (!usernameOrEmail || !password) {
    return res.status(400).json({ success: false, error: 'All fields are required' });
  }

  if (typeof usernameOrEmail !== 'string' || typeof password !== 'string') {
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  }

  try {
    const user = await User.findOne({
      $or: [
        { email: usernameOrEmail.toLowerCase().trim() },
        { username: usernameOrEmail.trim() }
      ]
    });

    if (!user) {
      // Enumeration protection
      logger.warn('Failed login attempt: user not found', { input: usernameOrEmail });
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Check brute force lock
    if (user.isLocked) {
      logger.warn('Failed login attempt: account is locked', { email: user.email });
      return res.status(403).json({
        success: false,
        error: `Your account is temporarily locked. Please try again after ${new Date(user.lockUntil).toLocaleTimeString()}.`
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      // Increment failed attempts
      user.loginAttempts += 1;
      
      if (user.loginAttempts >= 10) {
        user.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // Lock for 30 minutes
        logger.warn('Account locked due to brute force protection', { email: user.email });
        sendLockoutAlert(user.email, `${user.firstName} ${user.lastName}`);
      }
      
      await user.save();
      logger.warn('Failed login attempt: incorrect password', { email: user.email });
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Success: reset lock attributes
    user.loginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    // Create session keys
    const accessToken = generateAccessToken(user);
    const refreshToken = crypto.randomBytes(40).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await Session.create({
      user: user._id,
      token: refreshToken,
      expiresAt
    });

    sendCookies(res, accessToken, refreshToken);
    logger.info('User logged in successfully', { userId: user._id });

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    logger.error('Login error', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// @desc    Refresh session tokens (Rotation & Breach Detection)
// @route   POST /api/auth/refresh
export const refresh = async (req, res) => {
  const oldRefreshToken = req.cookies?.refreshToken;

  if (!oldRefreshToken) {
    return res.status(401).json({ success: false, error: 'Refresh token missing' });
  }

  try {
    const session = await Session.findOne({ token: oldRefreshToken }).populate('user');

    if (!session) {
      clearCookies(res);
      return res.status(401).json({ success: false, error: 'Session expired or invalid' });
    }

    // Token reuse / breach detection!
    if (session.isUsed) {
      // Token has been used already - implies a compromise. Revoke all user sessions.
      await Session.deleteMany({ user: session.user._id });
      clearCookies(res);
      logger.warn('SECURITY WARNING: Reused refresh token detected. Revoking all user sessions.', { userId: session.user._id });
      return res.status(403).json({ success: false, error: 'Security breach detected. Please log in again.' });
    }

    // Mark current session as used
    session.isUsed = true;
    await session.save();

    // Create rotated tokens
    const newAccessToken = generateAccessToken(session.user);
    const newRefreshToken = crypto.randomBytes(40).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Save new session
    await Session.create({
      user: session.user._id,
      token: newRefreshToken,
      expiresAt
    });

    sendCookies(res, newAccessToken, newRefreshToken);
    logger.info('Session tokens rotated successfully', { userId: session.user._id });

    res.status(200).json({ success: true });
  } catch (error) {
    logger.error('Session refresh error', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// @desc    Log out current device session
// @route   POST /api/auth/logout
export const logout = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  try {
    if (refreshToken) {
      await Session.deleteOne({ token: refreshToken });
    }
    clearCookies(res);
    logger.info('User logged out of current device session');
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    logger.error('Logout error', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// @desc    Log out from all devices (revoke all sessions)
// @route   POST /api/auth/logout-all
export const logoutAll = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  try {
    const session = await Session.findOne({ token: refreshToken });
    if (session) {
      await Session.deleteMany({ user: session.user });
    }
    clearCookies(res);
    logger.info('User logged out of all sessions');
    res.status(200).json({ success: true, message: 'Logged out of all sessions successfully' });
  } catch (error) {
    logger.error('Logout all error', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// @desc    Forgot password (request 6-digit OTP verification code)
// @route   POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  // Input Validation and whitelisting
  const allowedFields = ['email'];
  const extraFields = Object.keys(req.body).filter(key => !allowedFields.includes(key));
  if (extraFields.length > 0) {
    return res.status(400).json({ success: false, error: 'Invalid input' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required' });
  }

  if (typeof email !== 'string') {
    return res.status(400).json({ success: false, error: 'Invalid input types' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      // Enumeration protection
      logger.warn('Password reset request for non-existent email', { email });
      return res.status(200).json({
        success: true,
        message: 'If the email exists, a 6-digit verification code has been dispatched.'
      });
    }

    // Generate random 6-digit numeric code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');

    user.resetPasswordOTP = hashedOTP;
    user.resetPasswordOTPExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    await user.save();

    sendPasswordResetOTP(user.email, otp, `${user.firstName} ${user.lastName}`);
    logger.info('Password reset 6-digit OTP generated and sent', { userId: user._id });

    res.status(200).json({
      success: true,
      message: 'If the email exists, a 6-digit verification code has been dispatched.'
    });
  } catch (error) {
    logger.error('Forgot password OTP error', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// @desc    Reset password using 6-digit code (OTP)
// @route   POST /api/auth/reset-password
export const resetPassword = async (req, res) => {
  // Input Validation and whitelisting
  const allowedFields = ['email', 'code', 'newPassword'];
  const extraFields = Object.keys(req.body).filter(key => !allowedFields.includes(key));
  if (extraFields.length > 0) {
    return res.status(400).json({ success: false, error: 'Invalid input' });
  }

  const { email, code, newPassword } = req.body;

  if (!email || !code || !newPassword) {
    return res.status(400).json({ success: false, error: 'Email, verification code, and new password are required' });
  }

  if (typeof email !== 'string' || typeof code !== 'string' || typeof newPassword !== 'string') {
    return res.status(400).json({ success: false, error: 'Invalid input types' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid email or verification code' });
    }

    // Hash code input and match
    const hashedOTP = crypto.createHash('sha256').update(code.trim()).digest('hex');

    if (user.resetPasswordOTP !== hashedOTP || user.resetPasswordOTPExpires < Date.now()) {
      return res.status(400).json({ success: false, error: 'Invalid or expired verification code' });
    }

    const passwordError = validatePasswordStrength(newPassword, user.email);
    if (passwordError) {
      return res.status(400).json({ success: false, error: passwordError });
    }

    // Invalidate reset properties and update password
    user.resetPasswordOTP = null;
    user.resetPasswordOTPExpires = null;
    
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(newPassword, salt);
    
    user.loginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    // Revoke all active sessions
    await Session.deleteMany({ user: user._id });

    logger.info('User password reset successfully via OTP', { userId: user._id });

    res.status(200).json({
      success: true,
      message: 'Password reset successfully! You can now log in.'
    });
  } catch (error) {
    logger.error('Reset password OTP verification error', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// @desc    Get current logged in user profile
// @route   GET /api/auth/profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -verificationToken -resetPasswordToken');
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    logger.error('Profile retrieval error', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
