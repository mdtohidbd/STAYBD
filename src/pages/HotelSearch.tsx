import { useEffect, useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  MapPin, Star, SlidersHorizontal, Search, Loader2,
  CheckCircle2, AlertTriangle, Tag, X, Heart,
  List, LayoutGrid, Sparkles, Users, Calendar,
  ChevronRight, ChevronLeft
} from "lucide-react";
import { api, Hotel, Room } from "../services/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import ExperiencesAISection from "@/components/ExperiencesAISection";
import SidebarFilter, { FilterState } from "@/components/SidebarFilter";
import { useSearch } from "@/context/SearchContext";

type HotelWithRooms = Hotel & { rooms: Room[] };

function getCategoryForHotel(h: Hotel): string {
  if (h.rating >= 4.5) return "Luxury";
  if (h.rating >= 4.0) return "Boutique";
  return "Budget";
}

// ─────────────── HotelCard Component ───────────────
interface HotelCardProps {
  hotel: HotelWithRooms;
  cheapest: number;
  originalPrice?: number;
  isWished: boolean;
  onToggleWishlist: (id: string) => void;
  hasOffer: boolean;
  starCount: number;
  category: string;
}

const DEFAULT_FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
];

const HotelCard = ({
  hotel, cheapest, originalPrice, isWished, onToggleWishlist, hasOffer, starCount, category
}: HotelCardProps) => {
  const navigate = useNavigate();
  const { search } = useSearch();
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  // Clean and sanitize images
  const safeImages = useMemo(() => {
    if (!hotel.images || hotel.images.length === 0) return DEFAULT_FALLBACK_IMAGES;
    const cleaned = hotel.images.map((img) => {
      if (
        !img ||
        img.includes("fixtq7dx5qlhlzewy2wn") ||
        img.includes("skybridgesystems") ||
        img.includes("undefined")
      ) {
        return "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800";
      }
      return img;
    });
    return cleaned.length > 0 ? cleaned : DEFAULT_FALLBACK_IMAGES;
  }, [hotel.images]);

  const nextImg = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIdx((prev) => (prev + 1) % safeImages.length);
  };

  const prevImg = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIdx((prev) => (prev - 1 + safeImages.length) % safeImages.length);
  };

  const adultsPerRoom = Math.ceil(search.adults / search.rooms);
  const childrenPerRoom = Math.ceil(search.children / search.rooms);

  const recommendedRoom = (hotel.rooms || []).find(r =>
    (r.maxAdults || 2) >= adultsPerRoom && (r.maxChildren || 0) >= childrenPerRoom
  ) || (hotel.rooms && hotel.rooms.length > 0 ? hotel.rooms[0] : null);

  const getWordScore = (score: number) => {
    if (score >= 4.8) return "Exceptional";
    if (score >= 4.5) return "Superb";
    if (score >= 4.0) return "Fabulous";
    if (score >= 3.5) return "Very Good";
    return "Good";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.3 }}
      onClick={() => navigate(`/property/${hotel.id}`)}
      className="group relative bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-2xl hover:border-emerald-500/40 transition-all duration-300 overflow-hidden flex flex-col md:flex-row cursor-pointer"
    >
      {/* ── IMAGE SECTION WITH CAROUSEL ── */}
      <div className="relative w-full md:w-80 h-60 md:h-auto shrink-0 overflow-hidden bg-slate-900">
        <img
          src={safeImages[currentImgIdx] || safeImages[0]}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800";
          }}
        />

        {/* Dark subtle gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25 pointer-events-none" />

        {/* Carousel Prev/Next Buttons */}
        {safeImages.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={prevImg}
              aria-label="Previous Image"
              className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md transition-transform active:scale-90"
            >
              ‹
            </button>
            <button
              onClick={nextImg}
              aria-label="Next Image"
              className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md transition-transform active:scale-90"
            >
              ›
            </button>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {hotel.isVerified && (
            <div className="bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-xl shadow-md flex items-center gap-1 uppercase tracking-wider">
              <CheckCircle2 className="w-3 h-3" /> Verified Partner
            </div>
          )}
          {hasOffer && (
            <div className="bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[10px] font-black px-2.5 py-1 rounded-xl shadow-md flex items-center gap-1 uppercase tracking-wider">
              <Tag className="w-3 h-3" /> Flash Deal
            </div>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(hotel.id); }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full backdrop-blur-md border flex items-center justify-center transition-all duration-300 z-10 ${
            isWished
              ? "bg-rose-500 border-rose-400 text-white shadow-lg shadow-rose-500/30 scale-110"
              : "bg-black/30 border-white/30 text-white hover:bg-white hover:text-rose-500"
          }`}
        >
          <Heart className={`w-4 h-4 ${isWished ? "fill-current" : ""}`} />
        </button>

        {/* Image Dots Indicator */}
        {safeImages.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none">
            {safeImages.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentImgIdx ? "w-5 bg-white shadow-sm" : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── DETAILS SECTION ── */}
      <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
        <div>
          {/* Rating & Category Header */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="bg-slate-100 text-slate-800 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">
                {category}
              </span>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < starCount ? "fill-amber-400 text-amber-400" : "text-slate-200"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Booking.com Score Pill */}
            <div className="flex items-center gap-2">
              <div className="text-right hidden sm:block">
                <span className="text-xs font-black text-slate-900 block leading-none">
                  {getWordScore(hotel.rating)}
                </span>
                <span className="text-[10px] text-slate-400 font-bold">
                  {hotel.totalReviews} verified reviews
                </span>
              </div>
              <div className="bg-slate-900 text-white text-xs font-black px-2.5 py-1.5 rounded-xl shadow-xs">
                {hotel.rating.toFixed(1)}
              </div>
            </div>
          </div>

          {/* Hotel Name & Location */}
          <div className="mb-3">
            <h3 className="text-xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors tracking-tight leading-snug mb-1">
              {hotel.name}
            </h3>
            <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{hotel.city}, {hotel.address}</span>
            </div>
          </div>

          {/* Booking.com & Agoda Style Trust Perks */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Free Cancellation (24h)
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
              <Sparkles className="w-3 h-3 text-blue-600" />
              bKash / Nagad Instant
            </span>
            {recommendedRoom && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-100">
                <LayoutGrid className="w-3 h-3 text-purple-600" />
                {recommendedRoom.type}
              </span>
            )}
          </div>

          {/* Amenities Badges */}
          <div className="flex flex-wrap items-center gap-1.5">
            {(hotel.amenities || []).slice(0, 4).map(a => (
              <span key={a} className="bg-slate-50 text-slate-600 text-[10px] font-semibold px-2.5 py-1 rounded-md border border-slate-200/60">
                {a}
              </span>
            ))}
            {(hotel.amenities || []).length > 4 && (
              <span className="text-[10px] text-slate-400 font-bold">
                +{(hotel.amenities || []).length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="pt-4 border-t border-slate-100 flex items-end justify-between gap-4 mt-4">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Price per night
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                ৳{cheapest.toLocaleString()}
              </span>
              {originalPrice && originalPrice > cheapest && (
                <span className="text-sm text-slate-400 line-through font-bold">
                  ৳{originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">
              Includes all taxes & fees
            </span>
          </div>

          <button
            onClick={() => navigate(`/property/${hotel.id}`)}
            className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/20 active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
          >
            <span>Select Room</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const FilterChip = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
  <span className="inline-flex items-center gap-1 bg-indigo-50 border border-indigo-100 text-indigo-600 text-[11px] font-black px-3 py-1.5 rounded-full shadow-sm">
    {label}
    <button onClick={onRemove} className="hover:text-indigo-800 transition-colors"><X className="w-3 h-3" /></button>
  </span>
);

// ═══════════════ MAIN COMPONENT ═══════════════
export default function HotelSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { search: globalSearch, updateSearch: updateGlobalSearch } = useSearch();

  const [hotels, setHotels] = useState<HotelWithRooms[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [offerHotelIds, setOfferHotelIds] = useState<Set<string>>(new Set());
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // ── Filter State synchronized with URL (now merging with global search) ──
  const filters: FilterState = useMemo(() => {
    const qParam = searchParams.get("q") || searchParams.get("destination") || globalSearch.q || "";
    const priceParam = searchParams.get("price");
    const minPriceParam = searchParams.get("minPrice");
    const maxPriceParam = searchParams.get("maxPrice");

    let priceRange: [number, number] = [100, 100000];
    if (priceParam) {
      const parts = priceParam.split(",").map(Number);
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        priceRange = [parts[0], parts[1]];
      }
    } else if (minPriceParam || maxPriceParam) {
      priceRange = [
        minPriceParam ? Math.max(100, Number(minPriceParam)) : 100,
        maxPriceParam ? Number(maxPriceParam) : 100000,
      ];
    }

    return {
      searchQuery: qParam,
      checkIn: searchParams.get("checkIn") || globalSearch.checkIn || "",
      checkOut: searchParams.get("checkOut") || globalSearch.checkOut || "",
      adults: parseInt(searchParams.get("adults") || globalSearch.adults.toString()),
      children: parseInt(searchParams.get("children") || globalSearch.children.toString()),
      roomsCount: parseInt(searchParams.get("rooms") || globalSearch.rooms.toString()),
      priceRange,
      stars: searchParams.get("stars")?.split(",").map(Number).filter(n => !isNaN(n)) || [],
      roomTypes: searchParams.get("types")?.split(",").filter(Boolean) || [],
      amenities: searchParams.get("amenities")?.split(",").filter(Boolean) || [],
      category: searchParams.get("category") || undefined,
      sortBy: (searchParams.get("sort") as any) || "rating",
      hasOffers: searchParams.get("offers") === "true",
      payAtHotel: searchParams.get("payAtHotel") === "true",
      petsAllowed: searchParams.get("pets") === "true" || globalSearch.petsAllowed,
    };
  }, [searchParams, globalSearch]);

  const updateFilters = (patch: Partial<FilterState>) => {
    const next = { ...filters, ...patch };
    const params = new URLSearchParams();
    if (next.searchQuery) params.set('q', next.searchQuery);
    if (next.checkIn) params.set('checkIn', next.checkIn);
    if (next.checkOut) params.set('checkOut', next.checkOut);
    params.set('adults', next.adults.toString());
    params.set('children', next.children.toString());
    params.set('rooms', next.roomsCount.toString());
    if (next.priceRange[0] !== 100 || next.priceRange[1] !== 100000)
      params.set('price', next.priceRange.join(","));
    if (next.stars.length) params.set('stars', next.stars.join(","));
    if (next.roomTypes.length) params.set('types', next.roomTypes.join(","));
    if (next.amenities.length) params.set('amenities', next.amenities.join(","));
    if (next.category) params.set('category', next.category);
    if (next.hasOffers) params.set('offers', "true");
    if (next.payAtHotel) params.set('payAtHotel', "true");
    if (next.petsAllowed) params.set('pets', "true");
    params.set('sort', next.sortBy);
    setSearchParams(params, { replace: true });

    // Also sync the "Big 3" back to global search context
    updateGlobalSearch({
      q: next.searchQuery,
      checkIn: next.checkIn,
      checkOut: next.checkOut,
      adults: next.adults,
      children: next.children,
      rooms: next.roomsCount,
      petsAllowed: next.petsAllowed
    });
  };

  // ── Data Fetching ──
  useEffect(() => {
    setLoading(true);
    // Verified by backend: passing search params to the API
    Promise.all([
      api.searchHotels({
        q: filters.searchQuery,
        checkIn: filters.checkIn,
        checkOut: filters.checkOut,
        adults: filters.adults,
        children: filters.children,
        roomsCount: filters.roomsCount,
        showRedMarked: true
      }),
      api.getOffers?.() ?? Promise.resolve([]),
    ]).then(([res, offers]) => {
      setHotels(res.hotels as HotelWithRooms[]);
      const ids = new Set<string>((offers as any[]).filter((o: any) => o.isActive).map((o: any) => o.hotelId as string));
      setOfferHotelIds(ids);
    }).finally(() => setLoading(false));
  }, [filters.searchQuery, filters.checkIn, filters.checkOut, filters.adults, filters.children, filters.roomsCount]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        undefined,
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
  }, []);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("sb_wishlist") || "[]");
      setWishlist(Array.isArray(stored) ? stored : []);
    } catch { setWishlist([]); }
  }, []);

  const toggleWishlist = (id: string) => {
    const next = wishlist.includes(id) ? wishlist.filter(x => x !== id) : [...wishlist, id];
    setWishlist(next);
    localStorage.setItem("sb_wishlist", JSON.stringify(next));
  };

const DESTINATION_CITY_MAP: Record<string, string[]> = {
  "cox's bazar": ["cox's bazar", "chittagong"],
  "coxs bazar": ["cox's bazar", "chittagong"],
  "cox": ["cox's bazar"],
  "sylhet": ["sylhet", "moulvibazar", "habiganj"],
  "sreemangal": ["sylhet", "moulvibazar"],
  "ratargul": ["sylhet"],
  "tanguar": ["sylhet", "sunamganj"],
  "sajek": ["chittagong", "rangamati", "khagrachhari", "cox's bazar"],
  "bandarban": ["chittagong", "bandarban", "cox's bazar"],
  "nilgiri": ["chittagong", "bandarban", "cox's bazar"],
  "saint martin": ["cox's bazar", "chittagong"],
  "kuakata": ["barisal", "patuakhali", "khulna"],
  "sundarbans": ["khulna", "bagerhat"],
  "dhaka": ["dhaka", "gazipur", "narayanganj"],
  "gazipur": ["dhaka", "gazipur"],
  "paharpur": ["rajshahi", "naogaon", "bogra", "dhaka"],
  "somapura": ["rajshahi", "naogaon", "bogra", "dhaka"],
  "bagerhat": ["khulna", "bagerhat"],
};

  // ── Filter Logic ──
  const filtered = useMemo(() => {
    let result = hotels.filter(h => {
      if (!h.isActive || (!h.isVerified && !h.isRedMarked)) return false;

      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase().trim().replace(/['’]/g, '');
        const words = q.split(/\s+/).filter(w => w.length > 1);
        const textToSearch = `${h.name} ${h.city} ${h.address} ${h.description || ""}`.toLowerCase().replace(/['’]/g, '');
        
        let match = textToSearch.includes(q) || (words.length > 0 && words.some(w => textToSearch.includes(w)));
        
        // Smart tourist spot alias fallback
        if (!match) {
          for (const [spotKeyword, allowedCities] of Object.entries(DESTINATION_CITY_MAP)) {
            const cleanSpot = spotKeyword.replace(/['’]/g, '');
            if (q.includes(cleanSpot) || cleanSpot.includes(q)) {
              if (allowedCities.some(city => textToSearch.includes(city.replace(/['’]/g, '')))) {
                match = true;
                break;
              }
            }
          }
        }

        if (!match) return false;
      }

      const roomRates = (h.rooms || []).map(r => r.discountPrice || r.pricePerNight).filter(Boolean);
      const cheapestRoomRate = roomRates.length > 0 ? Math.min(...roomRates) : 1200;
      if (cheapestRoomRate < filters.priceRange[0] || (filters.priceRange[1] < 100000 && cheapestRoomRate > filters.priceRange[1])) return false;

      if (filters.stars.length > 0) {
        const matched = filters.stars.some(s => {
          if (s === 5) return h.rating >= 4.5;
          if (s === 4) return h.rating >= 3.5 && h.rating < 4.5;
          return h.rating < 3.5;
        });
        if (!matched) return false;
      }

      if (filters.roomTypes.length > 0) {
        const hasType = filters.roomTypes.some(rt => h.rooms.some(r => r.type === rt));
        if (!hasType) return false;
      }

      if (filters.amenities.length > 0) {
        const allPresent = filters.amenities.every(a => h.amenities.some(ha => ha.toLowerCase() === a.toLowerCase()));
        if (!allPresent) return false;
      }

      if (filters.category) {
        if (getCategoryForHotel(h) !== filters.category) return false;
      }

      if (filters.hasOffers && !offerHotelIds.has(h.id)) return false;
      if (filters.payAtHotel) {
        const accepted = (h.acceptedPayments || []).map(p => p.toLowerCase());
        if (!accepted.some(p => p.includes("cash"))) return false;
      }

      // Guest validation (only filter if strict capacity is requested)
      if (filters.adults > 2 || filters.children > 0) {
        const adultsPerRoom = Math.ceil(filters.adults / filters.roomsCount);
        const childrenPerRoom = Math.ceil(filters.children / filters.roomsCount);
        const hasValidRoom = (h.rooms || []).some(r => {
          const fits = (r.maxAdults || 2) >= adultsPerRoom && (r.maxChildren || 0) >= childrenPerRoom;
          const petCheck = filters.petsAllowed ? !!r.petsAllowed : true;
          return fits && petCheck;
        });
        if (h.rooms && h.rooms.length > 0 && !hasValidRoom) return false;
      }

      return true;
    });

    // ── Sort ──
    if (filters.sortBy === "price_low") {
      result.sort((a, b) => Math.min(...a.rooms.map(r => r.discountPrice || r.pricePerNight)) - Math.min(...b.rooms.map(r => r.discountPrice || r.pricePerNight)));
    } else if (filters.sortBy === "price_high") {
      result.sort((a, b) => Math.min(...b.rooms.map(r => r.discountPrice || r.pricePerNight)) - Math.min(...a.rooms.map(r => r.discountPrice || r.pricePerNight)));
    } else if (filters.sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (filters.sortBy === "near_me" && userLocation) {
      const dist = (h: Hotel) => Math.sqrt(Math.pow(h.locationLat - userLocation.lat, 2) + Math.pow(h.locationLng - userLocation.lng, 2));
      result.sort((a, b) => dist(a) - dist(b));
    }
    return result;
  }, [hotels, filters, offerHotelIds, userLocation]);

  // ── Label Counts ──
  const countHotelsWithStar = (s: number) => hotels.filter(h => s === 5 ? h.rating >= 4.5 : s === 4 ? h.rating >= 3.5 && h.rating < 4.5 : h.rating < 3.5).length;
  const countHotelsWithRoomType = (rt: string) => hotels.filter(h => h.rooms.some(r => r.type === rt)).length;
  const countHotelsWithAmenity = (a: string) => hotels.filter(h => h.amenities.some(ha => ha.toLowerCase() === a.toLowerCase())).length;

  // ── Active Chips ──
  const activeChips: { label: string; remove: () => void }[] = [];
  if (filters.searchQuery) activeChips.push({ label: `"${filters.searchQuery}"`, remove: () => updateFilters({ searchQuery: "" }) });
  if (filters.priceRange[0] !== 100 || filters.priceRange[1] !== 100000) activeChips.push({ label: `৳${filters.priceRange[0]} - ৳${filters.priceRange[1]}`, remove: () => updateFilters({ priceRange: [100, 100000] }) });
  filters.stars.forEach(s => activeChips.push({ label: `${s}★`, remove: () => updateFilters({ stars: filters.stars.filter(x => x !== s) }) }));
  filters.roomTypes.forEach(rt => activeChips.push({ label: rt, remove: () => updateFilters({ roomTypes: filters.roomTypes.filter(x => x !== rt) }) }));
  filters.amenities.forEach(a => activeChips.push({ label: a, remove: () => updateFilters({ amenities: filters.amenities.filter(x => x !== a) }) }));
  if (filters.hasOffers) activeChips.push({ label: "Hot Deals", remove: () => updateFilters({ hasOffers: false }) });
  if (filters.petsAllowed) activeChips.push({ label: "🐾 Pets", remove: () => updateFilters({ petsAllowed: false }) });

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="container mx-auto px-4 py-6 lg:py-10 max-w-[1400px]">

        {/* Search Bar Header */}
        <div className="mb-8 hidden lg:block">
          <SearchBar />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className={`${isFilterOpen ? "block" : "hidden lg:block"} shrink-0`}>
            <SidebarFilter
              filters={filters}
              onChange={updateFilters}
              hotelCounts={{
                stars: countHotelsWithStar,
                roomTypes: countHotelsWithRoomType,
                amenities: countHotelsWithAmenity
              }}
              onReset={() => setSearchParams(new URLSearchParams(), { replace: true })}
            />
          </div>

          {/* Results */}
          <div className="flex-1 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {loading ? "Searching properties…" : `${filtered.length} properties found`}
              </h1>

              <div className="relative">
                <div
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-2xl border border-slate-200 cursor-pointer shadow-sm hover:border-indigo-300 transition-all font-bold text-sm"
                >
                  <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                  <span>Sort: {filters.sortBy.replace("_", " ")}</span>
                </div>
                {isSortOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50">
                    {["near_me", "rating", "price_low", "price_high"].map(id => (
                      <button
                        key={id}
                        onClick={() => { updateFilters({ sortBy: id }); setIsSortOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold capitalize ${filters.sortBy === id ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:bg-slate-50"}`}
                      >
                        {id.replace("_", " ")}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-2 bg-indigo-500/[0.03] border border-indigo-500/10 p-4 rounded-[2rem]">
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-slate-200 shadow-sm text-[11px] font-black text-slate-800 uppercase tracking-tighter">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                {filters.searchQuery || "All Locations"}
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-slate-200 shadow-sm text-[11px] font-black text-slate-800 uppercase tracking-tighter">
                <Users className="w-3.5 h-3.5 text-indigo-500" />
                {filters.adults} Adults · {filters.children} Children
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-slate-200 shadow-sm text-[11px] font-black text-slate-800 uppercase tracking-tighter">
                <LayoutGrid className="w-3.5 h-3.5 text-emerald-500" />
                {filters.roomsCount} Rooms
              </div>
              {filters.checkIn && filters.checkOut && (
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-slate-200 shadow-sm text-[11px] font-black text-slate-800 uppercase tracking-tighter">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  {filters.checkIn} — {filters.checkOut}
                </div>
              )}
            </div>

            {/* Chips */}
            {activeChips.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {activeChips.map((chip, i) => <FilterChip key={i} label={chip.label} onRemove={chip.remove} />)}
              </div>
            )}

            {/* List */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
                <p className="font-bold text-slate-600 uppercase tracking-widest text-xs">Accessing Satellite Data...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
                <Search className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-800">No properties match</h3>
                <Button variant="ghost" className="mt-4 text-indigo-600" onClick={() => updateFilters({ searchQuery: "" })}>Clear search</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filtered.map(hotel => {
                  const cheapest = Math.min(...hotel.rooms.map(r => r.discountPrice || r.pricePerNight));
                  return (
                    <HotelCard
                      key={hotel.id}
                      hotel={hotel}
                      cheapest={cheapest}
                      isWished={wishlist.includes(hotel.id)}
                      onToggleWishlist={toggleWishlist}
                      hasOffer={offerHotelIds.has(hotel.id)}
                      starCount={hotel.rating >= 4.5 ? 5 : hotel.rating >= 3.5 ? 4 : 3}
                      category={getCategoryForHotel(hotel)}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="mt-16">
          <ExperiencesAISection />
        </div>
      </main>
      <Footer />
    </div>
  );
}
