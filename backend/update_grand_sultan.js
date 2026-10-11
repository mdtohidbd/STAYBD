// Update Grand Sultan Tea Resort & Golf with rich luxury data
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const hotelSchema = new mongoose.Schema({}, { strict: false });
const roomSchema = new mongoose.Schema({}, { strict: false });

const Hotel = mongoose.models.Hotel || mongoose.model('Hotel', hotelSchema);
const Room = mongoose.models.Room || mongoose.model('Room', roomSchema);

async function updateGrandSultan() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/staybuddy');
    console.log('Connected to MongoDB');

    const grandSultan = await Hotel.findOne({ name: /Grand Sultan/i });
    if (!grandSultan) {
      console.log('Grand Sultan hotel not found in database!');
      process.exit(1);
    }

    console.log('Found Grand Sultan ID:', grandSultan._id);

    // Update Hotel Information
    grandSultan.name = 'Grand Sultan Tea Resort & Golf';
    grandSultan.city = 'Sylhet';
    grandSultan.address = 'Radhanagar, Sreemangal, Moulvibazar (Near Lawachara National Park)';
    grandSultan.description = 'Grand Sultan Tea Resort & Golf is Bangladesh\'s premier 5-star eco-luxury sanctuary nestled among the rolling emerald tea gardens of Sreemangal. Spanning over 13 acres of verdant landscapes, the resort features a world-class 9-hole golf course, three temperature-controlled outdoor swimming pools, an Ayurvedic wellness spa, and three signature dining restaurants serving authentic Sylheti, Bengali, and global cuisines. Designed with royal timber architecture and expansive private balconies, each residence offers tranquil panoramic vistas of misty tea estates and tropical forests.';
    grandSultan.images = [
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80'
    ];
    grandSultan.rating = 4.9;
    grandSultan.totalReviews = 420;
    grandSultan.isVerified = true;
    grandSultan.amenities = [
      'Free High-Speed Wi-Fi',
      '3 Swimming Pools',
      '9-Hole Golf Course',
      'Ayurvedic Spa & Wellness',
      'Rolling Tea Garden Vistas',
      '3 Signature Restaurants',
      'Complimentary Buffet Breakfast',
      'Fitness Center & Gym',
      'Valet & Free Private Parking',
      '24/7 Concierge Service',
      'Private Helipad Access',
      'Lawachara Forest Tours'
    ];
    grandSultan.checkInTime = '14:00 PM';
    grandSultan.checkOutTime = '12:00 PM';
    grandSultan.locationLat = 24.3065;
    grandSultan.locationLng = 91.7296;

    await Hotel.updateOne(
      { _id: grandSultan._id },
      {
        $set: {
          name: grandSultan.name,
          city: grandSultan.city,
          address: grandSultan.address,
          description: grandSultan.description,
          images: grandSultan.images,
          rating: grandSultan.rating,
          totalReviews: grandSultan.totalReviews,
          isVerified: true,
          amenities: grandSultan.amenities,
          checkInTime: grandSultan.checkInTime,
          checkOutTime: grandSultan.checkOutTime,
          locationLat: 24.3065,
          locationLng: 91.7296
        }
      }
    );
    console.log('✓ Hotel details updated via updateOne successfully');

    // Remove old rooms for this hotel
    await Room.deleteMany({ hotel: grandSultan._id });
    console.log('Removed old rooms for Grand Sultan');

    // Insert 3 Luxury Room Tiers
    const newRooms = [
      {
        hotel: grandSultan._id,
        type: 'King Deluxe Tea Garden Suite',
        category: 'Deluxe Room',
        pricePerNight: 7000,
        discountPrice: 5500,
        totalInventory: 6,
        availableCount: 4,
        images: [
          'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
        ],
        amenities: [
          'Tea View Balcony',
          'King Size Bed',
          'Free Buffet Breakfast',
          'High-Speed Wi-Fi',
          'Air Conditioning',
          'Rain Shower & Bathrobe',
          'Complimentary Green Tea Bar',
          'Work Desk'
        ],
        beds: { 'King Bed': 1 },
        floorNumber: 2,
        roomNumber: '205',
        capacity: '2 Adults, 1 Child',
        maxAdults: 3,
        maxChildren: 2,
        sizeSqFt: 520,
        viewType: 'Emerald Tea Garden View',
        description: 'Elegantly appointed luxury room with high timber ceilings, private tea-valley viewing balcony, premium plush king mattress, and complimentary seven-layer tea service.',
        petsAllowed: false
      },
      {
        hotel: grandSultan._id,
        type: 'Executive Golf & Forest Panorama Suite',
        category: 'Executive Suite',
        pricePerNight: 12000,
        discountPrice: 9200,
        totalInventory: 4,
        availableCount: 3,
        images: [
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
        ],
        amenities: [
          'Deep Soaking Jacuzzi Bath',
          'Golf & Forest Panorama',
          'Separate Living Lounge',
          'Free Buffet Breakfast',
          'High-Speed Wi-Fi',
          'Minibar & Espresso Machine',
          '24/7 Room Service',
          'Express Check-In'
        ],
        beds: { 'King Bed': 1, 'Sofa Bed': 1 },
        floorNumber: 3,
        roomNumber: '312',
        capacity: '3 Adults, 2 Children',
        maxAdults: 4,
        maxChildren: 2,
        sizeSqFt: 780,
        viewType: '9-Hole Golf Course & Forest',
        description: 'Expansive corner suite featuring a dedicated parlor, marble ensuite bathroom with deep jacuzzi soaking tub, and floor-to-ceiling windows overlooking the 9-hole golf greens.',
        petsAllowed: false
      },
      {
        hotel: grandSultan._id,
        type: 'Royal Presidential Tea Valley Villa',
        category: 'Presidential Villa',
        pricePerNight: 21000,
        discountPrice: 16500,
        totalInventory: 2,
        availableCount: 2,
        images: [
          'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80'
        ],
        amenities: [
          'Private Garden Veranda',
          '2 Master Bedrooms',
          'Private Dining Lounge',
          'Jacuzzi Spa Bath',
          'All Meals Included',
          'Dedicated Golf Buggy',
          'Private Helipad Pick-up',
          'VIP Concierge'
        ],
        beds: { 'King Bed': 2 },
        floorNumber: 1,
        roomNumber: 'V-01',
        capacity: '4 Adults, 2 Children',
        maxAdults: 5,
        maxChildren: 3,
        sizeSqFt: 1450,
        viewType: '360° Tea Garden & Pool Panorama',
        description: 'The pinnacle of luxury in Bangladesh. A standalone two-bedroom royal villa nestled in an exclusive grove with private garden veranda, personal golf buggy, butler on call, and all gourmet meals included.',
        petsAllowed: false
      }
    ];

    await Room.insertMany(newRooms);
    console.log('✓ Successfully created 3 luxury room tiers for Grand Sultan');

    await mongoose.disconnect();
    console.log('Done!');
  } catch (err) {
    console.error('Update error:', err);
    process.exit(1);
  }
}

updateGrandSultan();
