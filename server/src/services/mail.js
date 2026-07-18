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
  const verificationLink = `${env.CLIENT_URL}/?token=${token}`;
  
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
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #312e81; font-size: 24px; font-weight: bold; margin: 0 0 8px 0;">Welcome to FixConnect</h2>
          <p style="color: #475569; font-size: 14px; margin: 0;">Your account is active and ready</p>
        </div>
        <hr style="border: none; border-top: 1px solid #f1f5f9; margin-bottom: 24px;">
        <p style="color: #0f172a; font-size: 16px; line-height: 1.5; margin: 0 0 16px 0;">Hi ${fullName},</p>
        <p style="color: #475569; font-size: 15px; line-height: 1.5; margin: 0 0 24px 0;">We are excited to welcome you to FixConnect. Your account is fully operational. You can now log in, configure your profile, and search or offer premium booking services.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${env.CLIENT_URL}" style="background-color: #312e81; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block;">
            Get Started
          </a>
        </div>
        <p style="color: #64748b; font-size: 14px; margin: 0;">Best regards,<br>The FixConnect Team</p>
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
 * Send Password Reset 6-Digit OTP Email
 */
export const sendPasswordResetOTP = async (email, code, fullName) => {
  const mailOptions = {
    from: `"FixConnect Security" <${env.EMAIL_USER}>`,
    to: email,
    subject: 'FixConnect Password Reset Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #17a2b8; text-align: center;">Password Reset Code</h2>
        <p>Hi ${fullName},</p>
        <p>You requested to reset your password. Use the 6-digit verification code below to proceed:</p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="display: inline-block; background-color: #f1f5f9; border: 2px dashed #0f172a; padding: 16px 32px; border-radius: 8px; letter-spacing: 8px; font-size: 32px; font-weight: bold; color: #0f172a;">
            ${code}
          </div>
        </div>
        <p>This code is valid for <b>15 minutes</b>. Do not share it with anyone.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #777;">If you did not request a password reset, you can safely ignore this email.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info('Password reset OTP email sent successfully', { email });
  } catch (error) {
    logger.error('Failed to send password reset OTP email', error, { email });
  }
};

