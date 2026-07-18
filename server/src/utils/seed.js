import { Worker } from '../models/Worker.js';
import { logger } from './logger.js';
import mongoose from 'mongoose';

const sampleWorkers = [
  {
    profilePhoto: 'https://i.pravatar.cc/150?u=1',
    fullName: 'John Doe',
    displayName: 'John D.',
    bio: 'Professional plumber with over 10 years of experience fixing leaks and installing pipes.',
    skills: ['Plumbing', 'Pipe Installation', 'Leak Repair', 'Drain Cleaning'],
    categories: ['Plumbing', 'Handyman'],
    yearsExperience: 10,
    city: 'New York',
    province: 'NY',
    serviceRadius: 30,
    verificationStatus: 'Verified',
    averageRating: 4.8,
    completedJobs: 150,
    responseRate: 98,
    responseTime: 'Within 1 hour',
    portfolio: [],
    certifications: ['Certified Master Plumber'],
    languages: ['English', 'Spanish'],
    status: 'Active',
    startingPrice: 75
  },
  {
    profilePhoto: 'https://i.pravatar.cc/150?u=2',
    fullName: 'Sarah Jenkins',
    displayName: 'Sarah J.',
    bio: 'Experienced electrician specialized in residential panel upgrades and smart home setups.',
    skills: ['Electrical Wiring', 'Panel Upgrade', 'Smart Home Setup', 'Troubleshooting'],
    categories: ['Electrical'],
    yearsExperience: 8,
    city: 'New York',
    province: 'NY',
    serviceRadius: 25,
    verificationStatus: 'Verified',
    averageRating: 4.9,
    completedJobs: 200,
    responseRate: 100,
    responseTime: 'Within 30 mins',
    portfolio: [],
    certifications: ['Licensed Electrician'],
    languages: ['English'],
    status: 'Active',
    startingPrice: 100
  },
  {
    profilePhoto: 'https://i.pravatar.cc/150?u=3',
    fullName: 'Mike Ross',
    displayName: 'Mike R.',
    bio: 'Top-rated house cleaner focusing on deep cleaning and eco-friendly products.',
    skills: ['Deep Cleaning', 'Sanitization', 'Window Cleaning'],
    categories: ['House Cleaning'],
    yearsExperience: 4,
    city: 'Brooklyn',
    province: 'NY',
    serviceRadius: 15,
    verificationStatus: 'Verified',
    averageRating: 4.7,
    completedJobs: 85,
    responseRate: 95,
    responseTime: 'Within 2 hours',
    portfolio: [],
    certifications: [],
    languages: ['English'],
    status: 'Active',
    startingPrice: 50
  },
  {
    profilePhoto: 'https://i.pravatar.cc/150?u=4',
    fullName: 'Elena Gilbert',
    displayName: 'Elena G.',
    bio: 'Landscape designer and gardener passionate about transforming outdoor spaces.',
    skills: ['Landscaping', 'Lawn Mowing', 'Weed Control', 'Garden Design'],
    categories: ['Gardening', 'Landscaping'],
    yearsExperience: 6,
    city: 'Queens',
    province: 'NY',
    serviceRadius: 20,
    verificationStatus: 'Pending Verification',
    averageRating: 4.5,
    completedJobs: 40,
    responseRate: 90,
    responseTime: 'Within a day',
    portfolio: [],
    certifications: [],
    languages: ['English', 'Italian'],
    status: 'Active',
    startingPrice: 60
  }
];

export const seedWorkers = async () => {
  try {
    const count = await Worker.countDocuments();

    if (count > 0) {
      logger.info(`Worker collection already has ${count} documents. Skipping seed.`);
      return { seeded: false, count };
    }

    await Worker.insertMany(sampleWorkers);
    logger.info(`Seeded ${sampleWorkers.length} sample workers successfully.`);
    return { seeded: true, count: sampleWorkers.length };
  } catch (error) {
    logger.error('Failed to seed workers', error);
    throw error;
  }
};
