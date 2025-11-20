const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { storageAdapter } = require('./data/storageConfig');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(limiter);

// CORS configuration - SIMPLIFIED FOR VPS
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, curl)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.CORS_ORIGIN,
      'http://46.224.19.81',
      'https://46.224.19.81',
      'http://cargocapital.com',
      'https://cargocapital.com',
      'http://www.cargocapital.com',
      'https://www.cargocapital.com',
      'http://localhost:5173',
      'http://localhost:4173',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:4173'
    ].filter(Boolean);
    
    // Add additional origins from environment
    if (process.env.CORS_ORIGINS) {
      allowedOrigins.push(...process.env.CORS_ORIGINS.split(','));
    }
    
    // In development, allow any localhost
    if (process.env.NODE_ENV !== 'production') {
      if (origin && (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
        return callback(null, true);
      }
    }
    
    // Check if origin is allowed
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`CORS blocked origin: ${origin}`);
      console.log(`Allowed origins:`, allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Initialize storage system
async function initializeApp() {
  try {
    await storageAdapter.init();
    console.log('✅ Storage system initialized');
    
    const stats = await storageAdapter.getStats();
    console.log('📊 Storage stats:', stats);
  } catch (error) {
    console.error('⚠️  Storage initialization warning:', error.message);
    console.log('📝 Continuing with fallback storage...');
  }
}

// Middleware to pass storage helpers to routes
app.use((req, res, next) => {
  req.storage = storageAdapter.getHelpers();
  next();
});

// Import routes
const trackingRoutes = require('./routes/tracking');
const shipmentRoutes = require('./routes/shipments');
const adminRoutes = require('./routes/admin');
const emailRoutes = require('./routes/email');

// Routes
app.use('/api', trackingRoutes);
app.use('/api', shipmentRoutes);
app.use('/api', adminRoutes);
app.use('/api', emailRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Capital Cargo API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    storageType: process.env.STORAGE_TYPE || 'mongodb'
  });
});

// Storage stats endpoint
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await storageAdapter.getStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get storage stats',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Start server
async function startServer() {
  try {
    await initializeApp();
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log('');
      console.log('========================================');
      console.log('🚀 Capital Cargo API Server Started');
      console.log('========================================');
      console.log(`📍 Port: ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`💾 Storage: ${process.env.STORAGE_TYPE || 'mongodb'}`);
      console.log(`🌐 Access: http://0.0.0.0:${PORT}`);
      console.log('========================================');
      console.log('');
      console.log('Available endpoints:');
      console.log(`  GET  http://localhost:${PORT}/api/health`);
      console.log(`  GET  http://localhost:${PORT}/api/shipments`);
      console.log(`  POST http://localhost:${PORT}/api/contact`);
      console.log(`  POST http://localhost:${PORT}/api/quote`);
      console.log('');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

startServer();

module.exports = app;
