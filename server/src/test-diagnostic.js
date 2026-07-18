import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import nodemailer from 'nodemailer';

console.log('--- Starting FixConnect Diagnostics ---');

// 1. Env check
console.log('✓ Environment variables validation passed.');
console.log(`- Running Port: ${env.PORT}`);
console.log(`- SMTP Email: ${env.EMAIL_USER}`);

// 2. SMTP Transporter Check
console.log('\n--- Checking SMTP Transporter ---');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASSWORD
  }
});

transporter.verify((error) => {
  if (error) {
    console.error('✗ SMTP Connection Verification failed:', error.message);
  } else {
    console.log('✓ SMTP Server Connection verified and ready.');
  }
  
  // 3. Database Check
  console.log('\n--- Checking MongoDB Database Connection ---');
  connectDB().then(() => {
    console.log('✓ Database Connection verified and ready.');
    console.log('\nAll core subsystems checked. Diagnostic complete.');
    process.exit(0);
  }).catch((err) => {
    console.error('✗ Database Connection failed:', err.message);
    process.exit(1);
  });
});
