import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASSWORD
  }
});

// Transporter validation
transporter.verify((error) => {
  if (error) {
    logger.error('SMTP Connection Validation failed', error);
  } else {
    logger.info('SMTP Server initialized successfully');
  }
});

/**
 * Send Account Verification Email
 */
export const sendVerificationEmail = async (email, token, fullName) => {
  const verificationLink = `${env.CLIENT_URL}/login.html?token=${token}`;
  
  const mailOptions = {
    from: `"FixConnect Security" <${env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify your FixConnect Account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #007bff; text-align: center;">Welcome, ${fullName}!</h2>
        <p>Thank you for registering at FixConnect. Before logging in, you must verify your email address:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}" style="background-color: #007bff; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Verify Email Address
          </a>
        </div>
        <p>This verification link is valid for 24 hours.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #777;">If you did not request this registration, you can safely ignore this email.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info('Verification email sent successfully', { email });
  } catch (error) {
    logger.error('Failed to send verification email', error, { email });
  }
};

/**
 * Send Welcome Email
 */
export const sendWelcomeEmail = async (email, fullName) => {
  const mailOptions = {
    from: `"FixConnect Security" <${env.EMAIL_USER}>`,
    to: email,
    subject: 'Welcome to FixConnect!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #28a745; text-align: center;">Account Verified!</h2>
        <p>Hi ${fullName},</p>
        <p>Your email address has been successfully verified. Your FixConnect account is now fully active.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${env.CLIENT_URL}/login.html" style="background-color: #28a745; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Login Now
          </a>
        </div>
        <p>Thank you for joining us!</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info('Welcome email sent successfully', { email });
  } catch (error) {
    logger.error('Failed to send welcome email', error, { email });
  }
};

/**
 * Send Lockout Security Notification
 */
export const sendLockoutAlert = async (email, fullName, lockDurationMinutes = 30) => {
  const mailOptions = {
    from: `"FixConnect Security" <${env.EMAIL_USER}>`,
    to: email,
    subject: 'Security Alert: FixConnect Account Locked',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #f8d7da; border-radius: 8px; background-color: #fdf3f3;">
        <h2 style="color: #dc3545; text-align: center;">Account Temporarily Locked</h2>
        <p>Dear ${fullName},</p>
        <p>We detected multiple failed login attempts for your FixConnect account. To protect your data, your account has been temporarily locked for <b>${lockDurationMinutes} minutes</b>.</p>
        <p>If you did not perform these login attempts, someone else may be trying to access your account. We strongly suggest updating your password once your account is unlocked.</p>
        <hr style="border: none; border-top: 1px solid #f5c6cb; margin: 20px 0;">
        <p style="font-size: 12px; color: #721c24;">If you need assistance, please contact customer support.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info('Lockout alert email sent successfully', { email });
  } catch (error) {
    logger.error('Failed to send lockout alert email', error, { email });
  }
};

/**
 * Send Password Reset Link Email
 */
export const sendPasswordResetEmail = async (email, token, fullName) => {
  const resetLink = `${env.CLIENT_URL}/login.html?resetToken=${token}`;
  
  const mailOptions = {
    from: `"FixConnect Security" <${env.EMAIL_USER}>`,
    to: email,
    subject: 'FixConnect Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #17a2b8; text-align: center;">Reset Your Password</h2>
        <p>Hi ${fullName},</p>
        <p>You requested to reset your password. Click the button below to set a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #17a2b8; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Reset Password
          </a>
        </div>
        <p>This password reset request will expire in 30 minutes.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #777;">If you did not request a password reset, you can safely ignore this email.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info('Password reset email sent successfully', { email });
  } catch (error) {
    logger.error('Failed to send password reset email', error, { email });
  }
};
