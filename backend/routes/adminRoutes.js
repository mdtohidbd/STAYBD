const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Hotel = require('../models/Hotel');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const Advertisement = require('../models/Advertisement');
const HousekeepingTask = require('../models/HousekeepingTask');
const DynamicPricingRule = require('../models/DynamicPricingRule');
const Notification = require('../models/Notification');
const WalletTransaction = require('../models/WalletTransaction');

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, totalHotels, totalBookings, totalRooms, totalReviews] = await Promise.all([
      User.countDocuments(),
      Hotel.countDocuments(),
      Booking.countDocuments(),
      Room.countDocuments(),
      Review.countDocuments(),
    ]);

    const revenue = await Booking.aggregate([
      { $match: { status: 'CONFIRMED' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);

    res.json({
      totalUsers, totalHotels, totalBookings, totalRooms, totalReviews,
      totalRevenue: revenue[0]?.total || 0,
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── Ads ──
router.get('/ads', async (req, res) => {
  try {
    const ads = await Advertisement.find().sort({ createdAt: -1 }).lean();
    res.json(ads.map(a => ({ ...a, id: a._id.toString(), hotelId: a.hotel.toString() })));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── Housekeeping ──
router.get('/housekeeping/:hotelId', async (req, res) => {
  try {
    const hotelQuery = mongoose.Types.ObjectId.isValid(req.params.hotelId)
      ? { $in: [req.params.hotelId, new mongoose.Types.ObjectId(req.params.hotelId)] }
      : req.params.hotelId;
    const tasks = await HousekeepingTask.find({ hotel: hotelQuery }).lean();
    res.json(tasks.map(t => ({
      ...t, id: t._id.toString(), hotelId: t.hotel.toString(), roomId: t.room ? t.room.toString() : '',
    })));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.patch('/housekeeping/:id', async (req, res) => {
  try {
    const { status, notes } = req.body;
    const task = await HousekeepingTask.findByIdAndUpdate(
      req.params.id,
      { status, ...(notes !== undefined && { notes }) },
      { new: true }
    ).lean();
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ ...task, id: task._id.toString(), hotelId: task.hotel.toString(), roomId: task.room ? task.room.toString() : '' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── Dynamic Pricing ──
router.get('/pricing/:hotelId', async (req, res) => {
  try {
    const hotelQuery = mongoose.Types.ObjectId.isValid(req.params.hotelId)
      ? { $in: [req.params.hotelId, new mongoose.Types.ObjectId(req.params.hotelId)] }
      : req.params.hotelId;
    const rules = await DynamicPricingRule.find({ hotel: hotelQuery }).lean();
    res.json(rules.map(r => ({ ...r, id: r._id.toString(), hotelId: r.hotel.toString(), roomId: r.room ? r.room.toString() : '' })));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/pricing', async (req, res) => {
  try {
    const rule = await DynamicPricingRule.create({ ...req.body, hotel: req.body.hotelId, room: req.body.roomId });
    res.status(201).json({ ...rule.toObject(), id: rule._id.toString(), hotelId: rule.hotel.toString(), roomId: rule.room ? rule.room.toString() : '' });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/pricing/:id', async (req, res) => {
  try {
    await DynamicPricingRule.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── Guest Profiles (CRM) ──
router.get('/guests/:hotelId', async (req, res) => {
  try {
    const hotelQuery = mongoose.Types.ObjectId.isValid(req.params.hotelId)
      ? { $in: [req.params.hotelId, new mongoose.Types.ObjectId(req.params.hotelId)] }
      : req.params.hotelId;
    const bookings = await Booking.find({ hotel: hotelQuery, status: 'CONFIRMED' }).populate('user', 'name email phone').lean();
    const profiles = {};
    bookings.forEach(b => {
      const uid = b.user?._id?.toString() || b.guestEmail || b.guestPhone || b.guestName;
      if (!uid) return;
      if (!profiles[uid]) {
        profiles[uid] = {
          userId: uid,
          name: b.user?.name || b.guestName || 'Verified Guest',
          email: b.user?.email || b.guestEmail || '',
          phone: b.user?.phone || b.guestPhone || '',
          totalBookings: 0,
          totalSpent: 0,
          lastStay: '',
          preferredRoomType: b.roomType,
        };
      }
      profiles[uid].totalBookings++;
      profiles[uid].totalSpent += (b.totalPrice || 0);
      if (!profiles[uid].lastStay || b.checkOut > profiles[uid].lastStay) profiles[uid].lastStay = b.checkOut;
    });
    res.json(Object.values(profiles));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── Occupancy Report ──
router.get('/occupancy/:hotelId', async (req, res) => {
  try {
    const { year, month } = req.query;
    const y = parseInt(year); const m = parseInt(month);
    const monthStr = `${y}-${String(m).padStart(2,'0')}`;
    const hotelQuery = mongoose.Types.ObjectId.isValid(req.params.hotelId)
      ? { $in: [req.params.hotelId, new mongoose.Types.ObjectId(req.params.hotelId)] }
      : req.params.hotelId;
    const rooms = await Room.find({ hotel: hotelQuery }).lean();
    const bookings = await Booking.find({ hotel: hotelQuery, status: 'CONFIRMED' }).lean();

    const daysInMonth = new Date(y, m, 0).getDate();
    const roomStats = rooms.map(room => {
      const roomBookings = bookings.filter(b => (b.room?.toString() === room._id.toString() || b.roomType === room.type));
      const rev = roomBookings.reduce((s, b) => s + b.totalPrice, 0);
      return {
        roomId: room._id.toString(), roomType: room.type,
        totalBookings: roomBookings.length, totalRevenue: rev,
        occupancyRate: Math.min(100, Math.round((roomBookings.length / Math.max(1, daysInMonth)) * 100)),
      };
    });

    res.json({
      month: monthStr, hotelId: req.params.hotelId, roomStats,
      totalRevenue: roomStats.reduce((s, r) => s + r.totalRevenue, 0),
      avgOccupancyRate: roomStats.length > 0 ? Math.round(roomStats.reduce((s, r) => s + r.occupancyRate, 0) / roomStats.length) : 0,
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── Wallet Ledger & Payouts ──
router.get('/wallet/:hotelId', async (req, res) => {
  try {
    const hotelQuery = mongoose.Types.ObjectId.isValid(req.params.hotelId)
      ? { $in: [req.params.hotelId, new mongoose.Types.ObjectId(req.params.hotelId)] }
      : req.params.hotelId;
    const txs = await WalletTransaction.find({ hotel: hotelQuery }).sort({ createdAt: -1 }).lean();
    const bookings = await Booking.find({ hotel: hotelQuery, status: 'CONFIRMED' }).lean();
    const totalRevenue = bookings.reduce((s, b) => s + (b.totalPrice || 0), 0);
    const totalDebited = txs.filter(t => t.type === 'DEBIT').reduce((s, t) => s + (t.amount || 0), 0);
    const balance = Math.max(0, totalRevenue - totalDebited);
    res.json({
      totalBalance: balance,
      transactions: txs.map(t => ({
        id: t._id.toString(),
        hotelId: t.hotel?.toString() || req.params.hotelId,
        type: t.type,
        amount: t.amount,
        description: t.description || 'Transaction',
        createdAt: t.createdAt,
        status: 'COMPLETED',
      }))
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/wallet/payout', async (req, res) => {
  try {
    const { hotelId, amount, method, account } = req.body;
    const tx = await WalletTransaction.create({
      hotel: hotelId,
      type: 'DEBIT',
      amount: Number(amount),
      description: `Payout via ${(method || 'WALLET').toUpperCase()} to ${account || 'Account'}`,
    });
    res.status(201).json({ success: true, transaction: tx });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// POST /api/admin/onboard-owner — Complete Enterprise Partner Onboarding
router.post('/onboard-owner', async (req, res) => {
  try {
    const {
      name, email, phone, password,
      nidNumber, nidDocUrl, tradeLicenseNumber, hotelAuthDocUrl,
      hotelName, city, address, hotelCategory, hotelDescription,
      hotelImage, amenities, initialRoom, commissionRate, verificationStatus
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Owner full name and email are required.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password || 'owner123456', salt);

    // 1. Create or update User as OWNER
    let user = await User.findOne({ email });
    const subscriptionEndDate = new Date(Date.now() + 365 * 86400000); // 1-year complimentary

    const userData = {
      name,
      email,
      phone: phone || '+880 1712-000000',
      password: hashedPassword,
      role: 'OWNER',
      status: 'ACTIVE',
      verificationStatus: verificationStatus || 'VERIFIED',
      subscriptionEndDate,
      hasAdminOverride: true,
      nidNumber: nidNumber || '',
      nidDocUrl: nidDocUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600',
      tradeLicenseNumber: tradeLicenseNumber || '',
      hotelAuthDocUrl: hotelAuthDocUrl || '',
      hotelName: hotelName || `${name}'s Hotel`,
      hotelAddress: address || 'Prime Tourism Hub',
      hotelCity: city || 'Cox\'s Bazar',
      commissionRate: commissionRate ? Number(commissionRate) : 10
    };

    if (user) {
      Object.assign(user, userData);
      await user.save();
    } else {
      user = await User.create(userData);
    }

    // 2. Create Hotel for this owner
    const hotelImages = hotelImage
      ? [hotelImage, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800']
      : ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'];

    const resolvedHotelName = hotelName || `${name} Premier Hotel & Resort`;
    const resolvedCity = city || 'Cox\'s Bazar';
    const resolvedAddress = address || 'Marine Drive Road';

    const hotel = await Hotel.create({
      owner: user._id,
      name: resolvedHotelName,
      description: hotelDescription || `Verified ${hotelCategory || 'hospitality property'} in ${resolvedCity}. Managed directly with StayBD Enterprise SaaS.`,
      address: resolvedAddress,
      city: resolvedCity,
      rating: 4.8,
      totalReviews: 24,
      isVerified: true,
      isActive: true,
      images: hotelImages,
      amenities: amenities && amenities.length ? amenities : ['Free High-Speed Wi-Fi', 'Swimming Pool', '24/7 Security', 'Attached Bath', 'Power Backup'],
      acceptedPayments: ['Cash', 'bKash', 'Nagad', 'Card']
    });

    // 3. Create initial Room for this hotel
    const roomType = initialRoom?.type || 'Executive Deluxe Ocean Suite';
    const roomCategory = initialRoom?.category || 'Executive Suite';
    const pricePerNight = initialRoom?.pricePerNight ? Number(initialRoom.pricePerNight) : 3800;
    const inventory = initialRoom?.totalInventory ? Number(initialRoom.totalInventory) : 8;

    const room = await Room.create({
      hotel: hotel._id,
      type: roomType,
      category: roomCategory,
      pricePerNight,
      discountPrice: Math.round(pricePerNight * 0.9),
      totalInventory: inventory,
      availableCount: inventory,
      floorNumber: initialRoom?.floorNumber || 3,
      roomNumber: initialRoom?.roomNumber || '301',
      images: [hotelImages[0]],
      amenities: ['Air Conditioning', 'Free Wi-Fi', 'King Bed', 'Attached Bath', 'Private Balcony'],
      maxAdults: 2,
      maxChildren: 1
    });

    // 4. Send welcoming notification
    await Notification.create({
      recipientId: user._id.toString(),
      type: 'SYSTEM',
      title: 'Partner Account Verified',
      message: `Welcome ${name}! Your property "${hotel.name}" in ${hotel.city} has been onboarded and is live on StayBD.`
    }).catch(() => {});

    res.status(201).json({
      success: true,
      message: `Owner ${name} and hotel "${hotel.name}" onboarded successfully!`,
      owner: {
        ...user.toObject(),
        id: user._id.toString()
      },
      hotel: {
        ...hotel.toObject(),
        id: hotel._id.toString(),
        ownerId: user._id.toString()
      },
      room: {
        ...room.toObject(),
        id: room._id.toString(),
        hotelId: hotel._id.toString()
      }
    });
  } catch (err) {
    console.error('Error onboarding owner:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
