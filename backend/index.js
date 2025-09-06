import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import {
  limiter,
  corsOptions,
  securityHeaders,
  csrfProtection,
  generateCSRFToken,
} from './middleware/security.middleware.js';

// Route imports
import userRoutes from './routes/user.routes.js';
import questionRoutes from './routes/question.routes.js';
import answerRoutes from './routes/answer.routes.js';

dotenv.config();

// Connect to database
connectDB();

const app = express();

// Security Middleware
app.use(securityHeaders); // Helmet for security headers

// Apply proper CORS configuration (must be before other middleware)
app.use(cors(corsOptions));

// Parse request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Required for cookies

// Rate limiting
app.use(limiter);

// CSRF Token endpoint - place this before CSRF protection
app.get('/api/csrf-token', (req, res) => {
  const token = generateCSRFToken();
  res.json({ csrfToken: token });
});

// Routes with CSRF protection
app.use('/api/users', csrfProtection, userRoutes);
app.use('/api/questions', csrfProtection, questionRoutes);
app.use('/api/answers', csrfProtection, answerRoutes);

// Root Route
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
