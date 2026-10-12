const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');
const { uploadImages } = require('../utils/uploadHelpers');

// GET /api/rooms/hotel/:hotelId
router.get('/hotel/:hotelId', async (req, res) => {
  try {
    const { hotelId } = req.params;
    let query = {};
    if (mongoose.Types.ObjectId.isValid(hotelId)) {
      query = { hotel: hotelId };
    }
    const rooms = await Room.find(query)
      .populate('hotel', 'name city images address')
      .sort({ updatedAt: -1, createdAt: -1 })
      .lean();

    res.json(rooms.map(r => {
      const hImages = r.hotel?.images;
      const hotelImg = Array.isArray(hImages)
        ? hImages[0]
        : (typeof hImages === 'string' ? hImages.split(' ')[0] : (r.images?.[0] || ''));
      return {
        ...r,
        id: r._id.toString(),
        hotelId: r.hotel?._id?.toString() || (r.hotel ? r.hotel.toString() : hotelId),
        hotelName: r.hotel?.name || "StayBD Partner Hotel",
        hotelCity: r.hotel?.city || "Cox's Bazar",
        hotelImage: hotelImg
      };
    }));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/rooms — all rooms sorted newest first with complete hotel details
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find()
      .populate('hotel', 'name city images address')
      .sort({ updatedAt: -1, createdAt: -1 })
      .lean();

    res.json(rooms.map(r => {
      const hImages = r.hotel?.images;
      const hotelImg = Array.isArray(hImages)
        ? hImages[0]
        : (typeof hImages === 'string' ? hImages.split(' ')[0] : (r.images?.[0] || ''));
      return {
        ...r,
        id: r._id.toString(),
        hotelId: r.hotel?._id?.toString() || (r.hotel ? r.hotel.toString() : ''),
        hotelName: r.hotel?.name || "StayBD Partner Hotel",
        hotelCity: r.hotel?.city || "Cox's Bazar",
        hotelImage: hotelImg
      };
    }));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/rooms
router.post('/', async (req, res) => {
  try {
    const { images: imgPayload, category, hotelId, hotelName, hotelCity, ...roomData } = req.body;
    const uploadedImages = await uploadImages(imgPayload, 'staybuddy/rooms');
    
    let resolvedHotelId = hotelId;
    let resolvedHotel = null;
    if (resolvedHotelId && mongoose.Types.ObjectId.isValid(resolvedHotelId)) {
      resolvedHotel = await Hotel.findById(resolvedHotelId).lean();
    }
    if (!resolvedHotel) {
      resolvedHotel = await Hotel.findOne().lean();
      if (resolvedHotel) {
        resolvedHotelId = resolvedHotel._id;
      } else {
        resolvedHotelId = new mongoose.Types.ObjectId();
      }
    }

    const finalImages = (uploadedImages && uploadedImages.length > 0)
      ? uploadedImages
      : (Array.isArray(roomData.images) && roomData.images.length > 0 ? roomData.images : ["https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800"]);

    const room = await Room.create({ 
      ...roomData, 
      category: category || "Deluxe Room",
      hotel: resolvedHotelId, 
      images: finalImages
    });

    const hName = hotelName || resolvedHotel?.name || "StayBD Partner Hotel";
    const hCity = hotelCity || resolvedHotel?.city || "Cox's Bazar";
    const hImg = resolvedHotel?.images ? (Array.isArray(resolvedHotel.images) ? resolvedHotel.images[0] : resolvedHotel.images.split(' ')[0]) : finalImages[0];

    res.status(201).json({
      ...room.toObject(),
      id: room._id.toString(),
      hotelId: room.hotel.toString(),
      hotelName: hName,
      hotelCity: hCity,
      hotelImage: hImg
    });
  } catch (err) { 
    console.error("Room create error:", err);
    res.status(400).json({ message: err.message }); 
  }
});

// PATCH /api/rooms/:id
router.patch('/:id', async (req, res) => {
  try {
    if (req.body.images) {
      req.body.images = await uploadImages(req.body.images, 'staybuddy/rooms');
    }
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json({ ...room, id: room._id.toString(), hotelId: room.hotel.toString() });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/rooms/:id
router.delete('/:id', async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PATCH /api/rooms/:id/price
router.patch('/:id/price', async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id, 
      { pricePerNight: req.body.pricePerNight, updatedAt: new Date() }, 
      { new: true }
    ).lean();
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json({ ...room, id: room._id.toString(), hotelId: room.hotel.toString() });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PATCH /api/rooms/:id/inventory
router.patch('/:id/inventory', async (req, res) => {
  try {
    const { totalInventory, availableCount } = req.body;
    const room = await Room.findByIdAndUpdate(
      req.params.id, 
      { totalInventory, availableCount, updatedAt: new Date() }, 
      { new: true }
    ).lean();
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json({ ...room, id: room._id.toString(), hotelId: room.hotel.toString() });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PATCH /api/rooms/:id/discount
router.patch('/:id/discount', async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id, 
      { discountPrice: req.body.discountPrice, updatedAt: new Date() }, 
      { new: true }
    ).lean();
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json({ ...room, id: room._id.toString(), hotelId: room.hotel.toString() });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/rooms/:id/calendar?year=2026&month=3
router.get('/:id/calendar', async (req, res) => {
  try {
    const { year, month } = req.query;
    const y = parseInt(year); const m = parseInt(month);
    const daysInMonth = new Date(y, m, 0).getDate();
    const room = await Room.findById(req.params.id).lean();
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const bookings = await Booking.find({
      room: req.params.id,
      status: 'CONFIRMED',
    }).lean();

    const days = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayBookings = bookings.filter(b => dateStr >= b.checkIn && dateStr < b.checkOut);
      days.push({
        date: dateStr,
        isBooked: dayBookings.length >= room.totalInventory,
        bookingId: dayBookings[0]?._id?.toString(),
        guestName: '',
        availableCount: Math.max(0, room.totalInventory - dayBookings.length),
        totalCount: room.totalInventory,
      });
    }
    res.json(days);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
