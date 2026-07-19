import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    scheduledTime: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['Searching', 'Accepted', 'Cancelled', 'Completed'],
      default: 'Searching',
      index: true
    },
    assignedWorker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Worker',
      default: null
    }
  },
  {
    timestamps: true
  }
);

export const Booking = mongoose.model('Booking', bookingSchema);
