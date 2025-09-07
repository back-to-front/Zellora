import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import Tokens from 'csrf';

// Initialize CSRF token generator
const csrf = new Tokens();

// Rate limiting configuration
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

// CORS configuration
export const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);

    // Check if the origin is allowed
    const allowedOrigins =
      process.env.NODE_ENV === 'production'
        ? process.env.ALLOWED_ORIGINS?.split(',')
        : [
            'http://127.0.0.1:5173',
            'http://localhost:5173',
            'http://127.0.0.1:5174', // For Vite preview
            'http://localhost:5174',
            'http://127.0.0.1:3000',
            'http://localhost:3000',
            'http://127.0.0.1:4173', // For Vite preview
            'http://localhost:4173',
          ];

    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-CSRF-Token',
    'X-Requested-With',
    'Origin',
    'Accept',
  ],
  credentials: true,
  maxAge: 86400, // 24 hours
};

// Generate CSRF token
export const generateCSRFToken = () => {
  return csrf.create(
    process.env.CSRF_SECRET || 'your-csrf-secret-key-change-in-production'
  );
};

// Validate CSRF token
export const validateCSRFToken = (token, secret) => {
  return csrf.verify(
    process.env.CSRF_SECRET || 'your-csrf-secret-key-change-in-production',
    token
  );
};

// CSRF protection middleware
export const csrfProtection = (req, res, next) => {
  // Skip CSRF check for non-mutation requests
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  const token = req.headers['x-csrf-token'] || req.body._csrf;

  if (!token || !validateCSRFToken(token)) {
    return res.status(403).json({ message: 'CSRF token validation failed' });
  }

  next();
};

// Security headers middleware using helmet
export const securityHeaders = helmet({
  contentSecurityPolicy:
    process.env.NODE_ENV === 'production' ? undefined : false,
  crossOriginEmbedderPolicy: process.env.NODE_ENV === 'production',
});
