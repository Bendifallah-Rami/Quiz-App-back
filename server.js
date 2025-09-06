const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const passport = require('./config/passport');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Import database connection
const { sequelize, testConnection } = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
// app.use(morgan('combined')); // Disable HTTP request logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies

// Initialize Passport
app.use(passport.initialize());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/quizzes', require('./routes/quizzes')); 
app.use('/api/categories', require('./routes/categories'));
app.use('/api/tags', require('./routes/tags'));
app.use('/api/quizeTag', require('./routes/quizeTag'));
app.use('/api/options', require('./routes/options'));
app.use('/api/quizAttempts', require('./routes/quizAttempts'));
app.use('/api/userStats', require('./routes/userStats'));

// Health check endpoint 
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Quiz App Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Quiz App API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      quizzes: '/api/quizzes',
      users: '/api/users',
      categories: '/api/categories',
      tags: '/api/tags'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The route ${req.originalUrl} does not exist`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    console.log('✅ Database connection established');
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
      console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
