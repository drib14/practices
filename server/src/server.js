import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import { globalLimiter } from './middleware/rateLimiter.js';
import { logger } from './utils/logger.js';

// Initialize Database connection
await connectDB();

const app = express();

// Set secure HTTP headers via Helmet
app.use(helmet());

// Disable Express default powered-by header for obfuscation
app.disable('x-powered-by');

// Enable CORS with Credentials support (for HttpOnly Cookies)
app.use(
  cors({
    origin: [env.CLIENT_URL, 'http://localhost:5500', 'http://127.0.0.1:5500'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Apply Global Rate Limiting (100 req/min)
app.use(globalLimiter);

// Request parsing middlewares
app.use(express.json({ limit: '10kb' })); // Limit body sizes to mitigate payload injection
app.use(cookieParser());

// Audit Log incoming requests (Diagnostic)
app.use((req, res, next) => {
  logger.info(`HTTP Request: ${req.method} ${req.originalUrl}`, { ip: req.ip });
  next();
});

// Authentication routes
app.use('/api/auth', authRoutes);

// Simple diagnostic path
app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'FixConnect Core API operational.' });
});

// Catch-all route for missing endpoints
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'API resource not found.' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled Server Error occurred', err);
  
  // Return generic error structure (enumeration protection/obfuscate system details)
  res.status(500).json({
    success: false,
    error: 'Internal Server Error.'
  });
});

const server = app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Promise Rejection at', reason);
});
