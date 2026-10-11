/**
 * ExperiencesAISection.tsx — Premium AI-Powered Travel Experiences & Activities Section
 * Inspired by Airbnb Experiences, GetYourGuide, Klook, and Wanderlog AI.
 * 
 * Key Highlights:
 *  - AI Travel Intent & Mood Matcher (Interactive Vibe Pills)
 *  - AI Prompt Assistant Bar with 1-click prompt filters & dynamic AI match scores
 *  - "Regenerate AI Picks" dynamic shuffle with micro-animations
 *  - Photo carousel with dots & arrows right on each card
 *  - Quick View AI Preview Modal with guest counter & dynamic price calculation
 *  - Interactive Wishlist (Heart toggle) with local persistence
 *  - Resilient Data Layer: Live backend integration with rich authentic Bangladesh fallbacks
 *  - 100% Bilingual Support (English & Bangla)
 */

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star,
  MapPin,
  Clock,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Heart,
  Share2,
  ShieldCheck,
  Flame,
  Utensils,
  Mountain,
  Compass,
  Waves,
  Palette,
  Search,
  Eye,
  CheckCircle2,
  Users,
  Calendar,
  X,
  RefreshCw,
  Award,
  Zap,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api, ExperienceCard } from "../services/api";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// ─────────────────────────────────────────────────────────────────────────────
// 1. RICH CURATED DATA (10 Authentic Bangladesh Experiences)
// ─────────────────────────────────────────────────────────────────────────────
export interface CuratedExperience extends ExperienceCard {
  vibe: "nature" | "beach" | "adventure" | "food" | "art" | "all";
  matchScore: number;
  bestTime?: string;
}

const FALLBACK_CURATED_EXPERIENCES: CuratedExperience[] = [
  {
    id: "exp-sylhet-tea",
    ownerId: "owner-1",
    title: "Sylhet Misty Tea Estate Walk & Master Tasting",
    description: "Walk through rolling emerald tea gardens at dawn in Sreemangal. Pluck fresh two-leaves-and-a-bud with local pluckers, visit a century-old processing plant, and experience a guided tasting of 7 distinct single-estate flushes including rare white tea.",
    city: "Sylhet",
    location: "Sreemangal, Sylhet",
    meetingPoint: "Grand Sultan Tea Resort Main Gate, Sreemangal",
    price: 1850,
    rating: 4.98,
    reviews: 142,
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=1200&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1597916829826-02e5bb4a54e0?w=1200&auto=format&fit=crop&q=80"
    ],
    badge: "StayBD Original",
    category: "original",
    tags: ["Nature", "Cultural", "Food & Drink"],
    highlights: ["Small intimate group (max 8)", "Taste 7 distinct single-estate flushes", "Hands-on tea plucking experience", "Fresh homemade bakarkhani & snacks"],
    duration: "3.5 hours",
    maxGuests: 8,
    spokenLanguages: ["English", "Bangla", "Sylheti"],
    whatIncludes: ["Tea plantation entry permits", "7-course master tea tasting", "Fresh Sylheti snacks & sweets", "Souvenir tin of handpicked tea"],
    hostName: "Tanvir Hasan",
    hostImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300",
    hostBio: "3rd-generation Sylheti tea planter and certified international tea sommelier with 12+ years sharing agro-heritage.",
    cancellationPolicy: "Free cancellation up to 24 hours before start.",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    vibe: "nature",
    matchScore: 99,
    bestTime: "Morning 7:00 AM"
  },
  {
    id: "exp-sundarbans-boat",
    ownerId: "owner-2",
    title: "Sundarbans Silent Mangrove Boat Safari & Wildlife Trail",
    description: "Embark on an eco-friendly silent wooden boat expedition through narrow tidal canals of the world’s largest mangrove forest. Spot spotted deer, estuarine crocodiles, kingfishers, and rare Irrawaddy dolphins led by a licensed forest ranger.",
    city: "Khulna",
    location: "Sundarbans Mangrove, Khulna",
    meetingPoint: "Mongla Port Ghat #2, Bagerhat",
    price: 3600,
    rating: 4.98,
    reviews: 218,
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80"
    ],
    badge: "Bestseller",
    category: "original",
    tags: ["Adventure", "Nature", "Outdoor"],
    highlights: ["Licensed armed forest guard escort", "Silent wooden boat in canal networks", "Hot organic fish/veg lunch on board", "Dolphin & deer spotting guarantee"],
    duration: "6 hours",
    maxGuests: 10,
    spokenLanguages: ["English", "Bangla"],
    whatIncludes: ["Official Sundarbans Forest permits", "Traditional wooden engine boat & fuel", "Fresh local lunch & tender coconut", "Wildlife binoculars"],
    hostName: "Capt. Mizanur Rahman",
    hostImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
    hostBio: "Born and raised on the fringes of the Sundarbans; 18 years guiding international wildlife researchers.",
    cancellationPolicy: "Free cancellation up to 48 hours before.",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    vibe: "nature",
    matchScore: 97,
    bestTime: "Early Dawn 6:30 AM"
  },
  {
    id: "exp-dhaka-kacchi",
    ownerId: "owner-3",
    title: "Old Dhaka Midnight Kacchi & Secret Heritage Food Trail",
    description: "Immerse your senses in 400-year-old Mughal culinary traditions. Wander through the atmospheric historic alleys of Nazira Bazar and Shankhari Bazar, sampling legendary slow-cooked Dum Kacchi Biryani, fiery Bakarkhani, Morog Polao, Beauty Lassi, and Labang.",
    city: "Dhaka",
    location: "Puran Dhaka, Dhaka",
    meetingPoint: "Ahsan Manzil (Pink Palace) Front Gate, Sadarghat",
    price: 1500,
    rating: 4.96,
    reviews: 340,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1200&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80"
    ],
    badge: "Foodie Choice",
    category: "original",
    tags: ["Food & Drink", "Cultural", "Outdoor"],
    highlights: ["7 authentic heritage food tastings", "Secret alleyways & historic stories", "Rickshaw ride through Old Dhaka included", "Vegetarian adaptations available"],
    duration: "3 hours",
    maxGuests: 6,
    spokenLanguages: ["English", "Bangla", "Dhakaiya Urdu"],
    whatIncludes: ["All food & drinks across 7 curated culinary stops", "Traditional cycle rickshaw rides", "Filtered water and hygiene wipes", "Old Dhaka spice gift pouch"],
    hostName: "Sultana & Farhan",
    hostImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300",
    hostBio: "Old Dhaka native culinary storytellers featured on BBC Travel and National Geographic food documentaries.",
    cancellationPolicy: "Free cancellation up to 12 hours before.",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    vibe: "food",
    matchScore: 98,
    bestTime: "Evening 6:30 PM"
  },
  {
    id: "exp-cox-surfing",
    ownerId: "owner-4",
    title: "Cox’s Bazar Golden Sunset Surfing & Marine Drive Open Jeep",
    description: "Learn to catch the waves of the world’s longest natural sea beach with certified ISA instructors at Inani. Followed by a scenic open-jeep drive along the majestic Marine Drive cliffside to a hidden bay for tender coconut & beachside sunset.",
    city: "Cox's Bazar",
    location: "Inani Beach & Marine Drive, Cox's Bazar",
    meetingPoint: "Inani Royal Tulip Beach Access, Cox's Bazar",
    price: 2800,
    rating: 4.94,
    reviews: 185,
    image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=1200&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80"
    ],
    badge: "Popular Thrill",
    category: "original",
    tags: ["Adventure", "Outdoor", "Beach"],
    highlights: ["All surfboard & safety equipment included", "GoPro 4K action photos & videos included", "Open jeep ride down Marine Drive", "Beginners welcome — 100% standing guarantee"],
    duration: "4 hours",
    maxGuests: 6,
    spokenLanguages: ["English", "Bangla"],
    whatIncludes: ["Surfboard & protective wetsuit/rashguard", "1-on-1 coaching by certified surf lifesaver", "GoPro HD photos & video edits", "Fresh beach coconuts and refreshments"],
    hostName: "Jafar Surf Academy",
    hostImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300",
    hostBio: "Bangladesh’s pioneer surf champion who represented the nation in international championships.",
    cancellationPolicy: "Free cancellation up to 24 hours before.",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    vibe: "beach",
    matchScore: 96,
    bestTime: "Sunset 3:30 PM"
  },
  {
    id: "exp-sajek-cloud",
    ownerId: "owner-5",
    title: "Sajek Valley Cloud Peak Trek & Indigenous Bamboo Feast",
    description: "Wake up above the clouds in the majestic hills of Sajek. Hike to the highest vantage point of Konglak Pahar, experience traditional Chakma and Lusai tribal hospitality, and learn how to cook slow-roasted chicken inside natural green bamboo over wood coals.",
    city: "Rangamati",
    location: "Sajek Valley, Rangamati",
    meetingPoint: "Ruilui Para Helipad, Sajek Valley",
    price: 2400,
    rating: 4.96,
    reviews: 172,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1511497584788-87676104235f?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&auto=format&fit=crop&q=80"
    ],
    badge: "StayBD Original",
    category: "original",
    tags: ["Nature", "Adventure", "Cultural"],
    highlights: ["Spectacular Konglak Peak sunrise above clouds", "Authentic tribal bamboo cooking workshop", "Traditional Lusai welcome ceremony", "Small intimate group (max 8)"],
    duration: "5 hours",
    maxGuests: 8,
    spokenLanguages: ["English", "Bangla", "Chakma"],
    whatIncludes: ["Konglak hill entry permit", "Indigenous bamboo chicken feast & organic sticky rice", "Local tribal guide & storyteller", "Herbal highland tea"],
    hostName: "Chanchal Chakma",
    hostImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300",
    hostBio: "Indigenous community leader and eco-tourism pioneer dedicated to preserving indigenous highland culture.",
    cancellationPolicy: "Free cancellation up to 48 hours before.",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    vibe: "adventure",
    matchScore: 98,
    bestTime: "Sunrise 5:30 AM"
  },
  {
    id: "exp-unesco-rickshaw",
    ownerId: "owner-6",
    title: "UNESCO Living Heritage: Rickshaw Art & Folk Painting Studio",
    description: "Celebrate Bangladesh’s newly recognized UNESCO Intangible Cultural Heritage! Step into an authentic artisan studio in Dhaka and learn the vibrant techniques of Rickshaw painting from a 40-year master craftsman. Create and paint your own personalized metal plate.",
    city: "Dhaka",
    location: "Mirpur Artists Enclave, Dhaka",
    meetingPoint: "Mirpur 10 Circle Metro Station Exit A",
    price: 1350,
    rating: 4.92,
    reviews: 104,
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1200&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1460661419200-fd435f017d8d?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&auto=format&fit=crop&q=80"
    ],
    badge: "Craft & Art",
    category: "original",
    tags: ["Art", "Cultural", "Wellness"],
    highlights: ["Take home your own painted metallic rickshaw art plaque", "Hands-on instruction from a legendary Ustad", "All paints, brushes & metal plates included", "Traditional masala chai & sweet samosas served"],
    duration: "2.5 hours",
    maxGuests: 6,
    spokenLanguages: ["English", "Bangla"],
    whatIncludes: ["Custom hand-cut metal sheet for painting", "Vibrant oil & enamel paints", "Protective apron and packaging for travel", "Chai & sweets"],
    hostName: "Ustad Rafiqul Islam",
    hostImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300",
    hostBio: "Master Rickshaw painter who has decorated over 2,000 cycle rickshaws and exhibited in the Victoria and Albert Museum in London.",
    cancellationPolicy: "Free cancellation up to 24 hours before.",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    vibe: "art",
    matchScore: 94,
    bestTime: "Afternoon 2:30 PM"
  },
  {
    id: "exp-bandarban-waterfall",
    ownerId: "owner-7",
    title: "Bandarban Nafakhum Waterfall & Sangu River Canyon Voyage",
    description: "The ultimate river adventure in Bangladesh! Cruise on a wooden country boat through towering stone canyons of the Sangu River from Thanchi to Remakri, followed by an exhilarating trek along rocky jungle streams to the roaring Nafakhum Waterfall.",
    city: "Bandarban",
    location: "Thanchi & Remakri, Bandarban",
    meetingPoint: "Thanchi BGB Camp Ghat, Bandarban",
    price: 3400,
    rating: 4.95,
    reviews: 135,
    image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=1200&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80"
    ],
    badge: "Epic Expedition",
    category: "original",
    tags: ["Adventure", "Nature", "Outdoor"],
    highlights: ["Sangu river gorge wooden boat ride", "Nafakhum waterfall trek & plunge", "Indigenous Marma organic lunch", "Safety life vests provided"],
    duration: "7 hours",
    maxGuests: 6,
    spokenLanguages: ["English", "Bangla", "Marma"],
    whatIncludes: ["Permits and BGB registration clearance", "Wooden boat & skilled helmsman", "Certified indigenous guide", "Traditional hilltop lunch"],
    hostName: "Aung Marma",
    hostImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
    hostBio: "Bandarban high-trail veteran with 10 years of experience escorting eco-trekkers safely through Sangu canyons.",
    cancellationPolicy: "Free cancellation up to 48 hours before.",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    vibe: "adventure",
    matchScore: 97,
    bestTime: "Day Expedition 8:00 AM"
  },
  {
    id: "exp-saint-martin-coral",
    ownerId: "owner-8",
    title: "Saint Martin Island Coral Reef Snorkeling & Kayaking Adventure",
    description: "Explore the only coral island of Bangladesh in crystal-clear azure waters. Snorkel along the living coral colonies of Chera Dwip, encounter vibrant tropical fish, and paddle a sea kayak through gentle ocean waves guided by certified watermen.",
    city: "Cox's Bazar",
    location: "Chera Dwip, Saint Martin's Island",
    meetingPoint: "Saint Martin Ferry Jetty #1",
    price: 2200,
    rating: 4.93,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80"
    ],
    badge: "Island Special",
    category: "original",
    tags: ["Beach", "Outdoor", "Adventure"],
    highlights: ["Sanitized snorkel mask & fins provided", "Guided coral exploration by marine life lover", "Single & double ocean kayaks", "High-definition underwater photography"],
    duration: "3.5 hours",
    maxGuests: 8,
    spokenLanguages: ["English", "Bangla"],
    whatIncludes: ["Complete snorkeling equipment & sanitized mouthpiece", "Kayak rental with safety floaters", "GoPro underwater snapshots", "Fresh coconut water"],
    hostName: "Coral Guardians",
    hostImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300",
    hostBio: "Passionate coastal conservationists and PADI certified divers protecting Saint Martin’s marine ecology.",
    cancellationPolicy: "Free cancellation up to 24 hours before.",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    vibe: "beach",
    matchScore: 95,
    bestTime: "Morning 9:00 AM"
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// 2. VIBE / FILTER TABS
// ─────────────────────────────────────────────────────────────────────────────
interface VibeOption {
  id: "all" | "nature" | "beach" | "adventure" | "food" | "art";
  labelEn: string;
  labelBn: string;
  icon: React.ComponentType<{ className?: string }>;
}

const VIBE_OPTIONS: VibeOption[] = [
  { id: "all", labelEn: "All AI Picks", labelBn: "সবগুলো এআই প্রস্তাবনা", icon: Sparkles },
  { id: "beach", labelEn: "Sunset & Beach", labelBn: "সূর্যাস্ত ও সমুদ্র", icon: Waves },
  { id: "nature", labelEn: "Nature & Greenery", labelBn: "প্রকৃতি ও চা-বাগান", icon: Compass },
  { id: "adventure", labelEn: "Adventure & Treks", labelBn: "অ্যাডভেঞ্চার ও ট্র্যাকিং", icon: Mountain },
  { id: "food", labelEn: "Street Food & Flavors", labelBn: "ঐতিহ্য ও স্ট্রিট ফুড", icon: Utensils },
  { id: "art", labelEn: "Living Culture & Art", labelBn: "ঐতিহ্য ও কারুশিল্প", icon: Palette },
];

const QUICK_AI_PROMPTS = [
  { textEn: "Sunset views under ৳3,000", textBn: "সূর্যাস্ত ও সৈকত ৩,০০০ টাকার মধ্যে", vibe: "beach", query: "sunset" },
  { textEn: "Tea estates & nature trails", textBn: "চা-বাগান ও সাইলেন্ট বোট সাফারি", vibe: "nature", query: "tea" },
  { textEn: "Authentic Old Dhaka food walk", textBn: "পুরান ঢাকার গোপন বিরিয়ানি ও বাকরখানি", vibe: "food", query: "kacchi" },
  { textEn: "Mountain treks above the clouds", textBn: "মেঘের দেশে পাহাড়ের চূড়ায় ট্র্যাকিং", vibe: "adventure", query: "cloud" },
];

// Helper: Normalize price so legacy USD entries never display as ৳16
function formatBDT(price: number): number {
  if (!price || isNaN(price)) return 1500;
  return price < 500 ? Math.round(price * 110) : price;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const ExperiencesAISection: React.FC = () => {
  const { i18n } = useTranslation();
  const isBn = i18n.language?.startsWith("bn");
  const navigate = useNavigate();

  // State
  const [allExperiences, setAllExperiences] = useState<CuratedExperience[]>(FALLBACK_CURATED_EXPERIENCES);
  const [activeVibe, setActiveVibe] = useState<VibeOption["id"]>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [shuffling, setShuffling] = useState(false);
  const [shuffleSeed, setShuffleSeed] = useState(0);

  // Quick View Modal State
  const [previewExp, setPreviewExp] = useState<CuratedExperience | null>(null);
  const [guestCount, setGuestCount] = useState<number>(2);
  const [previewPhotoIdx, setPreviewPhotoIdx] = useState<number>(0);

  // Wishlist State (stored in localStorage)
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("staybd_experience_wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleWishlist = useCallback((id: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setWishlist((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem("staybd_experience_wishlist", JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
  }, []);

  // Fetch from API on mount; gracefully fallback if empty/offline
  useEffect(() => {
    api
      .getExperiences({ isActive: true })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Merge API data with fallbacks so rich details and vibes are always present
          const enhanced: CuratedExperience[] = data.map((item, idx) => {
            const fallback = FALLBACK_CURATED_EXPERIENCES[idx % FALLBACK_CURATED_EXPERIENCES.length];
            return {
              ...fallback,
              ...item,
              id: item.id || fallback.id,
              title: item.title || fallback.title,
              city: item.city || fallback.city,
              price: formatBDT(item.price || fallback.price),
              rating: item.rating || fallback.rating,
              reviews: item.reviews || fallback.reviews,
              image: item.image || item.images?.[0] || fallback.image,
              images: (item.images && item.images.length > 0 ? item.images : fallback.images),
              vibe: (item.tags?.some((t) => /nature/i.test(t))
                ? "nature"
                : item.tags?.some((t) => /food/i.test(t))
                ? "food"
                : item.tags?.some((t) => /adventure/i.test(t))
                ? "adventure"
                : item.tags?.some((t) => /art/i.test(t))
                ? "art"
                : fallback.vibe) as CuratedExperience["vibe"],
              matchScore: Math.floor(94 + Math.random() * 5),
            };
          });
          setAllExperiences(enhanced);
        } else {
          setAllExperiences(FALLBACK_CURATED_EXPERIENCES);
        }
      })
      .catch(() => {
        setAllExperiences(FALLBACK_CURATED_EXPERIENCES);
      });
  }, []);

  // Trigger Shuffle / Re-match
  const handleShuffle = () => {
    setShuffling(true);
    setTimeout(() => {
      setShuffleSeed((prev) => prev + 1);
      setShuffling(false);
    }, 400);
  };

  // Filtered & Sorted items
  const filteredExperiences = useMemo(() => {
    let list = [...allExperiences];

    // Filter by vibe
    if (activeVibe !== "all") {
      list = list.filter((exp) => exp.vibe === activeVibe || exp.tags?.some((t) => t.toLowerCase().includes(activeVibe)));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (exp) =>
          exp.title.toLowerCase().includes(q) ||
          exp.city.toLowerCase().includes(q) ||
          exp.location.toLowerCase().includes(q) ||
          exp.description.toLowerCase().includes(q) ||
          exp.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    // If shuffled, randomize order slightly
    if (shuffleSeed > 0) {
      list = [...list].sort(() => Math.sin(shuffleSeed) - 0.5);
    }

    return list;
  }, [allExperiences, activeVibe, searchQuery, shuffleSeed]);

  return (
    <section className="py-14 w-full">
      {/* ── TOP HEADER & TRUST PILLS ── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div className="space-y-3">
          {/* AI Badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 px-3.5 py-1.5 rounded-full backdrop-blur-md shadow-xs">
            <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse fill-emerald-500/30" />
            <span className="text-[11px] font-black tracking-wider text-emerald-700 uppercase">
              {isBn ? "স্মার্ট এআই ট্রাভেল এক্সপেরিয়েন্স" : "AI-Curated Stay Experiences"}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          </div>

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            {isBn ? "ভ্রমণের সাথে যুক্ত করুন রোমাঞ্চকর অভিজ্ঞতা" : "Extraordinary Activities for Your Stay"}
          </h2>

          <p className="text-slate-600 text-sm md:text-base font-normal max-w-2xl leading-relaxed">
            {isBn
              ? "আপনার অবস্থান ও মুডের সাথে এআই-ম্যাচড স্থানীয় গাইড, রোমাঞ্চকর অ্যাক্টিভিটি এবং ১০০% যাচাইকৃত সেরা অভিজ্ঞতা।"
              : "Handcrafted expeditions, local culinary crawls & nature safaris intelligently matched with your destination."}
          </p>

          {/* Social Proof Trust Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/70 transition-colors px-2.5 py-1 rounded-lg">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              {isBn ? "১০০% ভেরিফাইড লোকাল হোস্ট" : "100% Verified Local Hosts"}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/70 transition-colors px-2.5 py-1 rounded-lg">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500/40" />
              {isBn ? "ইনস্ট্যান্ট কনফার্মেশন" : "Instant Confirmation"}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/70 transition-colors px-2.5 py-1 rounded-lg">
              <Award className="w-3.5 h-3.5 text-indigo-600" />
              {isBn ? "গ্যারান্টিযুক্ত সেরা দাম (BDT)" : "Best Price Guarantee"}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleShuffle}
            disabled={shuffling}
            title={isBn ? "এআই রিকমেন্ডেশন রিফ্রেশ করুন" : "Recalculate AI Matches"}
            className="group flex items-center gap-2 text-xs md:text-sm font-bold text-slate-700 hover:text-emerald-700 transition-all bg-white border border-slate-200 hover:border-emerald-500/40 px-4 py-2.5 rounded-2xl shadow-xs hover:shadow-md active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 transition-transform ${shuffling ? "animate-spin" : "group-hover:rotate-180 duration-500"}`} />
            <span>{isBn ? "এআই রিম্যাচ" : "AI Refresh"}</span>
          </button>

          <button
            onClick={() => navigate("/experiences")}
            className="group flex items-center gap-2 text-xs md:text-sm font-black text-white bg-slate-900 hover:bg-emerald-600 transition-all px-5 py-2.5 rounded-2xl shadow-sm hover:shadow-lg active:scale-95"
          >
            <span>{isBn ? "সকল অভিজ্ঞতা দেখুন" : "Explore All"}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* ── INTERACTIVE AI PROMPT & SEARCH BAR ── */}
      <div className="bg-gradient-to-r from-emerald-50/70 via-teal-50/40 to-slate-50 border border-emerald-100/80 rounded-3xl p-4 md:p-5 mb-8 shadow-xs">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Live Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isBn
                  ? "যে কোনো স্পট, অভিজ্ঞতা বা শহরের নাম লিখে খুঁজুন (যেমন: সুন্দরবন, সূর্যাস্ত, চা বাগান)..."
                  : "Search experiences by activity, spot, or vibe (e.g. sunset, tea garden, kacchi, trek)..."
              }
              className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-200/90 rounded-2xl text-xs md:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* AI Match Stats Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500/40" />
            <span>
              {filteredExperiences.length} {isBn ? "টি স্মার্ট অভিজ্ঞতা প্রস্তুত" : "AI Matches Found"}
            </span>
          </div>
        </div>

        {/* Clickable AI Prompt Suggestions */}
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-emerald-100/60">
          <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-500" />
            {isBn ? "এআই কুইক ফিল্টার:" : "AI Quick Prompts:"}
          </span>
          {QUICK_AI_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveVibe(prompt.vibe as VibeOption["id"]);
                setSearchQuery(prompt.query);
              }}
              className="text-xs font-semibold text-slate-700 hover:text-emerald-700 bg-white/90 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 px-3 py-1 rounded-full transition-all shadow-2xs hover:shadow-xs"
            >
              ✨ {isBn ? prompt.textBn : prompt.textEn}
            </button>
          ))}
        </div>
      </div>

      {/* ── VIBE TABS SELECTOR ── */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-6">
        {VIBE_OPTIONS.map((vibe) => {
          const Icon = vibe.icon;
          const isActive = activeVibe === vibe.id;
          return (
            <button
              key={vibe.id}
              onClick={() => setActiveVibe(vibe.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs md:text-sm font-bold whitespace-nowrap transition-all duration-300 cursor-pointer ${
                isActive
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-[1.02]"
                  : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200/80 shadow-2xs"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-slate-500"}`} />
              <span>{isBn ? vibe.labelBn : vibe.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* ── EXPERIENCES GRID ── */}
      {filteredExperiences.length === 0 ? (
        <div className="bg-slate-50 rounded-3xl p-12 text-center border border-slate-200/80">
          <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 mb-1">
            {isBn ? "কোনো অভিজ্ঞতা পাওয়া যায়নি" : "No Experiences Match Your Filter"}
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            {isBn ? "অনুসন্ধান পরিবর্তন করে আবার চেষ্টা করুন।" : "Try clearing your search query or picking another vibe category."}
          </p>
          <button
            onClick={() => {
              setActiveVibe("all");
              setSearchQuery("");
            }}
            className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl hover:bg-emerald-100 transition-colors"
          >
            {isBn ? "সবগুলো ফিল্টার রিসেট করুন" : "Reset All Filters"}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredExperiences.slice(0, 8).map((exp, idx) => (
              <ExperienceInteractiveCard
                key={exp.id}
                experience={exp}
                index={idx}
                isBn={isBn}
                isWishlisted={wishlist.includes(exp.id)}
                onToggleWishlist={(e) => toggleWishlist(exp.id, e)}
                onOpenPreview={() => {
                  setPreviewExp(exp);
                  setPreviewPhotoIdx(0);
                  setGuestCount(2);
                }}
                onNavigate={() => navigate(`/experiences/${exp.id}`)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* ── QUICK VIEW / DETAILS MODAL ── */}
      <Dialog open={!!previewExp} onOpenChange={(open) => !open && setPreviewExp(null)}>
        <DialogContent className="max-w-2xl sm:max-w-3xl p-0 overflow-hidden rounded-3xl border-0 shadow-2xl">
          {previewExp && (
            <div className="flex flex-col max-h-[85vh] bg-white">
              {/* Modal Header Gallery */}
              <div className="relative aspect-[16/9] w-full bg-slate-900 overflow-hidden">
                <img
                  src={previewExp.images?.[previewPhotoIdx] || previewExp.image}
                  alt={previewExp.title}
                  className="w-full h-full object-cover transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                {/* Close Button is handled by DialogPrimitive, but let's add custom badges */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="bg-emerald-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider">
                    ✨ {previewExp.matchScore}% {isBn ? "এআই ম্যাচ" : "AI Match"}
                  </span>
                  <span className="bg-white/95 backdrop-blur-md text-slate-900 text-[10px] font-black px-3 py-1.5 rounded-full shadow-md uppercase tracking-wider">
                    {previewExp.badge || "StayBD Original"}
                  </span>
                </div>

                {/* Photo Gallery Thumbnail Strip */}
                {previewExp.images && previewExp.images.length > 1 && (
                  <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 overflow-x-auto no-scrollbar">
                    {previewExp.images.map((photo, pIdx) => (
                      <button
                        key={pIdx}
                        onClick={() => setPreviewPhotoIdx(pIdx)}
                        className={`relative w-14 h-10 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                          previewPhotoIdx === pIdx ? "border-emerald-400 scale-105" : "border-white/50 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img src={photo} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-2">
                    <span className="flex items-center gap-1 text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <strong className="text-slate-900">{previewExp.rating}</strong> ({previewExp.reviews} {isBn ? "মতামত" : "reviews"})
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      {previewExp.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      {previewExp.duration || "3-4 hours"}
                    </span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
                    {previewExp.title}
                  </h3>

                  <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                    {previewExp.description}
                  </p>
                </div>

                {/* Highlights */}
                {previewExp.highlights && previewExp.highlights.length > 0 && (
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3">
                      {isBn ? "মূল আকর্ষণসমূহ" : "Experience Highlights"}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {previewExp.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs font-medium text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Host Card */}
                {previewExp.hostName && (
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                    <img
                      src={previewExp.hostImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300"}
                      alt={previewExp.hostName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-slate-900">{previewExp.hostName}</span>
                        <span className="bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                          {isBn ? "ভেরিফাইড হোস্ট" : "Verified Host"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                        {previewExp.hostBio || (isBn ? "অভিজ্ঞ স্থানীয় গাইড ও সংস্কৃতি বিশেষজ্ঞ।" : "Certified local guide and cultural storyteller.")}
                      </p>
                    </div>
                  </div>
                )}

                {/* Inclusions */}
                {previewExp.whatIncludes && previewExp.whatIncludes.length > 0 && (
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                      {isBn ? "যা যা অন্তর্ভুক্ত রয়েছে" : "What's Included"}
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                      {previewExp.whatIncludes.map((inc, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Modal Footer with Live Guest Selector & Price Calculator */}
              <div className="p-4 md:p-6 bg-slate-50 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                      {isBn ? "মোট মূল্য (BDT)" : "Total Price"}
                    </span>
                    <div className="text-xl md:text-2xl font-black text-emerald-700">
                      ৳{(previewExp.price * guestCount).toLocaleString()}
                      <span className="text-xs font-normal text-slate-500 ml-1">
                        ({guestCount} {isBn ? "জন" : "guests"})
                      </span>
                    </div>
                  </div>

                  {/* Guest Stepper */}
                  <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-2 py-1 shadow-2xs">
                    <button
                      onClick={() => setGuestCount((g) => Math.max(1, g - 1))}
                      className="w-7 h-7 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      -
                    </button>
                    <span className="text-xs font-black px-1 text-slate-900">{guestCount}</span>
                    <button
                      onClick={() => setGuestCount((g) => Math.min(previewExp.maxGuests || 10, g + 1))}
                      className="w-7 h-7 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      const id = previewExp.id;
                      setPreviewExp(null);
                      navigate(`/experiences/${id}`);
                    }}
                    className="w-full sm:w-auto flex-1 sm:flex-initial text-center text-xs md:text-sm font-black text-white bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-2xl shadow-md shadow-emerald-600/20 transition-all active:scale-95"
                  >
                    {isBn ? "পূর্ণ বুকিং পেজে যান" : "Proceed to Book"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. INTERACTIVE CARD COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
interface CardProps {
  experience: CuratedExperience;
  index: number;
  isBn: boolean;
  isWishlisted: boolean;
  onToggleWishlist: (e: React.MouseEvent) => void;
  onOpenPreview: () => void;
  onNavigate: () => void;
}

const ExperienceInteractiveCard: React.FC<CardProps> = ({
  experience,
  index,
  isBn,
  isWishlisted,
  onToggleWishlist,
  onOpenPreview,
  onNavigate,
}) => {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const images = experience.images && experience.images.length > 0 ? experience.images : [experience.image];

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onNavigate}
      className="group cursor-pointer bg-white rounded-3xl border border-slate-200/90 hover:border-emerald-500/50 shadow-xs hover:shadow-2xl transition-all duration-500 flex flex-col overflow-hidden"
    >
      {/* ── CARD MEDIA HERO ── */}
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-900">
        <img
          src={images[photoIndex]}
          alt={experience.title}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600";
          }}
        />

        {/* Dynamic Dark Gradient Backdrop */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/35 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
          {/* AI Match Badge */}
          <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md border border-white/20 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md">
            <Sparkles className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span>{experience.matchScore}% Match</span>
          </div>

          {/* Wishlist Heart Button */}
          <button
            onClick={onToggleWishlist}
            aria-label="Save to Wishlist"
            className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/30 flex items-center justify-center transition-transform active:scale-75 cursor-pointer"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isWishlisted ? "fill-red-500 text-red-500 scale-110" : "text-white"
              }`}
            />
          </button>
        </div>

        {/* In-Card Photo Carousel Arrows on Hover */}
        {isHovered && images.length > 1 && (
          <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none z-10">
            <button
              onClick={handlePrevPhoto}
              className="pointer-events-auto w-7 h-7 rounded-full bg-white/90 hover:bg-white text-slate-900 shadow-md flex items-center justify-center transition-transform active:scale-90"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextPhoto}
              className="pointer-events-auto w-7 h-7 rounded-full bg-white/90 hover:bg-white text-slate-900 shadow-md flex items-center justify-center transition-transform active:scale-90"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Carousel Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-1 z-10 pointer-events-none">
            {images.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  photoIndex === i ? "w-4 bg-white" : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        )}

        {/* Bottom Media Metadata Chip */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-end justify-between z-10 pointer-events-none">
          <div className="bg-black/50 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-xl text-white">
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-300">
              {isBn ? "জনপ্রতি শুরু" : "From"}
            </p>
            <p className="text-base font-black text-amber-300 leading-tight">
              ৳{experience.price.toLocaleString()}
            </p>
          </div>

          {experience.bestTime && (
            <div className="bg-emerald-950/70 backdrop-blur-md border border-emerald-400/30 text-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-lg">
              {experience.bestTime}
            </div>
          )}
        </div>
      </div>

      {/* ── CARD CONTENT BODY ── */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating & City Location */}
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-xs font-black text-slate-900">{experience.rating}</span>
            </div>
            <span className="text-slate-400 text-xs font-semibold">({experience.reviews})</span>
            <span className="text-slate-300">•</span>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide truncate">
              {experience.city}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-black text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug text-sm md:text-[15px] mb-2.5">
            {experience.title}
          </h3>

          {/* Micro Highlight Pills */}
          <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500 mb-3">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>{experience.duration || "3 hours"}</span>
            </div>
            <div className="flex items-center gap-1 truncate">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{experience.location.split(",")[0]}</span>
            </div>
          </div>
        </div>

        {/* Host Avatar & Quick View Button */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
          {/* Host pill */}
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={experience.hostImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
              alt=""
              className="w-5 h-5 rounded-full object-cover shrink-0 border border-slate-200"
            />
            <span className="text-[11px] font-bold text-slate-600 truncate">
              {experience.hostName?.split(" ")[0] || (isBn ? "হোস্ট" : "Host")}
            </span>
          </div>

          {/* Quick Preview Flyout Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenPreview();
            }}
            className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
          >
            <Eye className="w-3 h-3" />
            <span>{isBn ? "ঝলক" : "Quick View"}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ExperiencesAISection;
