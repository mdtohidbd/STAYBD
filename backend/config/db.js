const mongoose = require('mongoose');
const dns = require('dns');

// Fix for Windows / ISP DNS resolution issues with MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (err) {
  // Ignore if custom DNS cannot be set
}

let isConnecting = false;

const connectDB = async () => {
  if (isConnecting || mongoose.connection.readyState === 1) return;
  isConnecting = true;

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    isConnecting = false;
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    isConnecting = false;
    // Auto-retry connection after 4 seconds instead of killing process
    setTimeout(connectDB, 4000);
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected. Retrying in 3 seconds...');
  setTimeout(connectDB, 3000);
});

mongoose.connection.on('error', (err) => {
  console.error('⚠️ MongoDB connection error event:', err.message);
});

module.exports = connectDB;
