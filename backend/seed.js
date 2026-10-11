/**
 * Seed script — populates MongoDB with all the mock data from the frontend api.ts.
 * Run: cd backend && npm run seed
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

// Models
const User = require('./models/User');
const Hotel = require('./models/Hotel');
const Room = require('./models/Room');
const Booking = require('./models/Booking');
const Review = require('./models/Review');
const Offer = require('./models/Offer');
const Experience = require('./models/Experience');
const ExperienceReview = require('./models/ExperienceReview');
const Notification = require('./models/Notification');
const HousekeepingTask = require('./models/HousekeepingTask');
const HotelService = require('./models/HotelService');

async function seed() {
  await connectDB();
  console.log('🌱 Seeding database...\n');

  // ── Clear all collections ──
  await Promise.all([
    User.deleteMany({}), Hotel.deleteMany({}), Room.deleteMany({}),
    Booking.deleteMany({}), Review.deleteMany({}), Offer.deleteMany({}),
    Experience.deleteMany({}), ExperienceReview.deleteMany({}),
    Notification.deleteMany({}), HousekeepingTask.deleteMany({}),
    HotelService.deleteMany({}),
  ]);
  console.log('  ✓ Cleared all collections');

  // ── Users ──
  const users = await User.insertMany([
    { name: 'Platform Admin', email: 'admin@staybuddy.com', role: 'ADMIN', status: 'ACTIVE' },
    { name: 'Rahim Khan', email: 'rahim@gmail.com', role: 'USER', status: 'ACTIVE' },
    { name: 'Sumaiya Akter', email: 'sumaiya@gmail.com', role: 'USER', status: 'BLOCKED' },
    { name: 'Hotel Owner 1', email: 'owner1@staybuddy.com', role: 'OWNER', status: 'ACTIVE' },
    { name: 'Hotel Owner 2', email: 'owner2@staybuddy.com', role: 'OWNER', status: 'ACTIVE' },
  ]);
  const [admin, user1, user2, owner1, owner2] = users;
  console.log(`  ✓ ${users.length} users`);

  // ── Hotels ──
  const hotels = await Hotel.insertMany([
    {
      owner: owner1._id, name: 'The Grand Palace Hotel',
      description: 'Luxury 5-star hotel in Dhaka.', address: 'Road 12, Gulshan-2', city: 'Dhaka',
      locationLat: 23.7946, locationLng: 90.4152,
      images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
      rating: 4.7, totalReviews: 248, isVerified: true, isRedMarked: false, isActive: true,
      amenities: ['WiFi', 'Pool', 'Gym', 'Spa'],
      checkInTime: '14:00 PM', checkOutTime: '12:00 PM',
      acceptedPayments: ['VISA', 'Mastercard', 'bKash'],
    },
    {
      owner: owner2._id, name: 'Budget Stay Mirpur',
      description: 'Affordable stay.', address: 'Section 10', city: 'Dhaka',
      locationLat: 23.8041, locationLng: 90.3659,
      images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'],
      rating: 3.9, totalReviews: 87, isVerified: true, isRedMarked: false, isActive: true,
      amenities: ['WiFi'],
      checkInTime: '13:00 PM', checkOutTime: '11:00 AM',
      acceptedPayments: ['Cash', 'bKash'],
    },
    {
      owner: owner1._id, name: 'Sky View Banani',
      description: 'Boutique hotel.', address: 'Banani 11', city: 'Dhaka',
      locationLat: 23.7936, locationLng: 90.3988,
      images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800'],
      rating: 4.5, totalReviews: 134, isVerified: true, isRedMarked: false, isActive: true,
      amenities: ['WiFi', 'AC', 'Restaurant'],
      checkInTime: '14:00 PM', checkOutTime: '12:00 PM',
      acceptedPayments: ['VISA', 'Mastercard', 'Amex'],
    },
    /* Rajshahi Hotels */
    {
      owner: owner1._id, name: 'Royal Hotel Rajshahi',
      description: 'Elegant stay in the silk city.', address: 'Court Road', city: 'Rajshahi',
      locationLat: 24.3745, locationLng: 88.6042,
      images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800'],
      rating: 4.2, totalReviews: 45, isVerified: true, isRedMarked: false, isActive: true,
      amenities: ['WiFi', 'AC'],
      checkInTime: '12:00 PM', checkOutTime: '11:00 AM',
      acceptedPayments: ['Cash', 'bKash'],
    },
    {
      owner: owner2._id, name: 'Silk City Inn',
      description: 'Modern budget stay.', address: 'Zero Point', city: 'Rajshahi',
      locationLat: 24.3636, locationLng: 88.6241,
      images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'],
      rating: 3.8, totalReviews: 21, isVerified: true, isRedMarked: false, isActive: true,
      amenities: ['WiFi'],
      checkInTime: '13:00 PM', checkOutTime: '11:00 AM',
      acceptedPayments: ['Cash'],
    },
    /* Panchagarh Hotels */
    {
      owner: owner1._id, name: 'Panchagarh Eco Resort',
      description: 'Nature-friendly resort with tea garden view.', address: 'Dhakka-Panchagarh Hwy', city: 'Panchagarh',
      locationLat: 26.3411, locationLng: 88.5544,
      images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800'],
      rating: 4.8, totalReviews: 12, isVerified: true, isRedMarked: false, isActive: true,
      amenities: ['WiFi', 'Tea Garden', 'Organic Food'],
      checkInTime: '12:00 PM', checkOutTime: '11:00 AM',
      acceptedPayments: ['Cash', 'bKash'],
    },
    {
      owner: owner2._id, name: 'Border View Inn',
      description: 'Budget stay near the border.', address: 'Banglabandha Road', city: 'Panchagarh',
      locationLat: 26.3333, locationLng: 88.5666,
      images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'],
      rating: 3.5, totalReviews: 5, isVerified: true, isRedMarked: false, isActive: true,
      amenities: ['WiFi', 'Parking'],
      checkInTime: '13:00 PM', checkOutTime: '11:00 AM',
      acceptedPayments: ['Cash'],
    },
    /* Cox's Bazar Hotels */
    {
      owner: owner1._id, name: 'Sayeman Beach Resort',
      description: 'Premier 5-star beachfront luxury resort overlooking the Bay of Bengal.', address: 'Marine Drive Road, Kolatoli', city: "Cox's Bazar",
      locationLat: 21.4272, locationLng: 91.9702,
      images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
      rating: 4.9, totalReviews: 512, isVerified: true, isRedMarked: false, isActive: true,
      amenities: ['WiFi', 'Pool', 'Ocean View', 'Restaurant', 'Spa', 'Gym'],
      checkInTime: '14:00 PM', checkOutTime: '12:00 PM',
      acceptedPayments: ['VISA', 'Mastercard', 'bKash', 'Nagad'],
    },
    {
      owner: owner2._id, name: 'Ocean Paradise Hotel & Resort',
      description: 'Spacious beachside comfort with infinity pool and direct beach access.', address: '28-29 Hotel Motel Zone, Kolatoli Road', city: "Cox's Bazar",
      locationLat: 21.4300, locationLng: 91.9750,
      images: ['https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800'],
      rating: 4.7, totalReviews: 380, isVerified: true, isRedMarked: false, isActive: true,
      amenities: ['WiFi', 'Pool', 'AC', 'Breakfast', 'Parking'],
      checkInTime: '13:00 PM', checkOutTime: '11:30 AM',
      acceptedPayments: ['VISA', 'bKash', 'Cash'],
    },
    /* Sylhet & Sreemangal Hotels */
    {
      owner: owner1._id, name: 'Grand Sultan Tea Resort & Golf',
      description: 'Grand Sultan Tea Resort & Golf is Bangladesh\'s premier 5-star eco-luxury sanctuary nestled among the rolling emerald tea gardens of Sreemangal. Spanning over 13 acres of verdant landscapes, the resort features a world-class 9-hole golf course, three temperature-controlled outdoor swimming pools, an Ayurvedic wellness spa, and three signature dining restaurants.', address: 'Radhanagar, Sreemangal, Moulvibazar', city: 'Sylhet',
      locationLat: 24.3065, locationLng: 91.7296,
      images: [
        'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80'
      ],
      rating: 4.9, totalReviews: 420, isVerified: true, isRedMarked: false, isActive: true,
      amenities: ['Free High-Speed Wi-Fi', '3 Swimming Pools', '9-Hole Golf Course', 'Ayurvedic Spa & Wellness', 'Rolling Tea Garden Vistas', '3 Signature Restaurants', 'Complimentary Buffet Breakfast', 'Fitness Center & Gym', 'Valet & Free Private Parking', '24/7 Concierge Service', 'Private Helipad Access', 'Lawachara Forest Tours'],
      checkInTime: '14:00 PM', checkOutTime: '12:00 PM',
      acceptedPayments: ['VISA', 'Mastercard', 'bKash'],
    },
    {
      owner: owner2._id, name: 'Rose View Hotel Sylhet',
      description: 'Luxury business and leisure hotel in the heart of Sylhet city.', address: 'Shahjalal Uposhahar', city: 'Sylhet',
      locationLat: 24.8864, locationLng: 91.8790,
      images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
      rating: 4.6, totalReviews: 290, isVerified: true, isRedMarked: false, isActive: true,
      amenities: ['WiFi', 'Pool', 'Restaurant', 'Gym'],
      checkInTime: '14:00 PM', checkOutTime: '12:00 PM',
      acceptedPayments: ['VISA', 'bKash', 'Nagad'],
    },
    /* Sajek & Bandarban Hotels */
    {
      owner: owner1._id, name: 'Sajek Cloud Eco Resort',
      description: 'Breathtaking wooden cottages located high above the clouds on Sajek peak.', address: 'Ruilui Para, Sajek Valley', city: 'Chittagong',
      locationLat: 23.3820, locationLng: 92.2938,
      images: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800'],
      rating: 4.8, totalReviews: 310, isVerified: true, isRedMarked: false, isActive: true,
      amenities: ['Cloud View', 'Balcony', 'Restaurant', 'Solar Power'],
      checkInTime: '12:00 PM', checkOutTime: '10:30 AM',
      acceptedPayments: ['bKash', 'Nagad', 'Cash'],
    },
    {
      owner: owner2._id, name: 'Sarah Luxury Resort & Pool Villas',
      description: 'Exclusive private pool villas and water sports wonderland.', address: 'Rajabari, Sreepur', city: 'Dhaka',
      locationLat: 24.1850, locationLng: 90.4720,
      images: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800'],
      rating: 4.9, totalReviews: 470, isVerified: true, isRedMarked: false, isActive: true,
      amenities: ['Private Pool', 'WiFi', 'Boating', 'Spa', 'Restaurant'],
      checkInTime: '14:00 PM', checkOutTime: '12:00 PM',
      acceptedPayments: ['VISA', 'Mastercard', 'bKash'],
    },
  ]);
  const [hotel1, hotel2, hotel3, hotel4, hotel5, hotel6, hotel7, hotel8, hotel9, hotel10, hotel11, hotel12, hotel13] = hotels;
  console.log(`  ✓ ${hotels.length} hotels`);

  // ── Rooms ──
  const rooms = await Room.insertMany([
    { hotel: hotel1._id, type: 'Single Bed', pricePerNight: 900, totalInventory: 5, availableCount: 4, images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600'], amenities: ['AC','TV','WiFi'], floorNumber: 2, roomNumber: '201', capacity: '1 Adult', maxAdults: 2, maxChildren: 1, sizeSqFt: 250, viewType: 'City View' },
    { hotel: hotel1._id, type: 'Double Bed', pricePerNight: 1500, totalInventory: 8, availableCount: 3, images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600'], amenities: ['AC','TV','WiFi'], floorNumber: 3, roomNumber: '305', capacity: '2 Adults', maxAdults: 2, maxChildren: 1, sizeSqFt: 350, viewType: 'Pool View' },
    { hotel: hotel2._id, type: 'Single Bed', pricePerNight: 600, totalInventory: 10, availableCount: 7, images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600'], amenities: ['WiFi','TV'], floorNumber: 1, roomNumber: '101', capacity: '1 Adult', maxAdults: 2, maxChildren: 1, sizeSqFt: 200, viewType: 'Street View' },
    { hotel: hotel2._id, type: 'Double Bed', pricePerNight: 1000, totalInventory: 5, availableCount: 2, images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600'], amenities: ['WiFi','TV','AC'], floorNumber: 2, roomNumber: '201', capacity: '2 Adults, 1 Child', maxAdults: 3, maxChildren: 2, sizeSqFt: 300, viewType: 'City View' },
    { hotel: hotel3._id, type: 'Deluxe', pricePerNight: 2200, totalInventory: 3, availableCount: 1, images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600'], amenities: ['AC','TV','WiFi'], floorNumber: 5, roomNumber: '505', capacity: '2 Adults, 2 Children', maxAdults: 3, maxChildren: 2, sizeSqFt: 450, viewType: 'Lake View' },
    
    /* Rajshahi Rooms */
    { hotel: hotel4._id, type: 'Single Bed', pricePerNight: 800, totalInventory: 4, availableCount: 3, images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600'], amenities: ['AC','WiFi'], floorNumber: 1, roomNumber: '102', capacity: '1 Adult', maxAdults: 2, maxChildren: 0, sizeSqFt: 220, viewType: 'Garden View' },
    { hotel: hotel5._id, type: 'Double Bed', pricePerNight: 1200, totalInventory: 6, availableCount: 5, images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600'], amenities: ['WiFi'], floorNumber: 2, roomNumber: '202', capacity: '2 Adults', maxAdults: 2, maxChildren: 1, sizeSqFt: 280, viewType: 'Street View' },

    /* Panchagarh Rooms */
    { hotel: hotel6._id, type: 'Eco Suite', pricePerNight: 2500, totalInventory: 3, availableCount: 2, images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600'], amenities: ['Tea Maker','WiFi'], floorNumber: 1, roomNumber: '101', capacity: '2 Adults, 2 Children', maxAdults: 3, maxChildren: 2, sizeSqFt: 400, viewType: 'Tea Garden View' },
    { hotel: hotel7._id, type: 'Standard Double', pricePerNight: 1100, totalInventory: 5, availableCount: 5, images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600'], amenities: ['WiFi'], floorNumber: 1, roomNumber: '101', capacity: '2 Adults', maxAdults: 2, maxChildren: 1, sizeSqFt: 250, viewType: 'Street View' },

    /* Cox's Bazar Rooms */
    { hotel: hotel8._id, type: 'Ocean View Super Deluxe', pricePerNight: 4500, totalInventory: 6, availableCount: 5, images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600'], amenities: ['Ocean View','AC','WiFi','Balcony'], floorNumber: 4, roomNumber: '401', capacity: '2 Adults, 2 Children', maxAdults: 4, maxChildren: 2, sizeSqFt: 500, viewType: 'Sea View' },
    { hotel: hotel8._id, type: 'Executive Suite', pricePerNight: 8500, totalInventory: 3, availableCount: 2, images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600'], amenities: ['Jacuzzi','Ocean View','AC','Breakfast'], floorNumber: 6, roomNumber: '601', capacity: '2 Adults, 2 Children', maxAdults: 4, maxChildren: 2, sizeSqFt: 750, viewType: 'Panoramic Sea View' },
    { hotel: hotel9._id, type: 'Deluxe Sea Facing', pricePerNight: 3500, totalInventory: 8, availableCount: 6, images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600'], amenities: ['AC','WiFi','Balcony'], floorNumber: 3, roomNumber: '302', capacity: '2 Adults', maxAdults: 3, maxChildren: 1, sizeSqFt: 400, viewType: 'Partial Sea View' },

    /* Sylhet & Sreemangal Rooms */
    { hotel: hotel10._id, type: 'King Deluxe Tea Garden Suite', pricePerNight: 5500, totalInventory: 6, availableCount: 4, images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600'], amenities: ['Tea View Balcony', 'King Size Bed', 'Breakfast', 'WiFi', 'AC'], floorNumber: 2, roomNumber: '205', capacity: '2 Adults, 1 Child', maxAdults: 3, maxChildren: 2, sizeSqFt: 520, viewType: 'Emerald Tea Garden View' },
    { hotel: hotel10._id, type: 'Executive Golf & Forest Panorama Suite', pricePerNight: 9200, totalInventory: 4, availableCount: 3, images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600'], amenities: ['Jacuzzi Bath', 'Golf View', 'Breakfast', 'WiFi', 'Living Lounge'], floorNumber: 3, roomNumber: '312', capacity: '3 Adults, 2 Children', maxAdults: 4, maxChildren: 2, sizeSqFt: 780, viewType: '9-Hole Golf Course & Forest' },
    { hotel: hotel10._id, type: 'Royal Presidential Tea Valley Villa', pricePerNight: 16500, totalInventory: 2, availableCount: 2, images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600'], amenities: ['Private Veranda', '2 Master Beds', 'All Meals', 'Helipad Access', 'Golf Buggy'], floorNumber: 1, roomNumber: 'V-01', capacity: '4 Adults, 2 Children', maxAdults: 5, maxChildren: 3, sizeSqFt: 1450, viewType: '360° Tea Garden & Pool Panorama' },
    { hotel: hotel11._id, type: 'Premium Executive', pricePerNight: 3200, totalInventory: 7, availableCount: 5, images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600'], amenities: ['AC','WiFi','Gym Access'], floorNumber: 5, roomNumber: '502', capacity: '2 Adults', maxAdults: 3, maxChildren: 1, sizeSqFt: 380, viewType: 'City View' },

    /* Sajek & Villa Rooms */
    { hotel: hotel12._id, type: 'Cloud Valley Wooden Cottage', pricePerNight: 3200, totalInventory: 4, availableCount: 3, images: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600'], amenities: ['Cloud Balcony','Solar Power','Private Deck'], floorNumber: 1, roomNumber: 'C-01', capacity: '2 Adults, 2 Children', maxAdults: 4, maxChildren: 2, sizeSqFt: 360, viewType: 'Cloud & Valley View' },
    { hotel: hotel13._id, type: 'Private Pool Villa Suite', pricePerNight: 9500, totalInventory: 3, availableCount: 2, images: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600'], amenities: ['Private Pool','BBQ Setup','Kitchenette','WiFi'], floorNumber: 1, roomNumber: 'V-01', capacity: '4 Adults, 2 Children', maxAdults: 6, maxChildren: 4, sizeSqFt: 1200, viewType: 'Private Garden & Pool' },
  ]);
  const [room1, room2, room3, room4, room5, room6, room7, room8, room9] = rooms;
  console.log(`  ✓ ${rooms.length} rooms`);

  // ── Bookings ──
  const bookings = await Booking.insertMany([
    { user: user1._id, hotel: hotel1._id, room: room2._id, roomType: 'Double Bed', roomNumber: '305', hotelName: 'The Grand Palace Hotel', type: 'ONLINE', status: 'CONFIRMED', checkIn: '2026-03-15', checkOut: '2026-03-17', nights: 2, totalPrice: 3000, paymentMethod: 'bkash' },
    { user: user2._id, hotel: hotel1._id, room: room1._id, roomType: 'Single Bed', roomNumber: '201', hotelName: 'The Grand Palace Hotel', type: 'ONLINE', status: 'CANCELLED', checkIn: '2026-03-15', checkOut: '2026-03-17', nights: 2, totalPrice: 1800, paymentMethod: 'card' },
    { user: user1._id, hotel: hotel3._id, room: room5._id, roomType: 'Deluxe', roomNumber: '505', hotelName: 'Sky View Banani', type: 'ONLINE', status: 'CONFIRMED', checkIn: '2026-03-18', checkOut: '2026-03-19', nights: 1, totalPrice: 2200, paymentMethod: 'bkash' },
  ]);
  console.log(`  ✓ ${bookings.length} bookings`);

  // ── Reviews ──
  const reviews = await Review.insertMany([
    { user: user1._id, userName: 'Rahim Khan', hotel: hotel1._id, rating: 5, comment: 'Outstanding service and premium rooms!', type: 'REVIEW' },
    { user: user2._id, userName: 'Sumaiya Akter', hotel: hotel2._id, rating: 2, comment: 'AC was not working and room was small.', type: 'COMPLAINT' },
    { user: user1._id, userName: 'Rahim Khan', hotel: hotel3._id, rating: 1, comment: 'Fraudulent pricing. Charged extra for water.', type: 'COMPLAINT' },
  ]);
  console.log(`  ✓ ${reviews.length} reviews`);

  // ── Offers ──
  const offers = await Offer.insertMany([
    { hotel: hotel1._id, hotelName: 'The Grand Palace Hotel', title: 'EID FESTIVAL DEAL', discountPercent: 25, imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=200', isActive: true },
  ]);
  console.log(`  ✓ ${offers.length} offers`);

  // ── Notifications ──
  const notifs = await Notification.insertMany([
    { recipientId: admin._id.toString(), type: 'BOOKING', title: 'New Global Reservation', message: 'User Rahim Khan booked Double Bed at The Grand Palace Hotel.', isRead: false },
    { recipientId: admin._id.toString(), type: 'COMPLAINT', title: 'Crisis: High Severity Complaint', message: 'Sumaiya Akter reported a critical issue at Budget Stay Mirpur.', isRead: false },
    { recipientId: admin._id.toString(), type: 'PAYMENT', title: 'Yield Transmission Successful', message: '৳3,000 received for Booking.', isRead: true },
  ]);
  console.log(`  ✓ ${notifs.length} notifications`);

  // ── Housekeeping Tasks ──
  const hkTasks = await HousekeepingTask.insertMany([
    { hotel: hotel1._id, room: room1._id, roomType: 'Single Bed', floorNumber: 2, status: 'AVAILABLE' },
    { hotel: hotel1._id, room: room2._id, roomType: 'Double Bed', floorNumber: 3, status: 'CLEANING' },
    { hotel: hotel3._id, room: room5._id, roomType: 'Deluxe', floorNumber: 5, status: 'AVAILABLE' },
  ]);
  console.log(`  ✓ ${hkTasks.length} housekeeping tasks`);

  // ── Hotel Services ──
  const services = await HotelService.insertMany([
    { hotel: hotel1._id, name: 'In-Room Dining (Full Menu)', description: 'Order from our full chef-curated menu delivered to your room, available 24/7.', category: 'Food', price: 0, currency: 'BDT', icon: '🍽️', isAvailable: true },
    { hotel: hotel1._id, name: 'Breakfast in Bed', description: 'Luxurious continental breakfast delivered fresh to your room every morning.', category: 'Food', price: 350, currency: 'BDT', icon: '🍳', isAvailable: true },
    { hotel: hotel1._id, name: 'Full Body Spa Massage (60 min)', description: 'Rejuvenating full body massage by certified aromatherapy therapists.', category: 'Spa', price: 1800, currency: 'BDT', icon: '💆', isAvailable: true },
    { hotel: hotel1._id, name: 'Couples Spa Package', description: 'Romantic spa experience for two — hot stone, aromatherapy & champagne.', category: 'Spa', price: 3200, currency: 'BDT', icon: '🧘', isAvailable: true },
    { hotel: hotel1._id, name: 'Gym Access (Day Pass)', description: 'Full access to our premium fitness center with modern equipment.', category: 'Gym', price: 0, currency: 'BDT', icon: '🏋️', isAvailable: true },
    { hotel: hotel1._id, name: 'Airport Pickup', description: 'Luxury car pickup from Hazrat Shahjalal International Airport.', category: 'Transport', price: 800, currency: 'BDT', icon: '✈️', isAvailable: true },
    { hotel: hotel1._id, name: 'Airport Drop', description: 'Comfortable car drop-off from hotel to your departure terminal.', category: 'Transport', price: 800, currency: 'BDT', icon: '🚗', isAvailable: true },
    { hotel: hotel2._id, name: 'Room Service', description: 'Basic food & beverage delivery to your room.', category: 'Food', price: 0, currency: 'BDT', icon: '🍽️', isAvailable: true },
    { hotel: hotel2._id, name: 'Airport Pickup', description: 'AC car pickup from airport to hotel.', category: 'Transport', price: 600, currency: 'BDT', icon: '✈️', isAvailable: true },
    { hotel: hotel3._id, name: 'In-Room Dining', description: 'Modern menu with Bangladeshi & continental options delivered hot.', category: 'Food', price: 0, currency: 'BDT', icon: '🍽️', isAvailable: true },
    { hotel: hotel3._id, name: 'Rooftop Spa Treatment', description: 'Exclusive rooftop spa with city skyline views — massage & facial combo.', category: 'Spa', price: 2500, currency: 'BDT', icon: '💆', isAvailable: true },
    { hotel: hotel3._id, name: 'Airport Pickup', description: 'Premium sedan pickup from airport.', category: 'Transport', price: 900, currency: 'BDT', icon: '✈️', isAvailable: true },
  ]);
  console.log(`  ✓ ${services.length} hotel services`);

  // ── Experiences ──
  const experiences = await Experience.insertMany([
    {
      owner: owner1._id, hotel: hotel1._id, hotelName: 'The Grand Palace Hotel',
      title: 'Sylhet Misty Tea Estate Walk & Master Tasting',
      description: 'Walk through rolling emerald tea gardens at dawn in Sreemangal. Pluck fresh two-leaves-and-a-bud with local tea pluckers, visit a century-old processing plant, and experience a guided tasting of 7 distinct single-estate flushes including rare white tea.',
      city: 'Sylhet', location: 'Sreemangal, Sylhet', meetingPoint: 'Grand Sultan Tea Resort Main Gate, Sreemangal',
      price: 1850, rating: 4.97, reviews: 142,
      image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1200&auto=format&fit=crop&q=80',
      images: [
        'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80'
      ],
      badge: 'StayBD Original', category: 'original', tags: ['Cultural', 'Nature', 'Food & Drink'],
      highlights: ['Small group (max 8)', 'Taste 7 distinct single-estate flushes', 'Hands-on tea plucking experience', 'Fresh homemade bakarkhani & snacks'],
      duration: '3.5 hours', maxGuests: 8, spokenLanguages: ['English', 'Bangla', 'Sylheti'],
      amenities: ['Tea & Snacks', 'First Aid', 'WiFi', 'Bottled Water'],
      services: ['Tea Tasting Kit', 'Estate Walk Guide', 'Bamboo Sun Hat'],
      whatIncludes: ['Tea plantation entry permits', '7-course tea master tasting', 'Fresh Sylheti snacks & sweets', 'Souvenir tin of handpicked tea'],
      whatToBring: ['Comfortable walking shoes', 'Sun hat / Umbrella', 'Camera'],
      whatNotIncluded: ['Hotel transfer to Sreemangal', 'Personal shopping'],
      hostName: 'Tanvir Hasan', hostImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
      hostBio: '3rd-generation Sylheti tea planter and certified international tea sommelier with 12+ years sharing Bangladeshi agro-heritage.',
      cancellationPolicy: 'Free cancellation up to 24 hours before start.', ageRequirement: 'All ages welcome',
      isActive: true,
    },
    {
      owner: owner1._id, hotel: hotel1._id, hotelName: 'The Grand Palace Hotel',
      title: 'Sundarbans Silent Mangrove Boat Safari & Wildlife Trail',
      description: 'Embark on an eco-friendly silent wooden boat expedition through the narrow tidal canals of the world’s largest mangrove forest. Spot spotted deer, estuarine crocodiles, kingfishers, and rare Irrawaddy dolphins led by a licensed forest ranger.',
      city: 'Khulna', location: 'Sundarbans Mangrove, Khulna', meetingPoint: 'Mongla Port Ghat #2, Bagerhat',
      price: 3600, rating: 4.98, reviews: 218,
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&auto=format&fit=crop&q=80',
      images: [
        'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=1200&auto=format&fit=crop&q=80'
      ],
      badge: 'Bestseller', category: 'original', tags: ['Adventure', 'Nature', 'Outdoor'],
      highlights: ['Licensed armed forest guard escort', 'Silent wooden boat in canal networks', 'Hot organic fish/veg lunch on board', 'Dolphin & deer spotting guarantee'],
      duration: '6 hours', maxGuests: 10, spokenLanguages: ['English', 'Bangla'],
      amenities: ['Life jackets', 'First Aid', 'Tea & Snacks', 'Binoculars'],
      services: ['Forest Entry Clearance', 'Eco-Boat Cruise', 'Hot Lunch'],
      whatIncludes: ['Official Sundarbans Forest Department permits', 'Traditional wooden engine boat & fuel', 'Fresh local lunch & tender coconut', 'Wildlife binoculars'],
      whatToBring: ['Sunscreen & insect repellent', 'Water bottle', 'Binoculars or zoom camera'],
      whatNotIncluded: ['Video camera professional tax if applicable'],
      hostName: 'Captain Mizanur Rahman', hostImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
      hostBio: 'Born and raised on the fringes of the Sundarbans; 18 years guiding international wildlife researchers and eco-travelers.',
      cancellationPolicy: 'Free cancellation up to 48 hours before.', ageRequirement: '8+ years recommended',
      isActive: true,
    },
    {
      owner: owner2._id, hotel: hotel2._id, hotelName: 'Budget Stay Mirpur',
      title: 'Old Dhaka Midnight Kacchi & Secret Heritage Food Trail',
      description: 'Immerse your senses in 400-year-old Mughal culinary traditions. Wander through the atmospheric historic alleys of Nazira Bazar and Shankhari Bazar, sampling legendary slow-cooked Dum Kacchi Biryani, fiery Bakarkhani, Morog Polao, Beauty Lassi, and Labang.',
      city: 'Dhaka', location: 'Puran Dhaka, Dhaka', meetingPoint: 'Ahsan Manzil (Pink Palace) Front Gate, Sadarghat',
      price: 1500, rating: 4.96, reviews: 340,
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1200&auto=format&fit=crop&q=80',
      images: [
        'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80'
      ],
      badge: 'Foodie Choice', category: 'original', tags: ['Food & Drink', 'Cultural', 'Outdoor'],
      highlights: ['7 authentic heritage food tastings', 'Secret alleyways & historic stories', 'Rickshaw ride through Old Dhaka included', 'Vegetarian adaptations available'],
      duration: '3 hours', maxGuests: 6, spokenLanguages: ['English', 'Bangla', 'Dhakaiya Urdu'],
      amenities: ['Tea & Snacks', 'First Aid', 'Bottled Water'],
      services: ['Rickshaw Fare', 'Food & Drink Tastings', 'Heritage Historian Guide'],
      whatIncludes: ['All food & drinks across 7 curated culinary stops', 'Traditional cycle rickshaw rides', 'Filtered water and hygiene wipes', 'Old Dhaka spice gift pouch'],
      whatToBring: ['An empty stomach', 'Modest clothing for heritage alleys', 'Comfortable footwear'],
      whatNotIncluded: ['Personal shopping (perfumes, brassware)'],
      hostName: 'Sultana & Farhan', hostImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300',
      hostBio: 'Old Dhaka native culinary storytellers featured on BBC Travel and National Geographic food documentaries.',
      cancellationPolicy: 'Free cancellation up to 12 hours before.', ageRequirement: '10+ years',
      isActive: true,
    },
    {
      owner: owner1._id, hotel: hotel3._id, hotelName: 'Sky View Banani',
      title: 'Cox’s Bazar Golden Sunset Surfing & Marine Drive Secret Beach',
      description: 'Learn to catch the waves of the world’s longest natural sea beach with certified ISA instructors at Inani. Followed by a scenic open-jeep drive along the majestic Marine Drive cliffside to a hidden bay for tender coconut & beachside bonfire.',
      city: 'Cox\'s Bazar', location: 'Inani Beach & Marine Drive, Cox\'s Bazar', meetingPoint: 'Inani Royal Tulip Beach Access, Cox\'s Bazar',
      price: 2800, rating: 4.94, reviews: 185,
      image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=1200&auto=format&fit=crop&q=80',
      images: [
        'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80'
      ],
      badge: 'Popular', category: 'original', tags: ['Adventure', 'Outdoor', 'Wellness'],
      highlights: ['All surfboard & safety equipment included', 'GoPro 4K action photos & videos included', 'Open jeep ride down Marine Drive', 'Beginners welcome — 100% standing guarantee'],
      duration: '4 hours', maxGuests: 6, spokenLanguages: ['English', 'Bangla'],
      amenities: ['Life jackets', 'First Aid', 'Tea & Snacks', 'Shower', 'Locker'],
      services: ['Surfboard Rental', 'Rashguard Gear', 'Open Jeep Safari'],
      whatIncludes: ['Surfboard & protective wetsuit/rashguard', '1-on-1 coaching by certified surf lifesaver', 'GoPro HD photos & video edits', 'Fresh beach coconuts and refreshments'],
      whatToBring: ['Swimwear', 'Towel', 'Sunscreen'],
      whatNotIncluded: ['Personal surf purchases'],
      hostName: 'Jafar Surf Academy', hostImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
      hostBio: 'Bangladesh’s pioneer surf champion who represented the nation in international championships, passionate about ocean safety.',
      cancellationPolicy: 'Free cancellation up to 24 hours before.', ageRequirement: '12+ years',
      isActive: true,
    },
    {
      owner: owner1._id, hotel: hotel1._id, hotelName: 'The Grand Palace Hotel',
      title: 'Sajek Valley Cloud Peak Trek & Indigenous Bamboo Feast',
      description: 'Wake up above the clouds in the majestic hills of Sajek. Hike to the highest vantage point of Konglak Pahar, experience traditional Chakma and Lusai tribal village hospitality, and learn how to cook slow-roasted chicken inside natural green bamboo over wood coals.',
      city: 'Rangamati', location: 'Sajek Valley, Rangamati', meetingPoint: 'Ruilui Para Helipad, Sajek Valley',
      price: 2400, rating: 4.96, reviews: 172,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&fit=crop&q=80',
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1511497584788-87676104235f?w=1200&auto=format&fit=crop&q=80'
      ],
      badge: 'StayBD Original', category: 'original', tags: ['Nature', 'Adventure', 'Cultural'],
      highlights: ['Spectacular Konglak Peak sunrise above clouds', 'Authentic tribal bamboo cooking workshop', 'Traditional Lusai welcome ceremony', 'Small intimate group (max 8)'],
      duration: '5 hours', maxGuests: 8, spokenLanguages: ['English', 'Bangla', 'Chakma'],
      amenities: ['Tea & Snacks', 'First Aid', 'Bottled Water'],
      services: ['Local Guide Escort', 'Traditional Lunch', 'Trekking Poles'],
      whatIncludes: ['Konglak hill entry permit', 'Indigenous bamboo chicken feast & organic sticky rice', 'Local tribal guide & storyteller', 'Herbal highland tea'],
      whatToBring: ['Sturdy hiking shoes', 'Light windbreaker jacket for breezy morning', 'Camera'],
      whatNotIncluded: ['Chander Gari jeep transfer from Dighinala'],
      hostName: 'Chanchal Chakma', hostImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
      hostBio: 'Indigenous community leader and eco-tourism pioneer dedicated to preserving indigenous culture and pristine Himalayan-foothill landscapes.',
      cancellationPolicy: 'Free cancellation up to 48 hours before.', ageRequirement: 'All fitness levels capable of light uphill walking',
      isActive: true,
    },
    {
      owner: owner2._id, hotel: hotel2._id, hotelName: 'Budget Stay Mirpur',
      title: 'UNESCO Living Heritage: Rickshaw Art & Folk Painting Studio',
      description: 'Celebrate Bangladesh’s newly recognized UNESCO Intangible Cultural Heritage! Step into an authentic artisan studio in Dhaka and learn the vibrant techniques of Rickshaw painting from a 40-year master craftsman. Create and paint your own personalized metal rickshaw plate to bring home.',
      city: 'Dhaka', location: 'Mirpur Artists Enclave, Dhaka', meetingPoint: 'Mirpur 10 Circle Metro Station Exit A',
      price: 1350, rating: 4.92, reviews: 104,
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1200&auto=format&fit=crop&q=80',
      images: [
        'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1460661419200-fd435f017d8d?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&auto=format&fit=crop&q=80'
      ],
      badge: 'Craft & Art', category: 'original', tags: ['Art', 'Cultural', 'Wellness'],
      highlights: ['Take home your own painted metallic rickshaw art plaque', 'Hands-on instruction from a legendary Ustad', 'All paints, brushes & metal plates included', 'Traditional masala chai & sweet samosas served'],
      duration: '2.5 hours', maxGuests: 6, spokenLanguages: ['English', 'Bangla'],
      amenities: ['Tea & Snacks', 'WiFi', 'Changing Room', 'Locker'],
      services: ['Art Materials Kit', 'Painting Apron', 'Souvenir Packaging'],
      whatIncludes: ['Custom hand-cut metal sheet for painting', 'Vibrant oil & enamel paints', 'Protective apron and packaging for travel', 'Chai & sweets'],
      whatToBring: ['Clothes you don’t mind getting a tiny paint speck on'],
      whatNotIncluded: ['Large decorative full-rickshaw commissions'],
      hostName: 'Ustad Rafiqul Islam', hostImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300',
      hostBio: 'Master Rickshaw painter who has decorated over 2,000 cycle rickshaws and exhibited in the Victoria and Albert Museum in London.',
      cancellationPolicy: 'Free cancellation up to 24 hours before.', ageRequirement: 'Suitable for adults and children 8+',
      isActive: true,
    },
  ]);
  console.log(`  ✓ ${experiences.length} experiences`);

  // ── Experience Reviews ──
  const expReviews = await ExperienceReview.insertMany([
    { experience: experiences[0]._id, user: user1._id, userName: 'Rahim Khan', rating: 5, comment: 'Life-changing yoga session!' },
    { experience: experiences[1]._id, user: user2._id, userName: 'Sumaiya Akter', rating: 4, comment: 'Great tea selection!' },
  ]);
  console.log(`  ✓ ${expReviews.length} experience reviews`);

  console.log('\n✅ Database seeded successfully!\n');

  // Print IDs for reference
  console.log('📋 Reference IDs:');
  console.log(`  Admin:   ${admin._id}`);
  console.log(`  User 1:  ${user1._id}`);
  console.log(`  User 2:  ${user2._id}`);
  console.log(`  Owner 1: ${owner1._id}`);
  console.log(`  Owner 2: ${owner2._id}`);
  console.log(`  Hotel 1: ${hotel1._id}`);
  console.log(`  Hotel 2: ${hotel2._id}`);
  console.log(`  Hotel 3: ${hotel3._id}`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});
