import mongoose from 'mongoose';

const workerSchema = new mongoose.Schema(
  {
    profilePhoto: {
      type: String,
      default: null
    },
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    bio: {
      type: String,
      trim: true,
      default: ''
    },
    skills: {
      type: [String],
      default: [],
      index: true
    },
    categories: {
      type: [String],
      default: [],
      index: true
    },
    yearsExperience: {
      type: Number,
      default: 0
    },
    city: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    province: {
      type: String,
      required: true,
      trim: true
    },
    serviceRadius: {
      type: Number,
      default: 20
    },
    verificationStatus: {
      type: String,
      enum: ['Verified', 'Pending Verification', 'Unverified'],
      default: 'Pending Verification'
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    completedJobs: {
      type: Number,
      default: 0
    },
    responseRate: {
      type: Number,
      default: 100 // Percentage
    },
    responseTime: {
      type: String,
      default: 'Within an hour'
    },
    portfolio: {
      type: [String],
      default: []
    },
    certifications: {
      type: [String],
      default: []
    },
    languages: {
      type: [String],
      default: ['English']
    },
    status: {
      type: String,
      enum: ['Active', 'Pending Verification', 'Suspended', 'Archived', 'Deleted'],
      default: 'Pending Verification',
      index: true
    },
    startingPrice: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Text index for full-text search across skills, categories, name, city
workerSchema.index(
  { fullName: 'text', displayName: 'text', skills: 'text', categories: 'text', city: 'text' },
  { weights: { displayName: 10, fullName: 8, categories: 5, skills: 3, city: 1 } }
);

export const Worker = mongoose.model('Worker', workerSchema);
