const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const Hotel = require('./models/Hotel');
const Experience = require('./models/Experience');
const ExperienceReview = require('./models/ExperienceReview');

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/staybuddy';

const authenticExperiences = [
  {
    title: 'Sylhet Misty Tea Estate Walk & Master Tasting',
    description: 'Walk through rolling emerald tea gardens at dawn in Sreemangal. Pluck fresh two-leaves-and-a-bud with local tea pluckers, visit a century-old processing plant, and experience a guided tasting of 7 distinct single-estate flushes including rare white tea.',
    city: 'Sylhet',
    location: 'Sreemangal, Sylhet',
    meetingPoint: 'Grand Sultan Tea Resort Main Gate, Sreemangal',
    price: 1850,
    rating: 4.97,
    reviews: 142,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=1200&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1597916829826-02e5bb4a54e0?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&auto=format&fit=crop&q=80'
    ],
    badge: 'StayBD Original',
    category: 'original',
    tags: ['Cultural', 'Nature', 'Food & Drink'],
    highlights: ['Small group (max 8)', 'Taste 7 distinct single-estate flushes', 'Hands-on tea plucking experience', 'Fresh homemade bakarkhani & snacks'],
    duration: '3.5 hours',
    maxGuests: 8,
    spokenLanguages: ['English', 'Bangla', 'Sylheti'],
    amenities: ['Tea & Snacks', 'First Aid', 'WiFi', 'Bottled Water'],
    services: ['Tea Tasting Kit', 'Estate Walk Guide', 'Bamboo Sun Hat'],
    whatIncludes: ['Tea plantation entry permits', '7-course tea master tasting', 'Fresh Sylheti snacks & sweets', 'Souvenir tin of handpicked tea'],
    whatToBring: ['Comfortable walking shoes', 'Sun hat / Umbrella', 'Camera'],
    whatNotIncluded: ['Hotel transfer to Sreemangal', 'Personal shopping'],
    hostName: 'Tanvir Hasan',
    hostImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
    hostBio: '3rd-generation Sylheti tea planter and certified international tea sommelier with 12+ years sharing Bangladeshi agro-heritage.',
    cancellationPolicy: 'Free cancellation up to 24 hours before start.',
    ageRequirement: 'All ages welcome (stroller accessible paths)',
    isSoldOut: false,
    isActive: true,
  },
  {
    title: 'Sundarbans Silent Mangrove Boat Safari & Wildlife Trail',
    description: 'Embark on an eco-friendly silent wooden boat expedition through the narrow tidal canals of the world’s largest mangrove forest. Spot spotted deer, estuarine crocodiles, kingfishers, and rare Irrawaddy dolphins led by a licensed forest ranger.',
    city: 'Khulna',
    location: 'Sundarbans Mangrove, Khulna',
    meetingPoint: 'Mongla Port Ghat #2, Bagerhat',
    price: 3600,
    rating: 4.98,
    reviews: 218,
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&auto=format&fit=crop&q=80'
    ],
    badge: 'Bestseller',
    category: 'original',
    tags: ['Adventure', 'Nature', 'Outdoor'],
    highlights: ['Licensed armed forest guard escort', 'Silent wooden boat in canal networks', 'Hot organic fish/veg lunch on board', 'Dolphin & deer spotting guarantee'],
    duration: '6 hours',
    maxGuests: 10,
    spokenLanguages: ['English', 'Bangla'],
    amenities: ['Life jackets', 'First Aid', 'Tea & Snacks', 'Binoculars'],
    services: ['Forest Entry Clearance', 'Eco-Boat Cruise', 'Hot Lunch'],
    whatIncludes: ['Official Sundarbans Forest Department permits', 'Traditional wooden engine boat & fuel', 'Fresh local lunch & tender coconut', 'Wildlife binoculars'],
    whatToBring: ['Sunscreen & insect repellent', 'Water bottle', 'Binoculars or zoom camera'],
    whatNotIncluded: ['Video camera professional tax if applicable'],
    hostName: 'Captain Mizanur Rahman',
    hostImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
    hostBio: 'Born and raised on the fringes of the Sundarbans; 18 years guiding international wildlife researchers and eco-travelers.',
    cancellationPolicy: 'Free cancellation up to 48 hours before.',
    ageRequirement: '8+ years recommended',
    isSoldOut: false,
    isActive: true,
  },
  {
    title: 'Old Dhaka Midnight Kacchi & Secret Heritage Food Trail',
    description: 'Immerse your senses in 400-year-old Mughal culinary traditions. Wander through the atmospheric historic alleys of Nazira Bazar and Shankhari Bazar, sampling legendary slow-cooked Dum Kacchi Biryani, fiery Bakarkhani, Morog Polao, Beauty Lassi, and Labang.',
    city: 'Dhaka',
    location: 'Puran Dhaka, Dhaka',
    meetingPoint: 'Ahsan Manzil (Pink Palace) Front Gate, Sadarghat',
    price: 1500,
    rating: 4.96,
    reviews: 340,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1200&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=1200&auto=format&fit=crop&q=80'
    ],
    badge: 'Foodie Choice',
    category: 'original',
    tags: ['Food & Drink', 'Cultural', 'Outdoor'],
    highlights: ['7 authentic heritage food tastings', 'Secret alleyways & historic stories', 'Rickshaw ride through Old Dhaka included', 'Vegetarian adaptations available'],
    duration: '3 hours',
    maxGuests: 6,
    spokenLanguages: ['English', 'Bangla', 'Dhakaiya Urdu'],
    amenities: ['Tea & Snacks', 'First Aid', 'Bottled Water'],
    services: ['Rickshaw Fare', 'Food & Drink Tastings', 'Heritage Historian Guide'],
    whatIncludes: ['All food & drinks across 7 curated culinary stops', 'Traditional cycle rickshaw rides', 'Filtered water and hygiene wipes', 'Old Dhaka spice gift pouch'],
    whatToBring: ['An empty stomach', 'Modest clothing for heritage alleys', 'Comfortable footwear'],
    whatNotIncluded: ['Personal shopping (perfumes, brassware)'],
    hostName: 'Sultana & Farhan',
    hostImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300',
    hostBio: 'Old Dhaka native culinary storytellers featured on BBC Travel and National Geographic food documentaries.',
    cancellationPolicy: 'Free cancellation up to 12 hours before.',
    ageRequirement: '10+ years',
    isSoldOut: false,
    isActive: true,
  },
  {
    title: 'Cox’s Bazar Golden Sunset Surfing & Marine Drive Secret Beach',
    description: 'Learn to catch the waves of the world’s longest natural sea beach with certified ISA instructors at Inani. Followed by a scenic open-jeep drive along the majestic Marine Drive cliffside to a hidden bay for tender coconut & beachside bonfire.',
    city: 'Cox\'s Bazar',
    location: 'Inani Beach & Marine Drive, Cox\'s Bazar',
    meetingPoint: 'Inani Royal Tulip Beach Access, Cox\'s Bazar',
    price: 2800,
    rating: 4.94,
    reviews: 185,
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=1200&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200&auto=format&fit=crop&q=80'
    ],
    badge: 'Popular',
    category: 'original',
    tags: ['Adventure', 'Outdoor', 'Wellness'],
    highlights: ['All surfboard & safety equipment included', 'GoPro 4K action photos & videos included', 'Open jeep ride down Marine Drive', 'Beginners welcome — 100% standing guarantee'],
    duration: '4 hours',
    maxGuests: 6,
    spokenLanguages: ['English', 'Bangla'],
    amenities: ['Life jackets', 'First Aid', 'Tea & Snacks', 'Shower', 'Locker'],
    services: ['Surfboard Rental', 'Rashguard Gear', 'Open Jeep Safari'],
    whatIncludes: ['Surfboard & protective wetsuit/rashguard', '1-on-1 coaching by certified surf lifesaver', 'GoPro HD photos & video edits', 'Fresh beach coconuts and refreshments'],
    whatToBring: ['Swimwear', 'Towel', 'Sunscreen'],
    whatNotIncluded: ['Personal surf purchases'],
    hostName: 'Jafar Surf Academy',
    hostImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
    hostBio: 'Bangladesh’s pioneer surf champion who represented the nation in international championships, passionate about ocean safety.',
    cancellationPolicy: 'Free cancellation up to 24 hours before.',
    ageRequirement: '12+ years (swimming basics helpful)',
    isSoldOut: false,
    isActive: true,
  },
  {
    title: 'Sajek Valley Cloud Peak Trek & Indigenous Bamboo Feast',
    description: 'Wake up above the clouds in the majestic hills of Sajek. Hike to the highest vantage point of Konglak Pahar, experience traditional Chakma and Lusai tribal village hospitality, and learn how to cook slow-roasted chicken inside natural green bamboo over wood coals.',
    city: 'Rangamati',
    location: 'Sajek Valley, Rangamati',
    meetingPoint: 'Ruilui Para Helipad, Sajek Valley',
    price: 2400,
    rating: 4.96,
    reviews: 172,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511497584788-87676104235f?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&auto=format&fit=crop&q=80'
    ],
    badge: 'StayBD Original',
    category: 'original',
    tags: ['Nature', 'Adventure', 'Cultural'],
    highlights: ['Spectacular Konglak Peak sunrise above clouds', 'Authentic tribal bamboo cooking workshop', 'Traditional Lusai welcome ceremony', 'Small intimate group (max 8)'],
    duration: '5 hours',
    maxGuests: 8,
    spokenLanguages: ['English', 'Bangla', 'Chakma'],
    amenities: ['Tea & Snacks', 'First Aid', 'Bottled Water'],
    services: ['Local Guide Escort', 'Traditional Lunch', 'Trekking Poles'],
    whatIncludes: ['Konglak hill entry permit', 'Indigenous bamboo chicken feast & organic sticky rice', 'Local tribal guide & storyteller', 'Herbal highland tea'],
    whatToBring: ['Sturdy hiking shoes', 'Light windbreaker jacket for breezy morning', 'Camera'],
    whatNotIncluded: ['Chander Gari jeep transfer from Dighinala'],
    hostName: 'Chanchal Chakma',
    hostImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
    hostBio: 'Indigenous community leader and eco-tourism pioneer dedicated to preserving indigenous culture and pristine Himalayan-foothill landscapes.',
    cancellationPolicy: 'Free cancellation up to 48 hours before.',
    ageRequirement: 'All fitness levels capable of light uphill walking',
    isSoldOut: false,
    isActive: true,
  },
  {
    title: 'UNESCO Living Heritage: Rickshaw Art & Folk Painting Studio',
    description: 'Celebrate Bangladesh’s newly recognized UNESCO Intangible Cultural Heritage! Step into an authentic artisan studio in Dhaka and learn the vibrant techniques of Rickshaw painting from a 40-year master craftsman. Create and paint your own personalized metal rickshaw plate to bring home.',
    city: 'Dhaka',
    location: 'Mirpur Artists Enclave, Dhaka',
    meetingPoint: 'Mirpur 10 Circle Metro Station Exit A',
    price: 1350,
    rating: 4.92,
    reviews: 104,
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1200&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1460661419200-fd435f017d8d?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&auto=format&fit=crop&q=80'
    ],
    badge: 'Craft & Art',
    category: 'original',
    tags: ['Art', 'Cultural', 'Wellness'],
    highlights: ['Take home your own painted metallic rickshaw art plaque', 'Hands-on instruction from a legendary Ustad', 'All paints, brushes & metal plates included', 'Traditional masala chai & sweet samosas served'],
    duration: '2.5 hours',
    maxGuests: 6,
    spokenLanguages: ['English', 'Bangla'],
    amenities: ['Tea & Snacks', 'WiFi', 'Changing Room', 'Locker'],
    services: ['Art Materials Kit', 'Painting Apron', 'Souvenir Packaging'],
    whatIncludes: ['Custom hand-cut metal sheet for painting', 'Vibrant oil & enamel paints', 'Protective apron and packaging for travel', 'Chai & sweets'],
    whatToBring: ['Clothes you don’t mind getting a tiny paint speck on'],
    whatNotIncluded: ['Large decorative full-rickshaw commissions'],
    hostName: 'Ustad Rafiqul Islam',
    hostImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300',
    hostBio: 'Master Rickshaw painter who has decorated over 2,000 cycle rickshaws and exhibited in the Victoria and Albert Museum in London.',
    cancellationPolicy: 'Free cancellation up to 24 hours before.',
    ageRequirement: 'Suitable for adults and children 8+',
    isSoldOut: false,
    isActive: true,
  },
  {
    title: 'Bandarban Nafakhum Waterfall & Sangu River Canyon Voyage',
    description: 'The ultimate river adventure in Bangladesh! Cruise on a wooden country boat through the towering stone canyons of the Sangu River from Thanchi to Remakri, followed by an exhilarating trek along rocky jungle streams to the roaring Nafakhum Waterfall.',
    city: 'Bandarban',
    location: 'Thanchi & Remakri, Bandarban',
    meetingPoint: 'Thanchi BGB Camp Ghat, Bandarban',
    price: 3400,
    rating: 4.95,
    reviews: 135,
    image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=1200&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511497584788-87676104235f?w=1200&auto=format&fit=crop&q=80'
    ],
    badge: 'Top Rated',
    category: 'standard',
    tags: ['Adventure', 'Nature', 'Outdoor'],
    highlights: ['Spectacular Sangu River gorge boat cruise', 'Swim in natural crystal pools beneath waterfall', 'Fresh Marma tribal lunch in Remakri', 'Certified local mountain guide escort'],
    duration: '7 hours',
    maxGuests: 8,
    spokenLanguages: ['English', 'Bangla', 'Marma'],
    amenities: ['Life jackets', 'First Aid', 'Tea & Snacks'],
    services: ['River Boat Fare', 'Permit Facilitation', 'Trek Guide'],
    whatIncludes: ['Engine boat charter roundtrip from Thanchi to Remakri', 'Certified BGB-approved indigenous trek guide', 'Fresh organic mountain lunch', 'All safety vests and water bottles'],
    whatToBring: ['Water shoes or quick-dry trekking sneakers', 'Dry bag for electronics', 'Change of clothes'],
    whatNotIncluded: ['Personal transport to Thanchi'],
    hostName: 'Aung San Marma',
    hostImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
    hostBio: 'Native highland guide with intimate knowledge of Chittagong Hill Tracts trails, river currents, and indigenous safety protocols.',
    cancellationPolicy: 'Free cancellation up to 48 hours before.',
    ageRequirement: '14+ years and good physical fitness',
    isSoldOut: false,
    isActive: true,
  },
  {
    title: 'Chittagong Heritage Mezbani Feast & Shipyard Coastal Trail',
    description: 'Taste the fiery pride of Chittagong! Discover the secret blend of 32 spices in a legendary Mezbani beef and slow-braised nola stew masterclass. Conclude with a seaside drive to Patenga Beach and the shipbreaking coastline at sunset for fresh spiced crabs.',
    city: 'Chittagong',
    location: 'GEC Circle & Patenga Coastal Belt, Chittagong',
    meetingPoint: 'GEC Circle Central Point, Chittagong',
    price: 1950,
    rating: 4.93,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80'
    ],
    badge: 'Cultural Epic',
    category: 'standard',
    tags: ['Food & Drink', 'Cultural', 'Outdoor'],
    highlights: ['Iconic slow-cooked Mezbani Gosht tasting', 'Patenga Beach sunset stroll with crab fry', 'Traditional brass pot cooking secrets', 'Private AC microbus transport included'],
    duration: '3.5 hours',
    maxGuests: 8,
    spokenLanguages: ['English', 'Bangla', 'Chatgaya'],
    amenities: ['Tea & Snacks', 'First Aid', 'WiFi', 'Air Conditioning'],
    services: ['AC Transport', 'Mezbani Feast', 'Culinary Host'],
    whatIncludes: ['Full traditional Mezbani feast with beef/dal/rice', 'Private AC van for Patenga transport', 'Beachside fresh coconut & spiced fried crab', 'Culinary spice gift kit'],
    whatToBring: ['Appetite for bold authentic spices', 'Sunglasses for Patenga breeze'],
    whatNotIncluded: ['Alcoholic beverages'],
    hostName: 'Chef Akramul Hoque',
    hostImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
    hostBio: 'Master culinary chef who has preserved traditional Chattogram royal banquets for over 25 years.',
    cancellationPolicy: 'Free cancellation up to 24 hours before.',
    ageRequirement: 'All ages',
    isSoldOut: false,
    isActive: true,
  },
  {
    title: 'Sonargaon Panam Nagar Ghost City & Jamdani Weaving Walk',
    description: 'Travel back in time to the 19th-century lost merchant city of Panam Nagar in the ancient capital of Sonargaon. Walk among 52 ornate colonial terracotta mansions, followed by an intimate visit to master Jamdani weavers crafting exquisite UNESCO-recognized muslin.',
    city: 'Dhaka',
    location: 'Sonargaon, Narayanganj',
    meetingPoint: 'Sonargaon Folk Art Museum Gate, Narayanganj',
    price: 1650,
    rating: 4.91,
    reviews: 110,
    image: 'https://images.unsplash.com/photo-1590073844006-33379778ae09?w=1200&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1590073844006-33379778ae09?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1460661419200-fd435f017d8d?w=1200&auto=format&fit=crop&q=80'
    ],
    badge: 'Heritage Icon',
    category: 'standard',
    tags: ['Cultural', 'Art', 'Outdoor'],
    highlights: ['Guided tour through 52 abandoned historic mansions', 'Live handloom Jamdani masterclass observation', 'Entry tickets to Folk Art Museum & Panam included', 'Traditional Bengali snacks & fresh sweets'],
    duration: '4 hours',
    maxGuests: 8,
    spokenLanguages: ['English', 'Bangla'],
    amenities: ['Tea & Snacks', 'First Aid', 'Bottled Water'],
    services: ['Entry Permits', 'Architectural Guide', 'Weaver Workshop Access'],
    whatIncludes: ['All monument & heritage park entry tickets', 'Direct access to generational handloom weavers', 'Local Sonargaon sweets and tea', 'Historical guide commentary booklet'],
    whatToBring: ['Comfortable walking shoes', 'Sun hat or umbrella', 'Camera'],
    whatNotIncluded: ['Personal Jamdani sari purchases'],
    hostName: 'Farzana Yasmin',
    hostImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300',
    hostBio: 'Architectural historian and heritage preservation researcher specializing in Bengal delta trade routes.',
    cancellationPolicy: 'Free cancellation up to 24 hours before.',
    ageRequirement: 'All ages welcome',
    isSoldOut: false,
    isActive: true,
  },
  {
    title: 'Kuakata Daughter of Sea: Sunrise, Red Crab & Mangrove Safari',
    description: 'Witness the rare spectacle where you can watch both the sunrise and sunset from the same beach. Take an adventurous quad/bike expedition across vast golden sandflats to the million-strong Red Crab Sanctuary at Gangamati and the enchanting Fatrar Bon mangrove forest.',
    city: 'Kuakata',
    location: 'Gangamati & Red Crab Beach, Kuakata',
    meetingPoint: 'Kuakata Zero Point Beach Front',
    price: 2150,
    rating: 4.93,
    reviews: 88,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200&auto=format&fit=crop&q=80'
    ],
    badge: 'Popular',
    category: 'standard',
    tags: ['Adventure', 'Outdoor', 'Nature'],
    highlights: ['Unobstructed sunrise over the Bay of Bengal', 'Red Crab island photo session with wildlife guide', 'Boat cruise into Fatrar Bon mangrove jungle', 'Fresh green coconut & local fish barbecue'],
    duration: '4 hours',
    maxGuests: 6,
    spokenLanguages: ['English', 'Bangla'],
    amenities: ['Life jackets', 'First Aid', 'Tea & Snacks'],
    services: ['Beach Safari Guide', 'Canal Boat Cruise', 'Coconut Barbecue'],
    whatIncludes: ['Guided coastal safari vehicle and boat fuel', 'Red crab sanctuary conservation permit', 'Tender coconuts and morning beach barbecue', 'High-res digital photos'],
    whatToBring: ['Sunglasses', 'Sunscreen', 'Sandals or water shoes'],
    whatNotIncluded: ['Personal souvenirs'],
    hostName: 'Sohag Barua',
    hostImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300',
    hostBio: 'Kuakata coastal conservationist and licensed naturalist with 14 years exploring the southern Bay of Bengal coastline.',
    cancellationPolicy: 'Free cancellation up to 24 hours before.',
    ageRequirement: 'Suitable for all ages',
    isSoldOut: false,
    isActive: true,
  }
];

async function seedExperiences() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB:', MONGO_URI);

    const owner = await User.findOne({ role: 'OWNER' }) || await User.findOne();
    const hotel = await Hotel.findOne() || null;

    if (!owner) {
      console.error('No owner/user found in DB. Run main seed.js first!');
      process.exit(1);
    }

    console.log('Clearing existing experiences and reviews...');
    await Experience.deleteMany({});
    await ExperienceReview.deleteMany({});

    console.log('Seeding 10 authentic curated Bangladesh experiences with 5 high-res photos each...');
    const createdExps = [];
    for (const expData of authenticExperiences) {
      const exp = await Experience.create({
        ...expData,
        owner: owner._id,
        hotel: hotel ? hotel._id : null,
        hotelName: hotel ? hotel.name : 'StayBD Verified Host Collection',
      });
      createdExps.push(exp);
    }
    console.log(`✓ Created ${createdExps.length} experiences successfully!`);

    // Add high quality reviews
    const users = await User.find({ role: 'USER' });
    const u1 = users[0] || owner;
    const u2 = users[1] || owner;

    await ExperienceReview.insertMany([
      {
        experience: createdExps[0]._id,
        user: u1._id,
        userName: u1.name || 'Rahim Khan',
        rating: 5,
        comment: 'Mindblowing tea tasting in Sreemangal! Tanvir knows everything about tea and the garden was breathtaking at sunrise.'
      },
      {
        experience: createdExps[1]._id,
        user: u2._id,
        userName: u2.name || 'Sumaiya Akter',
        rating: 5,
        comment: 'The Sundarbans silent boat tour was magical. We saw spotted deer and three Irrawaddy dolphins! 10/10 recommendation.'
      },
      {
        experience: createdExps[2]._id,
        user: u1._id,
        userName: u1.name || 'Rahim Khan',
        rating: 5,
        comment: 'Best food tour in Dhaka. The midnight Kacchi and Beauty Lassi in Old Dhaka were out of this world!'
      },
      {
        experience: createdExps[3]._id,
        user: u2._id,
        userName: u2.name || 'Sumaiya Akter',
        rating: 5,
        comment: 'Surfing at Inani beach was so exhilarating! The instructors were very patient with beginners.'
      }
    ]);
    console.log('✓ Created verified reviews!');

    console.log('\nAll experiences updated with 5 high-res photos, correct BDT prices, and rich metadata!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding experiences:', err);
    process.exit(1);
  }
}

seedExperiences();
