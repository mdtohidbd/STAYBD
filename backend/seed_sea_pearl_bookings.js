const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const Booking = require('./models/Booking');
const Room = require('./models/Room');
const Hotel = require('./models/Hotel');
const HousekeepingTask = require('./models/HousekeepingTask');
const WalletTransaction = require('./models/WalletTransaction');

async function seedSeaPearlData() {
  await connectDB();
  console.log('Seeding operational bookings and activity for Sea Pearl...');

  const hotels = await Hotel.find({ name: /Sea Pearl/i });
  if (hotels.length === 0) {
    console.log('No Sea Pearl hotels found!');
    process.exit(1);
  }

  for (const hotel of hotels) {
    let room = await Room.findOne({ hotel: hotel._id });
    if (!room) {
      room = await Room.create({
        hotel: hotel._id,
        type: 'Executive Deluxe Ocean Suite',
        category: 'Executive Suite',
        pricePerNight: 4500,
        discountPrice: 4050,
        totalInventory: 8,
        availableCount: 6,
        images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80'],
        amenities: ['Air Conditioning', 'Free Wi-Fi', 'King Bed', 'Attached Bath', 'Private Balcony'],
        floorNumber: 3,
        maxAdults: 2,
        maxChildren: 1,
        petsAllowed: false
      });
    }

    const hotelId = hotel._id;
    const roomId = room._id;
    const roomType = room.type;

    // Clear existing bookings for this hotel
    await Booking.deleteMany({ hotel: hotelId });
    await HousekeepingTask.deleteMany({ hotel: hotelId });
    await WalletTransaction.deleteMany({ hotel: hotelId });

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
  const pastDate = new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0];

  const bookings = await Booking.insertMany([
    {
      hotel: hotelId,
      room: roomId,
      roomType: roomType,
      roomNumber: '301',
      hotelName: hotel.name,
      type: 'ONLINE',
      status: 'CONFIRMED',
      checkIn: todayStr,
      checkOut: tomorrow,
      nights: 1,
      totalPrice: 4500,
      paymentMethod: 'bkash',
      paymentPhone: '+880 1711-223344',
      transactionId: 'TRX-BK9827361',
      guestName: 'Tareq Mahmud',
      guestEmail: 'tareq.mahmud@gmail.com',
      guestPhone: '+880 1711-223344',
      specialRequests: 'High floor, ocean sunset view please',
      arrivalTime: '14:00 PM',
      travelingForWork: false,
      country: 'Bangladesh',
      createdAt: new Date(),
    },
    {
      hotel: hotelId,
      room: roomId,
      roomType: roomType,
      roomNumber: '302',
      hotelName: hotel.name,
      type: 'ONLINE',
      status: 'CONFIRMED',
      checkIn: todayStr,
      checkOut: nextWeek,
      nights: 3,
      totalPrice: 13500,
      paymentMethod: 'card',
      paymentPhone: '+880 1819-334455',
      transactionId: 'VISA-90823412',
      guestName: 'Farhana Yasmin',
      guestEmail: 'farhana.y@corporate.bd',
      guestPhone: '+880 1819-334455',
      specialRequests: 'Need extra pillows and quiet room',
      arrivalTime: '15:30 PM',
      travelingForWork: true,
      country: 'Bangladesh',
      createdAt: new Date(),
    },
    {
      hotel: hotelId,
      room: roomId,
      roomType: roomType,
      roomNumber: '305',
      hotelName: hotel.name,
      type: 'OFFLINE',
      status: 'CONFIRMED',
      checkIn: todayStr,
      checkOut: tomorrow,
      nights: 2,
      totalPrice: 9000,
      paymentMethod: 'cash',
      guestName: 'Kamal Hossain (Walk-in)',
      guestEmail: 'kamal.hossain@dhaka.com',
      guestPhone: '+880 1912-778899',
      specialRequests: 'Airport shuttle arrangement',
      arrivalTime: '12:15 PM',
      travelingForWork: false,
      country: 'Bangladesh',
      createdAt: new Date(),
    },
    {
      hotel: hotelId,
      room: roomId,
      roomType: roomType,
      roomNumber: '308',
      hotelName: hotel.name,
      type: 'OFFLINE',
      status: 'CONFIRMED',
      checkIn: pastDate,
      checkOut: tomorrow,
      nights: 4,
      totalPrice: 18000,
      paymentMethod: 'nagad',
      paymentPhone: '+880 1610-998877',
      transactionId: 'NAG-776219',
      guestName: 'Engr. Saifullah',
      guestEmail: 'saifullah.engr@outlook.com',
      guestPhone: '+880 1610-998877',
      arrivalTime: '16:00 PM',
      travelingForWork: true,
      country: 'Bangladesh',
      createdAt: new Date(Date.now() - 2 * 86400000),
    },
    {
      hotel: hotelId,
      room: roomId,
      roomType: roomType,
      roomNumber: '310',
      hotelName: hotel.name,
      type: 'ONLINE',
      status: 'PENDING',
      checkIn: tomorrow,
      checkOut: nextWeek,
      nights: 2,
      totalPrice: 9000,
      paymentMethod: 'bkash',
      paymentPhone: '+880 1755-443322',
      transactionId: 'PENDING-TX44',
      guestName: 'Nusrat Jahan',
      guestEmail: 'nusrat.jahan@gmail.com',
      guestPhone: '+880 1755-443322',
      arrivalTime: '13:00 PM',
      travelingForWork: false,
      country: 'Bangladesh',
      createdAt: new Date(),
    }
  ]);

  console.log(`✓ Inserted ${bookings.length} live bookings for Sea Pearl`);

  const hkTasks = await HousekeepingTask.insertMany([
    { hotel: hotelId, room: roomId, roomNumber: '301', roomType: roomType, floorNumber: 3, status: 'AVAILABLE', assignedTo: 'Rahim Cleaning Crew' },
    { hotel: hotelId, room: roomId, roomNumber: '302', roomType: roomType, floorNumber: 3, status: 'CLEANING', assignedTo: 'Shift A - Fatima' },
    { hotel: hotelId, room: roomId, roomNumber: '303', roomType: roomType, floorNumber: 3, status: 'OCCUPIED', assignedTo: 'Floor Team 3' },
    { hotel: hotelId, room: roomId, roomNumber: '304', roomType: roomType, floorNumber: 3, status: 'AVAILABLE', assignedTo: 'Rahim Cleaning Crew' },
    { hotel: hotelId, room: roomId, roomNumber: '305', roomType: roomType, floorNumber: 3, status: 'CLEANING', assignedTo: 'Shift B - Karim' },
    { hotel: hotelId, room: roomId, roomNumber: '306', roomType: roomType, floorNumber: 3, status: 'MAINTENANCE', assignedTo: 'Floor Team 3' },
  ]);
  console.log(`✓ Inserted ${hkTasks.length} housekeeping tasks`);

  const walletTxs = await WalletTransaction.insertMany([
    {
      hotel: hotelId,
      type: 'CREDIT',
      amount: 4500,
      description: 'Online Booking Payout: TRX-BK9827361 (Tareq Mahmud)',
      booking: bookings[0]._id,
      createdAt: new Date(),
    },
    {
      hotel: hotelId,
      type: 'CREDIT',
      amount: 13500,
      description: 'Online Booking Payout: VISA-90823412 (Farhana Yasmin)',
      booking: bookings[1]._id,
      createdAt: new Date(),
    },
    {
      hotel: hotelId,
      type: 'CREDIT',
      amount: 18000,
      description: 'Direct Booking Settlement: NAG-776219 (Engr. Saifullah)',
      booking: bookings[3]._id,
      createdAt: new Date(Date.now() - 2 * 86400000),
    },
    {
      hotel: hotelId,
      type: 'CREDIT',
      amount: 9000,
      description: 'Front Desk Walk-in Settlement: Kamal Hossain',
      booking: bookings[2]._id,
      createdAt: new Date(),
    }
  ]);
  console.log(`✓ Inserted ${walletTxs.length} wallet transactions for hotel ${hotel.name} (${hotelId})`);
  }

  process.exit(0);
}

seedSeaPearlData().catch(err => {
  console.error('Error seeding Sea Pearl data:', err);
  process.exit(1);
});
