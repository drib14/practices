import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};
