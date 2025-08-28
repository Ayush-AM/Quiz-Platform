const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/quizzes', require('./routes/quiz'));
app.use('/api/results', require('./routes/result'));

// Home route
app.get('/', (req, res) => {
  res.send('Quiz API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API Health Check: http://localhost:${PORT}/`);
  console.log(`📊 Database Status: Connected to MongoDB`);
  console.log('\n🔍 Available Routes:');
  console.log(`  GET  / - Health check`);
  console.log(`  POST /api/auth/register - User registration`);
  console.log(`  POST /api/auth/login - User login`);
  console.log(`  GET  /api/auth/test - API connection test`);
  console.log(`  GET  /api/quizzes - Get all quizzes`);
  console.log(`  POST /api/results - Submit quiz result`);
});
