const path = require('path');
require('dotenv').config();
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');

const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

// ── Connect to MongoDB ──
connectDB();

const app = express();

// ── Middleware ──
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

// ── Ensure DB readiness for API routes (except health check) ──
app.use('/api', async (req, res, next) => {
  if (req.path === '/health') return next();
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
    next();
  } catch (err) {
    return res.status(503).json({
      success: false,
      message: 'Database is connecting or temporarily unavailable: ' + (err.message || 'Please retry in a moment.'),
    });
  }
});


// ── Routes ──
app.use('/api/auth',          require('./routes/authRoutes'));
app.use('/api/users',         require('./routes/userRoutes'));
app.use('/api/hotels',        require('./routes/hotelRoutes'));
app.use('/api/rooms',         require('./routes/roomRoutes'));
app.use('/api/bookings',      require('./routes/bookingRoutes'));
app.use('/api/reviews',       require('./routes/reviewRoutes'));
app.use('/api/offers',        require('./routes/offerRoutes'));
app.use('/api/experiences',   require('./routes/experienceRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/services',      require('./routes/serviceRoutes'));
app.use('/api/complaints',    require('./routes/complaintRoutes'));
app.use('/api/admin',         require('./routes/adminRoutes'));

// ── Health check ──
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// ── Global error handler ──
app.use((err, req, res, _next) => {
  console.error('💥 Unhandled error:', err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// ── Start ──
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Stay Buddy API running on port ${PORT}`);
  });
}

module.exports = app;
