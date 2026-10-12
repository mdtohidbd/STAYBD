const mongoose = require('mongoose');
const dns = require('dns');

// Fix for Windows / ISP DNS resolution issues with MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (err) {
  // Ignore if custom DNS cannot be set
}

let cachedPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!process.env.MONGODB_URI) {
    console.warn('⚠️ MONGODB_URI environment variable is missing. Database connection skipped.');
    return null;
  }

  if (!cachedPromise) {
    cachedPromise = mongoose.connect(process.env.MONGODB_URI, {

      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    }).then((conn) => {
      console.log(`✅ MongoDB connected: ${conn.connection.host}`);
      return conn;
    }).catch((error) => {
      cachedPromise = null;
      console.error(`❌ MongoDB connection error: ${error.message}`);
      throw error;
    });
  }

  return cachedPromise;
};

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected.');
  cachedPromise = null;
});

mongoose.connection.on('error', (err) => {
  console.error('⚠️ MongoDB connection error event:', err.message);
});

module.exports = connectDB;

