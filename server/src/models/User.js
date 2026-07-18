import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      index: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true
    },
    password: {
      type: String,
      required: true
    },
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      enum: ['admin', 'moderator', 'user', 'provider'],
      default: 'user'
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationToken: {
      type: String,
      default: null
    },
    verificationTokenExpires: {
      type: Date,
      default: null
    },
    resetPasswordOTP: {
      type: String,
      default: null
    },
    resetPasswordOTPExpires: {
      type: Date,
      default: null
    },
    loginAttempts: {
      type: Number,
      required: true,
      default: 0
    },
    lockUntil: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Method to verify input passwords against stored hash
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Check if the account is currently locked due to brute force protection
userSchema.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

export const User = mongoose.model('User', userSchema);
