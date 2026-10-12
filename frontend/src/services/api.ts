/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  Reservation bd — Unified API Layer                            ║
 * ║  All data flows through the Express backend on /api/*      ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

const DEFAULT_API_BASE = 'https://staybd-backend.vercel.app/api';
const API_BASE = (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim() !== '')
  ? import.meta.env.VITE_API_URL.replace(/\/+$/, '')
  : (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? '/api'
      : DEFAULT_API_BASE);

// ──────────────────────── TYPES ────────────────────────
export type UserRole = "ADMIN" | "OWNER" | "USER";
export type UserStatus = "ACTIVE" | "BLOCKED" | "SUSPENDED";
export type BookingType = "ONLINE" | "OFFLINE";
export type BookingStatus = "CONFIRMED" | "CANCELLED" | "PENDING";
export type VerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";
export type RoomStatus = "AVAILABLE" | "OCCUPIED" | "CLEANING" | "MAINTENANCE" | "BLOCKED";
export type NotificationType = "BOOKING" | "PAYMENT" | "COMPLAINT" | "SYSTEM" | "CHECKIN";

export interface HousekeepingTask {
  id: string;
  hotelId: string;
  roomId: string;
  roomType: string;
  floorNumber: number;
  status: RoomStatus;
  assignedTo?: string;
  notes?: string;
  lastCleaned?: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  recipientId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface GuestProfile {
  userId: string;
  name: string;
  email: string;
  totalBookings: number;
  totalSpent: number;
  lastStay?: string;
  preferredRoomType?: string;
  nationality?: string;
  phone?: string;
}

export interface OccupancyReport {
  month: string;
  hotelId: string;
  roomStats: {
    roomId: string;
    roomType: string;
    totalBookings: number;
    totalRevenue: number;
    occupancyRate: number;
  }[];
  totalRevenue: number;
  avgOccupancyRate: number;
}

export interface DynamicPricingRule {
  id: string;
  hotelId: string;
  roomId: string;
  label: string;
  multiplier: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface CalendarDay {
  date: string;
  isBooked: boolean;
  bookingId?: string;
  guestName?: string;
  availableCount: number;
  totalCount: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

export interface HotelOwner extends UserProfile {
  role: "OWNER";
  verificationStatus: VerificationStatus;
  subscriptionEndDate: string;
  hasAdminOverride: boolean;
  phone?: string;
  nidNumber?: string;
  nidDocUrl?: string;
  tradeLicenseNumber?: string;
  hotelAuthDocUrl?: string;
  hotelName?: string;
  hotelAddress?: string;
  hotelCity?: string;
  commissionRate?: number;
}

export interface Hotel {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  address: string;
  city: string;
  locationLat: number;
  locationLng: number;
  mapUrl?: string;
  images: string[];
  rating: number;
  totalReviews: number;
  isVerified: boolean;
  isRedMarked: boolean;
  isActive: boolean;
  amenities: string[];
  checkInTime?: string;
  checkOutTime?: string;
  acceptedPayments?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  id: string;
  hotelId: string;
  hotelName?: string;
  hotelCity?: string;
  hotelImage?: string;
  type: string; // Custom Room Name
  category: string; // Room Classification
  pricePerNight: number;
  discountPrice?: number;
  totalInventory: number;
  availableCount: number;
  images: string[];
  amenities: string[];
  floorNumber: number;
  description?: string;
  roomNumber?: string;
  capacity?: string;
  sizeSqFt?: number;
  viewType?: string;
  maxAdults: number;
  maxChildren: number;
  petsAllowed: boolean;
  beds?: Record<string, number>;
  createdAt: string;
  updatedAt: string;
}

export const ROOM_CATEGORIES = [
  "Single Room", "Double Room", "Twin Room", "Triple Room", "Quad Room",
  "Deluxe Room", "Super Deluxe", "Executive Room", "Premium Room",
  "Junior Suite", "Executive Suite", "Presidential Suite", "Royal Suite",
  "Family Room", "Family Suite", "Penthouse", "Studio", "Apartment",
  "Villa", "Cottage", "Bungalow", "Dormitory bed"
];

export const BED_TYPES = ["King", "Queen", "Full", "Double", "Twin", "Single", "Sofa Bed", "Bunk Bed", "Extra Bed"];

export const VIEW_TYPES = [
  "City View", "Mountain View", "Sea View", "Garden View", "Pool View",
  "River View", "Lake View", "Beach View", "Skyline View", "Courtyard View",
  "Street View", "Partial Sea View", "No View"
];

export interface Booking {
  id: string;
  userId: string | null;
  hotelId: string;
  roomId: string;
  roomType: string;
  roomNumber?: string;
  hotelName: string;
  type: BookingType;
  status: BookingStatus;
  checkIn:  string;
  checkOut: string;
  nights: number;
  totalPrice: number;
  paymentMethod?: "card" | "bkash" | "nagad" | "cash";
  paymentPhone?: string;
  transactionId?: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  specialRequests?: string;
  arrivalTime?: string;
  travelingForWork?: boolean;
  country?: string;
  bookingFor?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  hotelId: string;
  rating: number;
  comment: string;
  type: "REVIEW" | "COMPLAINT";
  createdAt: string;
}

export interface Complaint {
  id: string;
  userId: string;
  userName: string;
  hotelId: string;
  hotelName: string;
  bookingId?: string;
  description: string;
  imageUrl?: string;
  status: "Pending" | "In Progress" | "Resolved";
  createdAt: string;
  updatedAt: string;
}

export type ServiceCategory = "Food" | "Spa" | "Transport" | "Gym" | "Other";
export type ServiceRequestStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export interface HotelService {
  id: string;
  hotelId: string;
  name: string;
  description: string;
  category: ServiceCategory;
  price: number;
  currency: string;
  icon: string;
  isAvailable: boolean;
  createdAt: string;
}

export interface ServiceRequest {
  id: string;
  userId: string;
  bookingId: string;
  hotelId: string;
  serviceId: string;
  serviceName: string;
  serviceCategory: ServiceCategory;
  serviceIcon: string;
  priceAtRequest: number;
  requestedDateTime: string;
  specialNotes?: string;
  status: ServiceRequestStatus;
  hotelNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Advertisement {
  id: string;
  hotelId: string;
  hotelName: string;
  imageUrl: string;
  targetUrl: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
}

export interface Offer {
  id: string;
  hotelId: string;
  hotelName: string;
  title: string;
  discountPercent: number;
  imageUrl?: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExperienceCard {
  id: string;
  ownerId: string;
  hotelId?: string;
  hotelName?: string;
  title: string;
  description: string;
  city: string;
  location: string;
  meetingPoint?: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  images?: string[];
  badge?: string;
  category?: "original" | "standard";
  tags?: string[];
  highlights?: string[];
  duration?: string;
  maxGuests?: number;
  spokenLanguages?: string[];
  amenities?: string[];
  services?: string[];
  whatIncludes?: string[];
  whatToBring?: string[];
  whatNotIncluded?: string[];
  hostName?: string;
  hostImage?: string;
  hostBio?: string;
  cancellationPolicy?: string;
  ageRequirement?: string;
  isSoldOut?: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExperienceBooking {
  id: string;
  experienceId: string;
  experienceTitle: string;
  userId: string;
  userName: string;
  userEmail: string;
  date: string;
  guests: number;
  totalPrice: number;
  status: "CONFIRMED" | "CANCELLED" | "PENDING";
  paymentMethod?: "card" | "bkash" | "cash";
  createdAt: string;
}

export interface ExperienceReview {
  id: string;
  experienceId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface WalletTransaction {
  id: string;
  hotelId: string;
  bookingId: string;
  amount: number;
  type: "CREDIT" | "DEBIT";
  description: string;
  createdAt: string;
}

// ──────────────────────── CONSTANTS ────────────────────────

export const HOTEL_AMENITIES = [
  { id: "wifi", label: "Free WiFi", icon: "📶" },
  { id: "pool", label: "Swimming Pool", icon: "🏊" },
  { id: "gym", label: "Fitness Center", icon: "🏋️" },
  { id: "restaurant", label: "Restaurant", icon: "🍴" },
  { id: "parking", label: "Free Parking", icon: "🅿️" },
  { id: "ac", label: "Air Conditioning", icon: "❄️" },
  { id: "spa", label: "Spa & Wellness", icon: "🧖" },
  { id: "bar", label: "Bar & Lounge", icon: "🍸" },
  { id: "room_service", label: "Room Service", icon: "🚪" },
  { id: "concierge", label: "Concierge", icon: "👨‍💼" },
  { id: "laundry", label: "Laundry", icon: "🧺" },
  { id: "business", label: "Business Center", icon: "💼" }
];

export const ROOM_AMENITIES = [
  { id: "ac", label: "Air Conditioning", icon: "❄️" },
  { id: "wifi", label: "High-speed WiFi", icon: "📶" },
  { id: "tv", label: "Smart TV", icon: "📺" },
  { id: "minibar", label: "Mini Bar", icon: "🍾" },
  { id: "balcony", label: "Private Balcony", icon: "🌅" },
  { id: "workspace", label: "Work Desk", icon: "💻" },
  { id: "bathroom", label: "Attached Bathroom", icon: "🚿" },
  { id: "kingsize", label: "King Size Bed", icon: "🛏️" },
];

export const PAYMENT_OPTIONS = ["Cash", "bKash", "Nagad", "Rocket", "Credit Card", "Bank Transfer"];

// ──────────────────────── HELPERS ────────────────────────

class ValidationError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "ValidationError";
  }
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${API_BASE}${normalizedPath}`;
  
  // Try to get token from localStorage
  const adminToken = localStorage.getItem('adminToken');
  const ownerToken = localStorage.getItem('ownerToken');
  const token = adminToken || ownerToken;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options?.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  const text = await res.text();
  let json: any = null;
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      // not JSON
    }
  }

  if (!res.ok) {
    const errorMsg = json?.message || (text && text.length < 200 && !text.includes('<!DOCTYPE') ? text : `API error ${res.status}: ${res.statusText}`);
    throw new Error(errorMsg);
  }

  return (json !== null ? json : text) as T;
}

// Normalize MongoDB _id → id for any object
function normalize<T>(obj: any): T {
  if (!obj) return obj;
  if (Array.isArray(obj)) return obj.map(o => normalize<T>(o)) as unknown as T;
  const { _id, __v, ...rest } = obj;
  return { ...rest, id: rest.id || (_id?.toString?.() || _id) } as T;
}

// ──────────────────────── ROOM SYNC & STORAGE HELPERS ────────────────────────
export const ROOM_LOCAL_KEY = 'sb_custom_rooms';

const INITIAL_DEMO_ROOMS: Room[] = [
  {
    id: "room_sp_exec_suite",
    hotelId: "sea-pearl-cox",
    hotelName: "Sea Pearl Royal Beach Resort",
    hotelCity: "Cox's Bazar",
    type: "Executive Ocean View Suite",
    category: "Executive Suite",
    pricePerNight: 4500,
    discountPrice: 3850,
    totalInventory: 24,
    availableCount: 18,
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800"
    ],
    amenities: ["Private Balcony", "Sea View", "King Size Bed", "Free WiFi", "Breakfast Included", "Air Conditioning"],
    floorNumber: 3,
    description: "Panoramic Bay of Bengal ocean view suite with custom plush King bed, private seaside balcony, luxury jacuzzi bath and 24/7 in-room butler dining.",
    capacity: "2-4 Guests",
    viewType: "Sea View",
    sizeSqFt: 620,
    maxAdults: 2,
    maxChildren: 2,
    petsAllowed: false,
    beds: { "King Bed": 1, "Sofa Bed": 1 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "room_sp_double_deluxe",
    hotelId: "sea-pearl-cox",
    hotelName: "Sea Pearl Royal Beach Resort",
    hotelCity: "Cox's Bazar",
    type: "Double Deluxe Lagoon Pool Room",
    category: "Double Room",
    pricePerNight: 6000,
    discountPrice: 5200,
    totalInventory: 16,
    availableCount: 12,
    images: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"
    ],
    amenities: ["Direct Lagoon Pool Access", "2 Queen Beds", "Free WiFi", "Breakfast", "Air Conditioning", "Attached Bath"],
    floorNumber: 1,
    description: "Spacious contemporary double room with ground floor direct step-out access to the resort lagoon pool, dual Queen beds, and premium soundproofing.",
    capacity: "4-6 Guests",
    viewType: "Pool View",
    sizeSqFt: 540,
    maxAdults: 4,
    maxChildren: 2,
    petsAllowed: false,
    beds: { "Double Bed": 2 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "room_sp_presidential_ocean_villa",
    hotelId: "sea-pearl-cox",
    hotelName: "Sea Pearl Royal Beach Resort",
    hotelCity: "Cox's Bazar",
    type: "Presidential Royal Ocean Villa",
    category: "Presidential Suite",
    pricePerNight: 15500,
    discountPrice: 12900,
    totalInventory: 4,
    availableCount: 3,
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&auto=format&fit=crop&q=80"
    ],
    amenities: ["Private Infinity Jacuzzi", "Direct Beach Access", "Private Ocean Terrace", "Complimentary Gourmet Buffet", "Helipad Transfer", "24/7 Butler Service"],
    floorNumber: 5,
    description: "The pinnacle of royal luxury on the Bay of Bengal. Standalone oceanfront villa featuring private infinity jacuzzi, master king suite, panoramic sea terrace, marble spa bath and 24/7 dedicated butler service.",
    capacity: "4-6 Guests",
    viewType: "Panoramic Ocean View",
    sizeSqFt: 1450,
    maxAdults: 4,
    maxChildren: 2,
    petsAllowed: true,
    beds: { "King Bed": 2, "Day Bed": 1 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "room_sp_presidential_villa",
    hotelId: "sea-pearl-cox",
    hotelName: "Sea Pearl Royal Beach Resort",
    hotelCity: "Cox's Bazar",
    type: "Presidential Royal Horizon Penthouse",
    category: "Presidential Suite",
    pricePerNight: 12500,
    discountPrice: 9900,
    totalInventory: 4,
    availableCount: 3,
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800"
    ],
    amenities: ["Private Jacuzzi", "Private Terrace", "Complimentary Buffet", "Helipad Access", "High-speed WiFi", "Minibar"],
    floorNumber: 5,
    description: "The pinnacle of coastal luxury in Bangladesh. Master king bedroom, marble bathroom with ocean-facing soaking tub, and a vast private sunset terrace.",
    capacity: "4 Guests",
    viewType: "Panoramic Ocean View",
    sizeSqFt: 1100,
    maxAdults: 4,
    maxChildren: 2,
    petsAllowed: true,
    beds: { "King Bed": 2 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export function getLocalRooms(): Room[] {
  try {
    const raw = localStorage.getItem(ROOM_LOCAL_KEY);
    if (!raw) {
      localStorage.setItem(ROOM_LOCAL_KEY, JSON.stringify(INITIAL_DEMO_ROOMS));
      return INITIAL_DEMO_ROOMS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Ensure initial demo rooms exist if not yet added
      const map = new Map<string, Room>();
      parsed.forEach((r: Room) => map.set(r.id, r));
      INITIAL_DEMO_ROOMS.forEach(demo => {
        if (!map.has(demo.id)) {
          map.set(demo.id, demo);
        }
      });
      return Array.from(map.values());
    }
    return INITIAL_DEMO_ROOMS;
  } catch {
    return INITIAL_DEMO_ROOMS;
  }
}

export function saveLocalRoom(room: Room): void {
  try {
    const current = getLocalRooms().filter(r => r.id !== room.id);
    const updated = [room, ...current];
    localStorage.setItem(ROOM_LOCAL_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('sb_rooms_updated', { detail: room }));
    try {
      const bc = new BroadcastChannel('sb_rooms_channel');
      bc.postMessage({ type: 'ROOM_UPDATED', room });
      bc.close();
    } catch {}
  } catch (e) {
    console.error("Save local room error:", e);
  }
}

export function removeLocalRoom(roomId: string): void {
  try {
    const current = getLocalRooms().filter(r => r.id !== roomId);
    localStorage.setItem(ROOM_LOCAL_KEY, JSON.stringify(current));
    window.dispatchEvent(new CustomEvent('sb_rooms_updated', { detail: { id: roomId, deleted: true } }));
    try {
      const bc = new BroadcastChannel('sb_rooms_channel');
      bc.postMessage({ type: 'ROOM_DELETED', roomId });
      bc.close();
    } catch {}
  } catch (e) {
    console.error("Remove local room error:", e);
  }
}

// ──────────────────────── API ────────────────────────

export const api = {

  // ╔══════════════ AUTH SECTION ══════════════╗

  adminLogin: async (email: string, password: string): Promise<{ id: string; _id: string; name: string; email: string; role: string; token: string }> => {
    const data = await apiFetch<any>('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const id = data.id || data._id;
    return { ...data, id, _id: id };
  },

  ownerLogin: async (email: string, password: string): Promise<{ id: string; _id: string; name: string; email: string; role: string; token: string }> => {
    const data = await apiFetch<any>('/auth/owner/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const id = data.id || data._id;
    return { ...data, id, _id: id };
  },

  // ╔══════════════ USER SECTION ══════════════╗

  getUserBookings: async (userId: string): Promise<Booking[]> => {
    const res = await apiFetch<any>(`/bookings/user/${userId}`);
    return Array.isArray(res) ? res : res.bookings ?? [];
  },

  syncUser: async (payload: { clerkId: string; email: string; name: string; avatar?: string }): Promise<UserProfile | HotelOwner> => {
    const data = await apiFetch<any>('/users/sync', { method: 'POST', body: JSON.stringify(payload) });
    return { ...data, id: data._id || data.id };
  },

  getOwnerBookings: async (hotelId: string): Promise<Booking[]> => {
    const res = await apiFetch<any>(`/bookings/hotel/${hotelId}`);
    return Array.isArray(res) ? res : res.bookings ?? [];
  },

  getHotelBookings: async (hotelId: string): Promise<Booking[]> => {
    const res = await apiFetch<any>(`/bookings/hotel/${hotelId}`);
    return Array.isArray(res) ? res : res.bookings ?? [];
  },

  createBooking: async (payload: {
    userId: string | null; hotelId: string; roomId: string; roomType: string;
    roomNumber?: string; hotelName: string; type: BookingType;
    checkIn: string; checkOut: string; nights: number; totalPrice: number;
    paymentMethod?: "card" | "bkash" | "nagad" | "cash";
  }): Promise<Booking> => {
    return apiFetch<Booking>('/bookings', { method: 'POST', body: JSON.stringify(payload) });
  },

  processBookingPayment: async (payload: {
    userId: string;
    hotelId: string;
    roomId: string;
    checkIn: string;
    checkOut: string;
    nights: number;
    paymentMethod: "card" | "bkash" | "nagad" | "cash" | string;
    hotelName?: string;
    roomType?: string;
    roomNumber?: string;
    totalPrice?: number;
    paymentPhone?: string;
    transactionId?: string;
    guestName?: string;
    guestEmail?: string;
    guestPhone?: string;
    specialRequests?: string;
    arrivalTime?: string;
    travelingForWork?: boolean;
    country?: string;
    bookingFor?: string;
  }): Promise<{ message: string; booking: Booking }> => {
    return apiFetch<{ message: string; booking: Booking }>('/bookings/process-payment', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  addOfflineBooking: async (payload: { hotelId: string; roomId: string; nights: number; guestName: string; userId?: string }): Promise<Booking> => {
    return apiFetch<Booking>('/bookings/offline', { method: 'POST', body: JSON.stringify(payload) });
  },

  // ╔══════════════ SEARCH ══════════════╗

  searchHotels: async (query?: string | { q?: string; city?: string; limit?: number; showRedMarked?: boolean, checkIn?: string, checkOut?: string, adults?: number, children?: number, roomsCount?: number }): Promise<{ hotels: (Hotel & { rooms: Room[] })[] }> => {
    let params = '';
    if (typeof query === 'string') {
      params = query ? `?q=${encodeURIComponent(query)}` : '';
    } else if (query) {
      const parts = [];
      if (query.q) parts.push(`q=${encodeURIComponent(query.q)}`);
      if (query.city) parts.push(`city=${encodeURIComponent(query.city)}`);
      if (query.limit) parts.push(`limit=${query.limit}`);
      if (query.showRedMarked !== undefined) parts.push(`showRedMarked=${query.showRedMarked}`);
      if (query.checkIn) parts.push(`checkIn=${query.checkIn}`);
      if (query.checkOut) parts.push(`checkOut=${query.checkOut}`);
      if (query.adults !== undefined) parts.push(`adults=${query.adults}`);
      if (query.children !== undefined) parts.push(`children=${query.children}`);
      if (query.roomsCount !== undefined) parts.push(`roomsCount=${query.roomsCount}`);
      if (parts.length > 0) params = '?' + parts.join('&');
    }
    return apiFetch(`/hotels${params}`);
  },

  getHotelById: async (hotelId: string): Promise<(Hotel & { rooms: Room[] }) | null> => {
    try {
      let h: (Hotel & { rooms: Room[] }) | null = null;
      try {
        h = await apiFetch<Hotel & { rooms: Room[] }>(`/hotels/${hotelId}`);
      } catch {}
      if (!h) {
        try {
          const allHotels = await apiFetch<Hotel[]>('/hotels');
          const matched = (allHotels || []).find(x => 
            x.id === hotelId || 
            x.id.toLowerCase() === hotelId.toLowerCase() ||
            x.name.toLowerCase().includes(hotelId.replace(/[-_]/g, ' ').toLowerCase())
          );
          if (matched) {
            h = { ...matched, rooms: [] };
          }
        } catch {}
      }
      const hotelRooms = await api.getHotelRooms(hotelId);
      if (h) {
        h.rooms = hotelRooms && hotelRooms.length > 0 ? hotelRooms : (h.rooms || []);
        return h;
      }
      if (hotelRooms && hotelRooms.length > 0) {
        const first = hotelRooms[0];
        return {
          id: hotelId,
          ownerId: "owner_pms",
          name: first.hotelName || "Sea Pearl Royal Beach Resort",
          city: first.hotelCity || "Cox's Bazar",
          address: "Prime Beachfront Resort Corridor",
          description: "Verified luxury partner property with direct instant reservations.",
          locationLat: 21.4272,
          locationLng: 92.0058,
          images: first.images && first.images.length > 0 ? first.images : ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"],
          rating: 4.9,
          totalReviews: 320,
          isVerified: true,
          isRedMarked: false,
          isActive: true,
          amenities: first.amenities || ["Free Wi-Fi", "Air Conditioning", "Swimming Pool"],
          acceptedPayments: ["bKash", "Nagad", "Cash", "VISA"],
          rooms: hotelRooms
        } as any;
      }
      return null;
    } catch { return null; }
  },

  getHotelRooms: async (hotelId: string): Promise<Room[]> => {
    let serverRooms: Room[] = [];
    try {
      serverRooms = await apiFetch<Room[]>(`/rooms/hotel/${hotelId}`);
    } catch {}
    const local = getLocalRooms();
    const map = new Map<string, Room>();
    const seenTypes = new Set<string>();

    (serverRooms || []).forEach(r => {
      seenTypes.add((r.type || '').toLowerCase().trim());
      map.set(r.id, r);
    });

    local.forEach(r => {
      const typeKey = (r.type || '').toLowerCase().trim();
      if (seenTypes.has(typeKey) && r.id.startsWith('room_sp_')) {
        return;
      }
      if (r.hotelId === hotelId || !hotelId || (!serverRooms?.length && (r.hotelName?.toLowerCase().includes("sea pearl") || !hotelId))) {
        const existing = map.get(r.id);
        map.set(r.id, existing ? { ...existing, ...r } : r);
      }
    });
    const result = Array.from(map.values());
    result.sort((a, b) => new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime());
    return result;
  },

  getHotelReviews: async (hotelId: string): Promise<Review[]> => {
    return apiFetch<Review[]>(`/reviews/hotel/${hotelId}`);
  },

  getHotelOffers: async (hotelId: string): Promise<Offer[]> => {
    return apiFetch<Offer[]>(`/offers/hotel/${hotelId}`);
  },

  getOffers: async (): Promise<Offer[]> => {
    return apiFetch<Offer[]>('/offers');
  },

  addOffer: async (offer: Omit<Offer, "id" | "createdAt" | "updatedAt">): Promise<Offer> => {
    return apiFetch<Offer>('/offers', { method: 'POST', body: JSON.stringify(offer) });
  },

  createOffer: async (offer: Omit<Offer, "id" | "createdAt" | "updatedAt">): Promise<Offer> => {
    return apiFetch<Offer>('/offers', { method: 'POST', body: JSON.stringify(offer) });
  },

  updateOffer: async (offerId: string, updates: Partial<Offer>): Promise<Offer | null> => {
    try {
      return await apiFetch<Offer>(`/offers/${offerId}`, { method: 'PATCH', body: JSON.stringify(updates) });
    } catch { return null; }
  },

  deleteOffer: async (offerId: string): Promise<boolean> => {
    try {
      await apiFetch(`/offers/${offerId}`, { method: 'DELETE' });
      return true;
    } catch { return false; }
  },

  addReview: async (payload: { userId: string; userName: string; hotelId: string; rating: number; comment: string; type?: "REVIEW" | "COMPLAINT" }): Promise<Review> => {
    return apiFetch<Review>('/reviews', { method: 'POST', body: JSON.stringify(payload) });
  },

  submitReview: async (payload: { userId: string; userName: string; hotelId: string; rating: number; comment: string; type?: "REVIEW" | "COMPLAINT" }): Promise<Review> => {
    return apiFetch<Review>('/reviews', { method: 'POST', body: JSON.stringify(payload) });
  },

  // ╔══════════════ OWNER SECTION ══════════════╗

  getOwnerHotels: async (ownerId: string): Promise<(Hotel & { rooms: Room[] })[]> => {
    return apiFetch<(Hotel & { rooms: Room[] })[]>(`/hotels/owner/${ownerId}`);
  },

  getOwnerDashboardStats: async (hotelId: string): Promise<{
    totalBookings: number; totalRevenue: number; avgRating: number; occupancyRate: number;
    recentBookings: Booking[]; revenueByMonth: { month: string; revenue: number }[];
  }> => {
    const [bookingsData, hotel] = await Promise.all([
      apiFetch<any>(`/bookings/hotel/${hotelId}`),
      apiFetch<Hotel>(`/hotels/${hotelId}`),
    ]);
    const bookings: Booking[] = Array.isArray(bookingsData) ? bookingsData : bookingsData.bookings ?? [];
    const confirmed = bookings.filter(b => b.status === 'CONFIRMED');
    const totalRevenue = confirmed.reduce((s, b) => s + b.totalPrice, 0);
    return {
      totalBookings: bookings.length,
      totalRevenue,
      avgRating: hotel.rating || 0,
      occupancyRate: 0,
      recentBookings: bookings.slice(0, 5),
      revenueByMonth: [],
    };
  },

  getOwnerWallet: async (id: string): Promise<{ totalBalance: number; transactions: WalletTransaction[] }> => {
    try {
      const res = await apiFetch<any>(`/admin/wallet/${id}`);
      if (res && typeof res.totalBalance === 'number') {
        return res;
      }
      // Fallback to bookings calculation if needed
      const bRes = await apiFetch<any>(`/bookings/hotel/${id}`);
      const bookings: Booking[] = Array.isArray(bRes) ? bRes : bRes.bookings ?? [];
      const confirmed = bookings.filter(b => b.status === 'CONFIRMED');
      const balance = confirmed.reduce((s, b) => s + b.totalPrice, 0);
      return { totalBalance: balance, transactions: [] };
    } catch {
      return { totalBalance: 0, transactions: [] };
    }
  },

  getHotelWallet: async (hotelId: string): Promise<{ totalBalance: number; transactions: WalletTransaction[] }> => {
    try {
      const res = await apiFetch<any>(`/admin/wallet/${hotelId}`);
      if (res && typeof res.totalBalance === 'number') {
        return res;
      }
      const bRes = await apiFetch<any>(`/bookings/hotel/${hotelId}`);
      const bookings: Booking[] = Array.isArray(bRes) ? bRes : bRes.bookings ?? [];
      const confirmed = bookings.filter(b => b.status === 'CONFIRMED');
      const balance = confirmed.reduce((s, b) => s + b.totalPrice, 0);
      return { totalBalance: balance, transactions: [] };
    } catch {
      return { totalBalance: 0, transactions: [] };
    }
  },

  requestPayout: async (payload: { hotelId: string; amount: number; method: string; account: string }): Promise<any> => {
    return apiFetch('/admin/wallet/payout', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  addRoom: async (room: Omit<Room, "id" | "createdAt" | "updatedAt">): Promise<Room> => {
    let created: Room;
    try {
      created = await apiFetch<Room>('/rooms', { method: 'POST', body: JSON.stringify(room) });
    } catch (err) {
      console.warn("Backend addRoom failed, using persistent client storage:", err);
      created = {
        ...room,
        id: `room_${Date.now()}_${Math.random().toString(36).substr(2, 7)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Room;
    }
    const fullRoom: Room = {
      ...created,
      hotelName: (room as any).hotelName || (created as any).hotelName || "Sea Pearl Royal Beach Resort",
      hotelCity: (room as any).hotelCity || (created as any).hotelCity || "Cox's Bazar",
      hotelImage: (room as any).hotelImage || (created as any).hotelImage || (created.images?.[0] || ""),
    };
    saveLocalRoom(fullRoom);
    return fullRoom;
  },

  updateRoom: async (roomId: string, updates: Partial<Room>): Promise<Room | null> => {
    let updated: Room | null = null;
    try {
      updated = await apiFetch<Room>(`/rooms/${roomId}`, { method: 'PATCH', body: JSON.stringify(updates) });
    } catch {}
    const local = getLocalRooms();
    const existing = local.find(r => r.id === roomId);
    if (existing) {
      const merged = { ...existing, ...updates, updatedAt: new Date().toISOString() };
      saveLocalRoom(merged);
      if (!updated) updated = merged;
    } else if (updated) {
      saveLocalRoom(updated);
    }
    return updated;
  },

  deleteRoom: async (roomId: string): Promise<boolean> => {
    try {
      await apiFetch(`/rooms/${roomId}`, { method: 'DELETE' });
    } catch {}
    removeLocalRoom(roomId);
    return true;
  },

  getOwnerAds: async (ownerId: string): Promise<Advertisement[]> => {
    try {
      return await apiFetch<Advertisement[]>('/admin/ads');
    } catch { return []; }
  },

  // ╔══════════════ ADMIN SECTION ══════════════╗

  getAllUsers: async (): Promise<(UserProfile | HotelOwner)[]> => {
    const data = await apiFetch<any[]>('/users');
    return data.map(u => ({ ...u, id: u._id || u.id }));
  },

  updateUserStatus: async (userId: string, status: UserStatus): Promise<UserProfile | HotelOwner | null> => {
    try {
      const data = await apiFetch<any>(`/users/${userId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
      return { ...data, id: data._id || data.id };
    } catch { return null; }
  },

  updateUserRole: async (userId: string, role: UserRole): Promise<UserProfile | HotelOwner | null> => {
    try {
      const data = await apiFetch<any>(`/users/${userId}`, { method: 'PATCH', body: JSON.stringify({ role }) });
      return { ...data, id: data._id || data.id };
    } catch { return null; }
  },

  grantAdminOverride: async (ownerId: string): Promise<HotelOwner | null> => {
    try {
      const data = await apiFetch<any>(`/users/${ownerId}`, { method: 'PATCH', body: JSON.stringify({ hasAdminOverride: true }) });
      return { ...data, id: data._id || data.id };
    } catch { return null; }
  },

  extendSubscription: async (ownerId: string, months: number): Promise<HotelOwner | null> => {
    try {
      const owner = await apiFetch<any>(`/users/${ownerId}`);
      const currentEnd = owner.subscriptionEndDate ? new Date(owner.subscriptionEndDate) : new Date();
      currentEnd.setMonth(currentEnd.getMonth() + months);
      const data = await apiFetch<any>(`/users/${ownerId}`, { method: 'PATCH', body: JSON.stringify({ subscriptionEndDate: currentEnd.toISOString() }) });
      return { ...data, id: data._id || data.id };
    } catch { return null; }
  },

  updateVerificationStatus: async (ownerId: string, status: VerificationStatus): Promise<HotelOwner | null> => {
    try {
      const data = await apiFetch<any>(`/users/${ownerId}`, { method: 'PATCH', body: JSON.stringify({ verificationStatus: status }) });
      return { ...data, id: data._id || data.id };
    } catch { return null; }
  },

  getAllHotels: async (): Promise<Hotel[]> => {
    return apiFetch<Hotel[]>('/hotels/all');
  },

  addHotel: async (payload: Omit<Hotel, "id" | "createdAt" | "updatedAt" | "isVerified" | "isRedMarked" | "isActive" | "amenities" | "images" | "rating" | "totalReviews"> & Partial<Pick<Hotel, "isVerified" | "isRedMarked" | "isActive" | "amenities" | "images" | "rating" | "totalReviews" | "mapUrl">>): Promise<Hotel> => {
    return apiFetch<Hotel>('/hotels', { method: 'POST', body: JSON.stringify(payload) });
  },

  createHotel: async (payload: any): Promise<Hotel> => {
    return apiFetch<Hotel>('/hotels', { method: 'POST', body: JSON.stringify(payload) });
  },

  updateHotel: async (hotelId: string, updates: Partial<Hotel>): Promise<Hotel | null> => {
    try {
      return await apiFetch<Hotel>(`/hotels/${hotelId}`, { method: 'PATCH', body: JSON.stringify(updates) });
    } catch { return null; }
  },

  deleteHotel: async (hotelId: string): Promise<boolean> => {
    try { await apiFetch(`/hotels/${hotelId}`, { method: 'DELETE' }); return true; } catch { return false; }
  },

  getAllRooms: async (): Promise<(Room & { hotelName: string; hotelCity?: string; hotelImage?: string })[]> => {
    let serverRooms: (Room & { hotelName: string; hotelCity?: string; hotelImage?: string })[] = [];
    try {
      serverRooms = await apiFetch<(Room & { hotelName: string; hotelCity?: string; hotelImage?: string })[]>('/rooms');
    } catch {}
    const local = getLocalRooms();
    const map = new Map<string, Room & { hotelName: string; hotelCity?: string; hotelImage?: string }>();
    const seenTitles = new Set<string>();

    const makeKey = (hName: string, rType: string) =>
      `${(hName || '').toLowerCase().trim()}:::${(rType || '').toLowerCase().trim()}`;

    // 1. First add server rooms (from live database)
    (serverRooms || []).forEach(r => {
      const hName = r.hotelName || "StayBD Partner Hotel";
      const key = makeKey(hName, r.type);
      seenTitles.add(key);
      map.set(r.id, {
        ...r,
        hotelName: hName,
        hotelCity: r.hotelCity || "Cox's Bazar",
        hotelImage: r.hotelImage || r.images?.[0] || ""
      });
    });

    // 2. Overlay local rooms (offline cache and new uploads)
    local.forEach(r => {
      const hName = r.hotelName || "Sea Pearl Royal Beach Resort";
      const key = makeKey(hName, r.type);

      // If server already returned this room and local is a demo fallback id, skip
      if (seenTitles.has(key) && r.id.startsWith('room_sp_')) {
        return;
      }

      if (map.has(r.id)) {
        const existing = map.get(r.id)!;
        map.set(r.id, {
          ...r,
          ...existing,
          hotelName: existing.hotelName || hName,
          hotelCity: existing.hotelCity || r.hotelCity || "Cox's Bazar",
          hotelImage: existing.hotelImage || r.hotelImage || r.images?.[0] || ""
        });
      } else {
        seenTitles.add(key);
        map.set(r.id, {
          ...r,
          hotelName: hName,
          hotelCity: r.hotelCity || "Cox's Bazar",
          hotelImage: r.hotelImage || r.images?.[0] || ""
        });
      }
    });

    const combined = Array.from(map.values());
    // 3. Strictly sort newest first so any added room appears right at the beginning
    combined.sort((a, b) => {
      const timeA = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const timeB = new Date(b.updatedAt || b.createdAt || 0).getTime();
      return timeB - timeA;
    });

    return combined;
  },

  toggleRedMark: async (hotelId: string): Promise<Hotel | null> => {
    try { return await apiFetch<Hotel>(`/hotels/${hotelId}/redmark`, { method: 'PATCH' }); } catch { return null; }
  },

  toggleHotelActive: async (hotelId: string): Promise<Hotel | null> => {
    try { return await apiFetch<Hotel>(`/hotels/${hotelId}/active`, { method: 'PATCH' }); } catch { return null; }
  },

  addOwner: async (payload: { name: string; email: string; avatar?: string }): Promise<HotelOwner> => {
    const body = { ...payload, role: 'OWNER', status: 'ACTIVE', verificationStatus: 'PENDING', subscriptionEndDate: new Date(Date.now() + 30 * 86400000).toISOString(), hasAdminOverride: false };
    const data = await apiFetch<any>('/users', { method: 'POST', body: JSON.stringify(body) });
    return { ...data, id: data._id || data.id };
  },

  onboardOwner: async (payload: {
    name: string;
    email: string;
    phone?: string;
    password?: string;
    nidNumber?: string;
    nidDocUrl?: string;
    tradeLicenseNumber?: string;
    hotelAuthDocUrl?: string;
    hotelName?: string;
    city?: string;
    address?: string;
    hotelCategory?: string;
    hotelDescription?: string;
    hotelImage?: string;
    amenities?: string[];
    initialRoom?: {
      type: string;
      category?: string;
      pricePerNight: number;
      totalInventory: number;
      floorNumber?: number;
      roomNumber?: string;
    };
    commissionRate?: number;
    verificationStatus?: "VERIFIED" | "PENDING";
  }): Promise<{ success: boolean; owner: HotelOwner; hotel: Hotel; room: Room; message: string }> => {
    return apiFetch<{ success: boolean; owner: HotelOwner; hotel: Hotel; room: Room; message: string }>('/admin/onboard-owner', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  addUser: async (payload: { name: string; email: string; avatar?: string }): Promise<UserProfile> => {
    const body = { ...payload, role: 'USER', status: 'ACTIVE' };
    const data = await apiFetch<any>('/users', { method: 'POST', body: JSON.stringify(body) });
    return { ...data, id: data._id || data.id };
  },

  getAllBookings: async (): Promise<Booking[]> => {
    return apiFetch<Booking[]>('/bookings');
  },

  getCurrentUser: async (userId: string): Promise<UserProfile | HotelOwner | null> => {
    try {
      const data = await apiFetch<any>(`/users/${userId}`);
      return { ...data, id: data._id || data.id };
    } catch { return null; }
  },

  getAllReviews: async (): Promise<Review[]> => {
    return apiFetch<Review[]>('/reviews');
  },

  getAllAds: async (): Promise<Advertisement[]> => {
    return apiFetch<Advertisement[]>('/admin/ads');
  },

  getAdminStats: async () => {
    return apiFetch<{
      totalUsers: number; totalHotels: number; totalBookings: number;
      totalRooms: number; totalReviews: number; totalRevenue: number;
    }>('/admin/stats');
  },

  // ╔══════════════ AVAILABILITY CALENDAR ══════════════╗

  getRoomCalendar: async (roomId: string, year: number, month: number): Promise<CalendarDay[]> => {
    return apiFetch<CalendarDay[]>(`/rooms/${roomId}/calendar?year=${year}&month=${month}`);
  },

  getCalendarDays: async (hotelId: string, roomId?: string): Promise<CalendarDay[]> => {
    const d = new Date();
    return apiFetch<CalendarDay[]>(`/rooms/${roomId || hotelId}/calendar?year=${d.getFullYear()}&month=${d.getMonth() + 1}`);
  },

  // ╔══════════════ HOUSEKEEPING ══════════════╗

  getHousekeepingTasks: async (hotelId: string): Promise<HousekeepingTask[]> => {
    return apiFetch<HousekeepingTask[]>(`/admin/housekeeping/${hotelId}`);
  },

  updateRoomStatus: async (taskId: string, status: RoomStatus, notes?: string): Promise<HousekeepingTask | null> => {
    try {
      return await apiFetch<HousekeepingTask>(`/admin/housekeeping/${taskId}`, {
        method: 'PATCH', body: JSON.stringify({ status, notes }),
      });
    } catch { return null; }
  },

  // ╔══════════════ CHECK-IN / CHECK-OUT ══════════════╗

  processCheckIn: async (bookingId: string): Promise<Booking | null> => {
    try {
      return await apiFetch<Booking>(`/bookings/${bookingId}/checkin`, { method: 'PATCH' });
    } catch { return null; }
  },

  processCheckOut: async (bookingId: string): Promise<Booking | null> => {
    try {
      return await apiFetch<Booking>(`/bookings/${bookingId}/checkout`, { method: 'PATCH' });
    } catch { return null; }
  },

  // ╔══════════════ NOTIFICATIONS ══════════════╗

  getNotifications: async (recipientId: string): Promise<Notification[]> => {
    const res = await apiFetch<any>(`/notifications/${recipientId}`);
    return Array.isArray(res) ? res : res.notifications ?? [];
  },

  markNotificationRead: async (notifId: string): Promise<void> => {
    await apiFetch(`/notifications/${notifId}/read`, { method: 'PATCH' });
  },

  markAllNotificationsRead: async (recipientId: string): Promise<void> => {
    await apiFetch(`/notifications/read-all/${recipientId}`, { method: 'PATCH' });
  },

  // ╔══════════════ GUEST PROFILES (CRM) ══════════════╗

  getGuestProfiles: async (hotelId: string): Promise<GuestProfile[]> => {
    return apiFetch<GuestProfile[]>(`/admin/guests/${hotelId}`);
  },

  getHotelGuestProfiles: async (hotelId: string): Promise<GuestProfile[]> => {
    return apiFetch<GuestProfile[]>(`/admin/guests/${hotelId}`);
  },

  // ╔══════════════ OCCUPANCY REPORT ══════════════╗

  getOccupancyReportByMonth: async (hotelId: string, year: number, month: number): Promise<OccupancyReport> => {
    return apiFetch<OccupancyReport>(`/admin/occupancy/${hotelId}?year=${year}&month=${month}`);
  },

  // ╔══════════════ DYNAMIC PRICING ══════════════╗

  getPricingRules: async (hotelId: string): Promise<DynamicPricingRule[]> => {
    return apiFetch<DynamicPricingRule[]>(`/admin/pricing/${hotelId}`);
  },

  addPricingRule: async (rule: Omit<DynamicPricingRule, "id">): Promise<DynamicPricingRule> => {
    return apiFetch<DynamicPricingRule>('/admin/pricing', { method: 'POST', body: JSON.stringify(rule) });
  },

  deletePricingRule: async (ruleId: string): Promise<boolean> => {
    try { await apiFetch(`/admin/pricing/${ruleId}`, { method: 'DELETE' }); return true; } catch { return false; }
  },

  togglePricingRule: async (ruleId: string): Promise<DynamicPricingRule | null> => {
    try {
      return await apiFetch<DynamicPricingRule>(`/admin/pricing/${ruleId}/toggle`, { method: 'PATCH' });
    } catch { return null; }
  },

  getEffectivePrice: async (roomId: string, checkIn: string): Promise<{ basePrice: number; effectivePrice: number; activeRule?: DynamicPricingRule }> => {
    try {
      const room = await apiFetch<Room>(`/rooms/${roomId}`.replace('/hotel/', '/'));
      // For now just return base price; pricing rules applied client-side like before
      return { basePrice: room?.pricePerNight || 0, effectivePrice: room?.pricePerNight || 0 };
    } catch {
      return { basePrice: 0, effectivePrice: 0 };
    }
  },

  // ╔══════════════ RATE MANAGEMENT ══════════════╗

  updateRoomPrice: async (roomId: string, newPrice: number): Promise<Room | null> => {
    let updated: Room | null = null;
    try {
      updated = await apiFetch<Room>(`/rooms/${roomId}/price`, { method: 'PATCH', body: JSON.stringify({ pricePerNight: newPrice }) });
    } catch {}
    const local = getLocalRooms();
    const existing = local.find(r => r.id === roomId);
    if (existing) {
      const merged = { ...existing, pricePerNight: newPrice, updatedAt: new Date().toISOString() };
      saveLocalRoom(merged);
      if (!updated) updated = merged;
    }
    return updated;
  },

  updateRoomInventory: async (roomId: string, totalInventory: number, availableCount: number): Promise<Room | null> => {
    let updated: Room | null = null;
    try {
      updated = await apiFetch<Room>(`/rooms/${roomId}/inventory`, { method: 'PATCH', body: JSON.stringify({ totalInventory, availableCount }) });
    } catch {}
    const local = getLocalRooms();
    const existing = local.find(r => r.id === roomId);
    if (existing) {
      const merged = { ...existing, totalInventory, availableCount, updatedAt: new Date().toISOString() };
      saveLocalRoom(merged);
      if (!updated) updated = merged;
    }
    return updated;
  },

  updateRoomDiscount: async (roomId: string, discountPrice: number | null): Promise<Room | null> => {
    let updated: Room | null = null;
    try {
      updated = await apiFetch<Room>(`/rooms/${roomId}/discount`, { method: 'PATCH', body: JSON.stringify({ discountPrice }) });
    } catch {}
    const local = getLocalRooms();
    const existing = local.find(r => r.id === roomId);
    if (existing) {
      const merged = { ...existing, discountPrice: discountPrice || undefined, updatedAt: new Date().toISOString() };
      saveLocalRoom(merged);
      if (!updated) updated = merged;
    }
    return updated;
  },

  cancelBooking: async (bookingId: string): Promise<Booking | null> => {
    try {
      return await apiFetch<Booking>(`/bookings/${bookingId}/cancel`, { method: 'PATCH' });
    } catch { return null; }
  },

  // ╔══════════════ EXPERIENCE CARDS ══════════════╗

  getExperiences: async (filters?: { city?: string; isActive?: boolean }): Promise<ExperienceCard[]> => {
    const params = new URLSearchParams();
    if (filters?.city) params.set('city', filters.city);
    if (filters?.isActive !== undefined) params.set('isActive', String(filters.isActive));
    const q = params.toString();
    return apiFetch<ExperienceCard[]>(`/experiences${q ? `?${q}` : ''}`);
  },

  getOwnerExperiences: async (ownerId: string): Promise<ExperienceCard[]> => {
    return apiFetch<ExperienceCard[]>(`/experiences?ownerId=${ownerId}`);
  },

  addExperience: async (payload: Omit<ExperienceCard, "id" | "createdAt" | "updatedAt">): Promise<ExperienceCard> => {
    return apiFetch<ExperienceCard>('/experiences', { method: 'POST', body: JSON.stringify(payload) });
  },

  updateExperience: async (expId: string, updates: Partial<ExperienceCard>): Promise<ExperienceCard | null> => {
    try {
      return await apiFetch<ExperienceCard>(`/experiences/${expId}`, { method: 'PATCH', body: JSON.stringify(updates) });
    } catch { return null; }
  },

  deleteExperience: async (expId: string): Promise<boolean> => {
    try { await apiFetch(`/experiences/${expId}`, { method: 'DELETE' }); return true; } catch { return false; }
  },

  toggleExperienceActive: async (expId: string): Promise<ExperienceCard | null> => {
    try { return await apiFetch<ExperienceCard>(`/experiences/${expId}/active`, { method: 'PATCH' }); } catch { return null; }
  },

  toggleExperienceSoldOut: async (expId: string): Promise<ExperienceCard | null> => {
    try { return await apiFetch<ExperienceCard>(`/experiences/${expId}/soldout`, { method: 'PATCH' }); } catch { return null; }
  },

  // ── Experience: Get Single ────────────────────────────────
  getExperienceById: async (expId: string): Promise<ExperienceCard | null> => {
    try { return await apiFetch<ExperienceCard>(`/experiences/${expId}`); } catch { return null; }
  },

  // ── Experience: Advanced Search ───────────────────────────
  searchExperiences: async (filters?: {
    city?: string; category?: string; tag?: string;
    minPrice?: number; maxPrice?: number; minRating?: number;
    query?: string; sortBy?: "recommended" | "rating" | "price_asc" | "price_desc" | "newest";
  }): Promise<ExperienceCard[]> => {
    const params = new URLSearchParams();
    if (filters?.city) params.set('city', filters.city);
    if (filters?.category) params.set('category', filters.category);
    if (filters?.tag) params.set('tag', filters.tag);
    if (filters?.minPrice !== undefined) params.set('minPrice', String(filters.minPrice));
    if (filters?.maxPrice !== undefined) params.set('maxPrice', String(filters.maxPrice));
    if (filters?.minRating !== undefined) params.set('minRating', String(filters.minRating));
    if (filters?.query) params.set('query', filters.query);
    if (filters?.sortBy) params.set('sortBy', filters.sortBy);
    const q = params.toString();
    return apiFetch<ExperienceCard[]>(`/experiences${q ? `?${q}` : ''}`);
  },

  // ── Experience: Book ──────────────────────────────────────
  bookExperience: async (payload: {
    experienceId: string; userId: string; userName: string; userEmail: string;
    date: string; guests: number; paymentMethod?: "card" | "bkash" | "cash";
  }): Promise<ExperienceBooking> => {
    return apiFetch<ExperienceBooking>(`/experiences/${payload.experienceId}/book`, {
      method: 'POST', body: JSON.stringify(payload),
    });
  },

  getExperienceBookings: async (userId: string): Promise<ExperienceBooking[]> => {
    return apiFetch<ExperienceBooking[]>(`/experiences/bookings/${userId}`);
  },

  // ── Experience: Reviews ───────────────────────────────────
  getExperienceReviews: async (experienceId: string): Promise<ExperienceReview[]> => {
    return apiFetch<ExperienceReview[]>(`/experiences/${experienceId}/reviews`);
  },

  addExperienceReview: async (payload: Omit<ExperienceReview, "id" | "createdAt">): Promise<ExperienceReview> => {
    return apiFetch<ExperienceReview>(`/experiences/${payload.experienceId}/reviews`, {
      method: 'POST', body: JSON.stringify(payload),
    });
  },

  // ── Wishlist ──────────────────────────────────────────────
  getWishlist: async (): Promise<string[]> => {
    // Wishlist remains client-side (localStorage) — no backend needed
    try {
      return JSON.parse(localStorage.getItem('sb_wishlist') || '[]');
    } catch { return []; }
  },

  toggleWishlist: async (experienceId: string): Promise<boolean> => {
    const list: string[] = JSON.parse(localStorage.getItem('sb_wishlist') || '[]');
    const idx = list.indexOf(experienceId);
    if (idx >= 0) { list.splice(idx, 1); } else { list.push(experienceId); }
    localStorage.setItem('sb_wishlist', JSON.stringify(list));
    return idx < 0; // true if added
  },

  // ── Complaints ────────────────────────────────────────────
  submitComplaint: async (payload: Omit<Complaint, "id" | "status" | "createdAt" | "updatedAt">): Promise<Complaint> => {
    return apiFetch<Complaint>('/complaints/create', { method: 'POST', body: JSON.stringify(payload) });
  },

  getAdminComplaints: async (): Promise<Complaint[]> => {
    return apiFetch<Complaint[]>('/complaints/admin-all');
  },

  updateComplaintStatus: async (id: string, status: "Pending" | "In Progress" | "Resolved"): Promise<Complaint> => {
    return apiFetch<Complaint>(`/complaints/${id}/status`, {
      method: 'PATCH', body: JSON.stringify({ status }),
    });
  },

  // ── Extra Services ────────────────────────────────────────

  getHotelServices: async (hotelId: string): Promise<{ services: HotelService[]; grouped: Record<ServiceCategory, HotelService[]> }> => {
    const data = await apiFetch<{ success: boolean; count: number; data: any[]; grouped: any }>(`/services/${hotelId}`);
    const services = (data.data || []).map((s: any) => ({ ...s, id: s._id || s.id, hotelId: s.hotel || s.hotelId }));
    return { services, grouped: data.grouped || {} };
  },

  submitServiceRequest: async (payload: {
    userId: string; bookingId: string; hotelId: string;
    serviceId: string; requestedDateTime: string; specialNotes?: string;
  }): Promise<ServiceRequest> => {
    const data = await apiFetch<{ success: boolean; data: any }>('/services/request', {
      method: 'POST', body: JSON.stringify(payload),
    });
    return data.data;
  },

  getMyServiceRequests: async (bookingId: string, userId: string): Promise<ServiceRequest[]> => {
    const data = await apiFetch<{ success: boolean; data: any[] }>(`/services/my-requests/${bookingId}?userId=${userId}`);
    return data.data || [];
  },

  updateServiceRequestStatus: async (id: string, status: ServiceRequestStatus, hotelNotes?: string): Promise<ServiceRequest> => {
    const data = await apiFetch<{ success: boolean; data: any }>(`/services/request/${id}/status`, {
      method: 'PATCH', body: JSON.stringify({ status, hotelNotes }),
    });
    return data.data;
  },

  getHotelServiceRequests: async (hotelId: string): Promise<ServiceRequest[]> => {
    const data = await apiFetch<{ success: boolean; data: any[] }>(`/services/hotel-requests/${hotelId}`);
    return data.data || [];
  },
};
