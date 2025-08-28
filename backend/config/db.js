const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // Check if MONGO_URI is set
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not set. Please check your Render environment variables.');
    }

    console.log('🔗 Attempting to connect to MongoDB...');
    console.log('Environment:', process.env.NODE_ENV || 'development');
    console.log('MongoDB URI provided:', process.env.MONGO_URI ? 'Yes' : 'No');
    
    // Validate URI format
    if (process.env.MONGO_URI.includes('localhost') || process.env.MONGO_URI.includes('127.0.0.1')) {
      console.warn('⚠️  Warning: Using localhost MongoDB URI in production environment');
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Cannot use localhost MongoDB URI in production. Please set a proper MongoDB Atlas URI in MONGO_URI environment variable.');
      }
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Modern connection options
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.error('Environment variables check:');
    console.error('- NODE_ENV:', process.env.NODE_ENV || 'not set');
    console.error('- PORT:', process.env.PORT || 'not set');
    console.error('- MONGO_URI:', process.env.MONGO_URI ? 'set' : 'NOT SET');
    console.error('- JWT_SECRET:', process.env.JWT_SECRET ? 'set' : 'NOT SET');
    
    if (process.env.NODE_ENV === 'production') {
      console.error('\n🚨 PRODUCTION DEPLOYMENT ERROR:');
      console.error('Please check your Render environment variables:');
      console.error('1. Go to your Render service dashboard');
      console.error('2. Navigate to Environment tab');
      console.error('3. Ensure MONGO_URI is set to your MongoDB Atlas connection string');
      console.error('4. Ensure JWT_SECRET is set to a secure random string');
    }
    
    process.exit(1);
  }
};

module.exports = connectDB;