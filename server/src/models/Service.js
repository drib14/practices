import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    fullDescription: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    thumbnail: {
      type: String,
      default: null
    },
    gallery: {
      type: [String],
      default: []
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    providerName: {
      type: String,
      required: true,
      trim: true
    },
    serviceArea: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    startingPrice: {
      type: Number,
      required: true,
      min: 0
    },
    estimatedDuration: {
      type: String,
      required: true,
      trim: true
    },
    tags: {
      type: [String],
      default: [],
      index: true
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'DRAFT', 'ARCHIVED', 'SUSPENDED', 'DELETED'],
      default: 'ACTIVE',
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Text index for full-text search across title, shortDescription, tags, and category
serviceSchema.index(
  { title: 'text', shortDescription: 'text', tags: 'text', category: 'text' },
  { weights: { title: 10, category: 5, tags: 3, shortDescription: 1 } }
);

export const Service = mongoose.model('Service', serviceSchema);
