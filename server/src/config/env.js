import dotenv from 'dotenv';

// Load variables
dotenv.config();

const requiredEnvVars = [
  'PORT',
  'MONGO_URI',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'EMAIL_USER',
  'EMAIL_PASSWORD',
  'CLIENT_URL'
];

const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('FATAL: Startup failed due to missing configuration environment variables:');
  missingEnvVars.forEach((varName) => {
    console.error(`- ${varName} is missing in the environment.`);
  });
  process.exit(1);
}

export const env = {
  PORT: parseInt(process.env.PORT, 10),
  MONGO_URI: process.env.MONGO_URI,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  CLIENT_URL: process.env.CLIENT_URL
};
