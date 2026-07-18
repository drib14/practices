import { Service } from '../models/Service.js';
import { logger } from './logger.js';

/**
 * Seed the database with sample service data for development and demonstration.
 * This script is idempotent: it clears existing services before inserting.
 *
 * Usage: node --loader=ts-node/esm src/utils/seed.js
 * Or import and call seedServices() programmatically.
 */

const sampleServices = [
  {
    slug: 'residential-plumbing-repair',
    title: 'Residential Plumbing Repair',
    shortDescription: 'Professional plumbing services for leaks, clogs, pipe replacements, and fixture installations in residential properties.',
    fullDescription: 'Our certified plumbers handle everything from minor drip repairs and drain cleaning to full pipe replacements and water heater installations. We use high-quality materials and provide a 90-day workmanship guarantee on all jobs. Emergency same-day service available.',
    category: 'Plumbing',
    thumbnail: null,
    gallery: [],
    providerName: 'AquaFix Solutions',
    serviceArea: 'Downtown Metro',
    startingPrice: 75,
    estimatedDuration: '1-3 hours',
    tags: ['plumbing', 'leak repair', 'drain cleaning', 'pipe replacement', 'emergency'],
    status: 'ACTIVE'
  },
  {
    slug: 'electrical-panel-upgrade',
    title: 'Electrical Panel Upgrade',
    shortDescription: 'Licensed electricians upgrading residential and commercial electrical panels to modern safety standards.',
    fullDescription: 'We specialize in upgrading outdated fuse boxes to modern circuit breaker panels, increasing electrical capacity for homes and businesses. Our licensed electricians ensure full code compliance, proper grounding, and surge protection. Includes post-installation inspection and certification.',
    category: 'Electrical',
    thumbnail: null,
    gallery: [],
    providerName: 'BrightSpark Electrical',
    serviceArea: 'North Side',
    startingPrice: 250,
    estimatedDuration: '4-6 hours',
    tags: ['electrical', 'panel upgrade', 'circuit breaker', 'wiring', 'safety'],
    status: 'ACTIVE'
  },
  {
    slug: 'deep-house-cleaning',
    title: 'Deep House Cleaning',
    shortDescription: 'Thorough deep cleaning service covering kitchens, bathrooms, floors, and all living spaces.',
    fullDescription: 'Our deep cleaning package includes detailed sanitization of kitchens and bathrooms, dusting of all surfaces, vacuuming and mopping floors, window sill cleaning, and appliance exterior wipe-downs. We use eco-friendly, non-toxic products safe for children and pets. Ideal for move-in/move-out or seasonal refreshes.',
    category: 'Cleaning',
    thumbnail: null,
    gallery: [],
    providerName: 'SparkleHome Services',
    serviceArea: 'Metro Area',
    startingPrice: 120,
    estimatedDuration: '3-5 hours',
    tags: ['cleaning', 'deep clean', 'sanitization', 'eco-friendly', 'residential'],
    status: 'ACTIVE'
  },
  {
    slug: 'hvac-system-maintenance',
    title: 'HVAC System Maintenance',
    shortDescription: 'Complete heating, ventilation, and AC maintenance including filter replacement, coil cleaning, and diagnostics.',
    fullDescription: 'Keep your HVAC system running efficiently with our comprehensive maintenance service. Includes air filter replacement, evaporator and condenser coil cleaning, refrigerant level check, thermostat calibration, and ductwork inspection. Preventive maintenance extends equipment life and reduces energy costs by up to 25%.',
    category: 'HVAC',
    thumbnail: null,
    gallery: [],
    providerName: 'ClimateCare Pro',
    serviceArea: 'Citywide',
    startingPrice: 150,
    estimatedDuration: '2-3 hours',
    tags: ['hvac', 'air conditioning', 'heating', 'maintenance', 'energy efficiency'],
    status: 'ACTIVE'
  },
  {
    slug: 'interior-painting-service',
    title: 'Interior Painting Service',
    shortDescription: 'Professional interior painting with premium paints, clean lines, and meticulous preparation work.',
    fullDescription: 'Transform your space with our professional interior painting service. We handle everything from surface preparation (patching, sanding, priming) to final coat application. We use top-tier low-VOC paints for a lasting finish. Color consultation available. Price is per room and includes all materials.',
    category: 'Handyman',
    thumbnail: null,
    gallery: [],
    providerName: 'PrimeBrush Painters',
    serviceArea: 'Suburbs East',
    startingPrice: 200,
    estimatedDuration: '1-2 days',
    tags: ['painting', 'interior', 'home improvement', 'renovation', 'handyman'],
    status: 'ACTIVE'
  },
  {
    slug: 'lawn-care-and-landscaping',
    title: 'Lawn Care & Landscaping',
    shortDescription: 'Complete lawn mowing, edging, trimming, fertilization, and seasonal landscape design.',
    fullDescription: 'Our lawn care package covers regular mowing, precision edging, bush and hedge trimming, weed control, and seasonal fertilization programs. We also offer landscape design consultations for flower beds, walkways, and outdoor living areas. Weekly, bi-weekly, and monthly plans available.',
    category: 'Landscaping',
    thumbnail: null,
    gallery: [],
    providerName: 'GreenScape Masters',
    serviceArea: 'North Side',
    startingPrice: 60,
    estimatedDuration: '1-2 hours',
    tags: ['landscaping', 'lawn care', 'mowing', 'gardening', 'outdoor'],
    status: 'ACTIVE'
  },
  {
    slug: 'smart-home-installation',
    title: 'Smart Home Installation',
    shortDescription: 'Setup and configuration of smart home devices including thermostats, lighting, security cameras, and voice assistants.',
    fullDescription: 'We install and configure the latest smart home technology for maximum convenience and security. Services include smart thermostat setup, automated lighting systems, security camera installation, smart lock configuration, and voice assistant integration. Compatible with Google Home, Alexa, and Apple HomeKit ecosystems.',
    category: 'Electrical',
    thumbnail: null,
    gallery: [],
    providerName: 'BrightSpark Electrical',
    serviceArea: 'Metro Area',
    startingPrice: 180,
    estimatedDuration: '2-4 hours',
    tags: ['smart home', 'automation', 'security', 'technology', 'installation'],
    status: 'ACTIVE'
  },
  {
    slug: 'furniture-assembly-service',
    title: 'Furniture Assembly Service',
    shortDescription: 'Fast and reliable assembly of flat-pack furniture from IKEA, Wayfair, Amazon, and other retailers.',
    fullDescription: 'Save time and avoid frustration with our professional furniture assembly service. We assemble desks, bookshelves, wardrobes, bed frames, dining tables, and more from all major flat-pack retailers. We bring our own tools, clean up packaging, and ensure everything is level and secure. Same-day availability in most areas.',
    category: 'Handyman',
    thumbnail: null,
    gallery: [],
    providerName: 'QuickFix Handyman',
    serviceArea: 'Downtown Metro',
    startingPrice: 50,
    estimatedDuration: '1-2 hours',
    tags: ['furniture', 'assembly', 'handyman', 'ikea', 'home'],
    status: 'ACTIVE'
  }
];

/**
 * Seeds the Service collection with sample data.
 * Generates a temporary ObjectId for providerId since we are seeding mock data.
 */
export const seedServices = async () => {
  try {
    const count = await Service.countDocuments();

    if (count > 0) {
      logger.info(`Service collection already has ${count} documents. Skipping seed.`);
      return { seeded: false, count };
    }

    const { default: mongoose } = await import('mongoose');

    // Assign a generated ObjectId as providerId for each mock service
    const servicesWithIds = sampleServices.map((svc) => ({
      ...svc,
      providerId: new mongoose.Types.ObjectId()
    }));

    await Service.insertMany(servicesWithIds);
    logger.info(`Seeded ${servicesWithIds.length} sample services successfully.`);
    return { seeded: true, count: servicesWithIds.length };
  } catch (error) {
    logger.error('Failed to seed services', error);
    throw error;
  }
};
