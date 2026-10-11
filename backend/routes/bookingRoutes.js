const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Notification = require('../models/Notification');
const WalletTransaction = require('../models/WalletTransaction');
const User = require('../models/User');
const Hotel = require('../models/Hotel');
const mongoose = require('mongoose');

// Helper to resolve mongo _id from Clerk ID or Mongo ID string
const resolveUser = async (userId) => {
  if (!userId || userId.startsWith('guest_')) return null;
  try {
    // 1. Try finding by Mongo ObjectId if it's a valid hex string
    if (mongoose.Types.ObjectId.isValid(userId)) {
      const user = await User.findById(userId);
      if (user) return user._id;
    }
    // 2. Otherwise find by Clerk clerkId
    const user = await User.findOne({ clerkId: userId });
    return user ? user._id : null;
  } catch (err) {
    console.error('Error resolving user:', err);
    return null;
  }
};

// GET /api/bookings/user/:userId
router.get('/user/:userId', async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId }).sort({ createdAt: -1 }).lean();
    res.json(bookings.map(b => ({
      ...b, id: b._id.toString(), userId: b.user?.toString() || null, hotelId: b.hotel.toString(), roomId: b.room.toString(),
    })));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/bookings/hotel/:hotelId
router.get('/hotel/:hotelId', async (req, res) => {
  try {
    const hotelQuery = mongoose.Types.ObjectId.isValid(req.params.hotelId)
      ? { $in: [req.params.hotelId, new mongoose.Types.ObjectId(req.params.hotelId)] }
      : req.params.hotelId;
    const bookings = await Booking.find({ hotel: hotelQuery }).sort({ createdAt: -1 }).lean();
    res.json(bookings.map(b => ({
      ...b, id: b._id.toString(), userId: b.user?.toString() || null, hotelId: b.hotel.toString(), roomId: b.room.toString(),
    })));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/bookings — all bookings (admin)
router.get('/', async (req, res) => {
  try {
    const rawBookings = await Booking.find().sort({ createdAt: -1 }).lean();
    
    // Enrich each booking with resolved user and hotel details if missing
    const enriched = await Promise.all(rawBookings.map(async (b) => {
      let resolvedGuestName = b.guestName;
      let resolvedGuestEmail = b.guestEmail;
      let resolvedGuestPhone = b.guestPhone;
      let resolvedHotelName = b.hotelName;

      // If user ObjectId exists, populate user info if fields are empty
      if (b.user && mongoose.Types.ObjectId.isValid(b.user)) {
        try {
          const u = await User.findById(b.user).lean();
          if (u) {
            if (!resolvedGuestName) resolvedGuestName = u.name;
            if (!resolvedGuestEmail) resolvedGuestEmail = u.email;
            if (!resolvedGuestPhone && u.phone) resolvedGuestPhone = u.phone;
          }
        } catch (_) {}
      }

      // If hotel is ObjectId and hotelName is default/placeholder, resolve hotel name
      if ((!resolvedHotelName || resolvedHotelName === 'Stay Buddy Managed') && b.hotel && mongoose.Types.ObjectId.isValid(b.hotel)) {
        try {
          const h = await Hotel.findById(b.hotel).lean();
          if (h && h.name) resolvedHotelName = h.name;
        } catch (_) {}
      }

      return {
        ...b,
        id: b._id.toString(),
        userId: b.user ? b.user.toString() : null,
        hotelId: b.hotel ? b.hotel.toString() : '',
        roomId: b.room ? b.room.toString() : '',
        guestName: resolvedGuestName || 'Md Tohid',
        guestEmail: resolvedGuestEmail || 'mdtohid232020@gmail.com',
        guestPhone: resolvedGuestPhone || '+880 1712-345678',
        hotelName: (resolvedHotelName && resolvedHotelName !== 'Stay Buddy Managed') ? resolvedHotelName : 'The Grand Palace Hotel',
        roomType: b.roomType || 'Standard Deluxe Room',
        country: b.country || 'Bangladesh',
        bookingFor: b.bookingFor || 'main',
        travelingForWork: !!b.travelingForWork,
        specialRequests: b.specialRequests || '',
        arrivalTime: b.arrivalTime || "I don't know",
        paymentMethod: b.paymentMethod || 'cash',
        paymentPhone: b.paymentPhone || '',
        transactionId: b.transactionId || ''
      };
    }));

    res.json(enriched);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/bookings
router.post('/', async (req, res) => {
  try {
    const { 
      userId, hotelId, roomId, roomType, roomNumber, hotelName, 
      type, checkIn, checkOut, nights, totalPrice, paymentMethod,
      guestName, guestEmail, guestPhone, specialRequests, arrivalTime, travelingForWork,
      country, bookingFor
    } = req.body;

    // Check availability
    const room = await Room.findById(roomId);
    if (!room || room.availableCount <= 0) {
      return res.status(400).json({ message: 'Room not available' });
    }

    let resolvedHotelName = hotelName;
    if (!resolvedHotelName) {
      const h = await Hotel.findById(hotelId);
      if (h) resolvedHotelName = h.name;
    }

    const mongoUserId = await resolveUser(userId);

    const booking = await Booking.create({
      user: mongoUserId, hotel: hotelId, room: roomId,
      roomType, roomNumber, hotelName: resolvedHotelName || 'Stay Buddy Managed', type: type || 'ONLINE',
      status: 'CONFIRMED', checkIn, checkOut, nights, totalPrice, paymentMethod,
      guestName, guestEmail, guestPhone, specialRequests, arrivalTime, travelingForWork,
      country: country || 'Bangladesh', bookingFor: bookingFor || 'main'
    });

    // Decrease available count
    room.availableCount = Math.max(0, room.availableCount - 1);
    await room.save();

    // Create wallet transaction
    await WalletTransaction.create({
      hotel: hotelId, booking: booking._id, amount: totalPrice, type: 'CREDIT',
      description: `Booking ${booking._id} — ${roomType}`,
    });

    // Create notification
    await Notification.create({
      recipientId: hotelId, type: 'BOOKING', title: 'New Booking',
      message: `New ${roomType} booking for ${checkIn} to ${checkOut}. Total: ৳${totalPrice}`,
    });

    res.status(201).json({
      ...booking.toObject(), id: booking._id.toString(),
      userId: booking.user?.toString() || null, hotelId: booking.hotel.toString(), roomId: booking.room.toString(),
    });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// PATCH /api/bookings/:id/cancel
router.patch('/:id/cancel', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    booking.status = 'CANCELLED';
    await booking.save();

    // Restore room availability
    const room = await Room.findById(booking.room);
    if (room) { room.availableCount += 1; await room.save(); }

    res.json({
      ...booking.toObject(), id: booking._id.toString(),
      userId: booking.user?.toString() || null, hotelId: booking.hotel.toString(), roomId: booking.room.toString(),
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PATCH /api/bookings/:id/checkin
router.patch('/:id/checkin', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    // Mark as confirmed if pending
    if (booking.status === 'PENDING') booking.status = 'CONFIRMED';
    await booking.save();

    await Notification.create({
      recipientId: booking.hotel.toString(), type: 'CHECKIN', title: 'Guest Checked In',
      message: `Guest checked in for booking ${booking._id}`,
    });

    res.json({
      ...booking.toObject(), id: booking._id.toString(),
      userId: booking.user?.toString() || null, hotelId: booking.hotel.toString(), roomId: booking.room.toString(),
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PATCH /api/bookings/:id/checkout
router.patch('/:id/checkout', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    await booking.save();

    // Restore room availability
    const room = await Room.findById(booking.room);
    if (room) { room.availableCount += 1; await room.save(); }

    res.json({
      ...booking.toObject(), id: booking._id.toString(),
      userId: booking.user?.toString() || null, hotelId: booking.hotel.toString(), roomId: booking.room.toString(),
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/bookings/process-payment
router.post('/process-payment', async (req, res) => {
  try {
    const { 
      userId, hotelId, roomId, hotelName, roomType, roomNumber, checkIn, checkOut, nights, paymentMethod,
      totalPrice: reqTotalPrice, paymentPhone, transactionId,
      guestName, guestEmail, guestPhone, specialRequests, arrivalTime, travelingForWork,
      country, bookingFor
    } = req.body;

    let room = null;
    if (roomId && mongoose.Types.ObjectId.isValid(roomId)) {
      try {
        room = await Room.findById(roomId);
      } catch (_) {}
    }

    let resolvedHotelName = hotelName;
    if (!resolvedHotelName && hotelId && mongoose.Types.ObjectId.isValid(hotelId)) {
      try {
        const h = await Hotel.findById(hotelId);
        if (h) resolvedHotelName = h.name;
      } catch (_) {}
    }

    // Determine price (priority: reqTotalPrice > discountPrice > pricePerNight)
    const unitPrice = room ? (room.discountPrice || room.pricePerNight) : 2500;
    const finalTotalPrice = reqTotalPrice || (unitPrice * (nights || 1));

    const mongoUserId = await resolveUser(userId);

    const booking = await Booking.create({
      user: mongoUserId || userId,
      hotel: hotelId,
      room: roomId,
      roomType: room?.type || roomType || 'Standard Deluxe Room',
      roomNumber: room?.roomNumber || roomNumber || '101',
      hotelName: resolvedHotelName || 'StayBD Verified Hotel',
      type: 'ONLINE',
      status: 'CONFIRMED',
      checkIn: checkIn || new Date().toISOString().split('T')[0],
      checkOut: checkOut || new Date(Date.now() + 86400000 * (nights || 1)).toISOString().split('T')[0],
      nights: nights || 1,
      totalPrice: finalTotalPrice,
      paymentMethod: (paymentMethod || 'cash').toLowerCase(),
      paymentPhone: paymentPhone || '',
      transactionId: transactionId || '',
      guestName: guestName || 'Walk-in Guest',
      guestEmail: guestEmail || 'guest@staybuddy.com',
      guestPhone: guestPhone || '',
      specialRequests: specialRequests || '',
      arrivalTime: arrivalTime || "I don't know",
      travelingForWork: !!travelingForWork,
      country: country || 'Bangladesh',
      bookingFor: bookingFor || 'main'
    });

    // Decrease available count if room in DB
    if (room) {
      room.availableCount = Math.max(0, room.availableCount - 1);
      await room.save().catch(() => {});
    }

    // Create wallet transaction if hotel is mongo ID
    if (hotelId && mongoose.Types.ObjectId.isValid(hotelId)) {
      await WalletTransaction.create({
        hotel: hotelId, booking: booking._id, amount: finalTotalPrice, type: 'CREDIT',
        description: `Confirmed Online Booking — ${booking.roomType}`,
      }).catch(() => {});

      await Notification.create({
        recipientId: hotelId, type: 'BOOKING', title: 'Payment Success',
        message: `New paid booking for ${booking.roomType}. Revenue: ৳${finalTotalPrice}`,
      }).catch(() => {});
    }

    res.status(201).json({
      message: 'Payment processed and booking confirmed!',
      booking: { ...booking.toObject(), id: booking._id.toString() }
    });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

module.exports = router;
