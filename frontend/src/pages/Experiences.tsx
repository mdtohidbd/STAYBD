/**
 * Experiences Page — Curated Discoveries & Activities Across Bangladesh
 * Inspired by Airbnb Experiences, GetYourGuide, and Klook.
 * Features:
 *  - Modern hero banner with trust badges and statistics
 *  - Responsive search, city filter, category chips, and price sliders (BDT calibrated)
 *  - High-res photo carousels with arrow navigation and pagination dots
 *  - Verified local host badges, ratings, durations, and group sizes
 *  - Accurate BDT pricing (no raw USD or ৳16 display)
 *  - "StayBD Originals" and "Guided Expeditions" sections
 *  - Trust & Quality guarantee section
 */
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Star, Heart, MapPin, Clock, Users, Loader2,
  ChevronLeft, ChevronRight, Search, SlidersHorizontal,
  ArrowUpDown, Globe2, Sparkles, ShieldCheck, CheckCircle2,
  Compass, X, Award, Flame, Utensils, Mountain,
  BadgeCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api, ExperienceCard } from "../services/api";
import { useTranslation } from "react-i18next";

// ── Categories with icons & styles ──────────────────────────────────────────
const CATEGORIES = [
  { label: "All Experiences", value: "All",         icon: "✨" },
  { label: "Cultural & Heritage", value: "Cultural", icon: "🏛️" },
  { label: "Food & Culinary",   value: "Food & Drink", icon: "🍽️" },
  { label: "Adventure & Treks", value: "Adventure",  icon: "🧗" },
  { label: "Art & Craft",       value: "Art",        icon: "🎨" },
  { label: "Nature & Wildlife", value: "Nature",     icon: "🌿" },
  { label: "Outdoor & Water",   value: "Outdoor",    icon: "🌊" },
  { label: "Wellness & Peace",  value: "Wellness",   icon: "🧘" },
];

const SORT_OPTIONS = [
  { label: "Recommended",        value: "recommended" },
  { label: "Top Rated (4.9+)",   value: "rating" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Newest",             value: "newest" },
] as const;

// Helper: Normalize price so legacy USD entries never display as ৳16
export function formatExperiencePrice(price: number): number {
  if (!price || isNaN(price)) return 1500;
  return price < 500 ? Math.round(price * 110) : price;
}

// ── Card Photo Carousel ──────────────────────────────────────────────────────
function CardCarousel({ images, title }: { images: string[]; title: string }) {
  const [idx, setIdx] = useState(0);
  const [hovered, setHovered] = useState(false);
  const fallbackImg = "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800";
  const all = images.length > 0 ? images : [fallbackImg];

  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIdx(i => (i - 1 + all.length) % all.length);
  };

  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIdx(i => (i + 1) % all.length);
  };

  return (
    <div
      className="relative w-full aspect-[4/5] overflow-hidden rounded-3xl bg-slate-900 group/carousel"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={idx}
          src={all[idx]}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.6 }}
          transition={{ duration: 0.25 }}
          onError={e => {
            (e.target as HTMLImageElement).src = fallbackImg;
          }}
        />
      </AnimatePresence>

      {/* Subtle overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30 pointer-events-none" />

      {/* Left/Right carousel arrows on hover */}
      {hovered && all.length > 1 && (
        <>
          {idx > 0 && (
            <button
              onClick={prev}
              aria-label="Previous photo"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/95 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg z-20 hover:scale-110 active:scale-95 transition-all"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}
          {idx < all.length - 1 && (
            <button
              onClick={next}
              aria-label="Next photo"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/95 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg z-20 hover:scale-110 active:scale-95 transition-all"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}
        </>
      )}

      {/* Pagination dots */}
      {all.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 pointer-events-none">
          {all.map((_, i) => (
            <span
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i === idx ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Experience Card Component ────────────────────────────────────────────────
function ExperienceCardUI({
  exp,
  isWishlisted,
  onToggleWishlist,
}: {
  exp: ExperienceCard;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
}) {
  const navigate = useNavigate();
  const allImages = exp.images && exp.images.length > 0 ? exp.images : [exp.image];
  const priceBDT = formatExperiencePrice(exp.price);

  // Badge icon selector
  const getBadgeIcon = (badge?: string) => {
    if (!badge) return null;
    const lower = badge.toLowerCase();
    if (lower.includes("original") || lower.includes("bespoke")) return <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />;
    if (lower.includes("bestseller") || lower.includes("popular")) return <Flame className="w-3 h-3 text-rose-500 fill-rose-500" />;
    if (lower.includes("food")) return <Utensils className="w-3 h-3 text-orange-500" />;
    if (lower.includes("top")) return <Award className="w-3 h-3 text-emerald-500" />;
    return <Sparkles className="w-3 h-3 text-indigo-500" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group cursor-pointer flex flex-col bg-white rounded-3xl p-2.5 border border-slate-100 hover:border-slate-300/80 shadow-xs hover:shadow-xl transition-all duration-300"
      onClick={() => navigate(`/experiences/${exp.id}`)}
    >
      {/* Visual media container */}
      <div className="relative mb-3.5">
        <CardCarousel images={allImages} title={exp.title} />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 z-20 flex flex-col gap-1.5 pointer-events-none">
          {exp.badge && !exp.isSoldOut && (
            <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-black text-slate-900 shadow-md border border-white/60 tracking-tight">
              {getBadgeIcon(exp.badge)}
              {exp.badge}
            </span>
          )}
        </div>

        {/* Sold out overlay */}
        {exp.isSoldOut && (
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] z-20 flex items-center justify-center rounded-3xl pointer-events-none">
            <span className="bg-rose-600 text-white font-black uppercase tracking-widest px-4 py-2 rounded-xl text-xs shadow-2xl border-2 border-rose-400 rotate-[-8deg]">
              Fully Booked
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={e => {
            e.stopPropagation();
            onToggleWishlist(exp.id);
          }}
          aria-label="Save experience"
          className="absolute top-3.5 right-3.5 z-20 w-9 h-9 rounded-full bg-black/30 backdrop-blur-md hover:bg-white hover:text-rose-500 flex items-center justify-center transition-all duration-300 group/heart"
        >
          <Heart
            className={`w-4 h-4 transition-transform duration-300 group-hover/heart:scale-110 ${
              isWishlisted
                ? "fill-rose-500 text-rose-500"
                : "text-white stroke-[2.2] fill-transparent"
            }`}
          />
        </button>

        {/* Bottom media overlays: Duration & Max Guests */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5 z-20 flex items-center justify-between text-white text-[11px] font-semibold pointer-events-none">
          {exp.duration && (
            <span className="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
              <Clock className="w-3 h-3 text-amber-300" />
              {exp.duration}
            </span>
          )}
          {exp.maxGuests && (
            <span className="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
              <Users className="w-3 h-3 text-cyan-300" />
              Max {exp.maxGuests}
            </span>
          )}
        </div>
      </div>

      {/* Information Area */}
      <div className="px-1.5 pb-1.5 flex flex-col flex-1 justify-between space-y-2">
        <div className="space-y-1.5">
          {/* Rating, Reviews and City */}
          <div className="flex items-center gap-1.5 text-xs">
            <div className="flex items-center gap-1 font-black text-slate-900">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
              <span>{exp.rating.toFixed(2)}</span>
            </div>
            <span className="text-slate-400 font-medium">({exp.reviews})</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 font-semibold truncate flex items-center gap-0.5">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              {exp.city}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-slate-900 group-hover:text-rose-600 transition-colors line-clamp-2 text-sm leading-snug">
            {exp.title}
          </h3>

          {/* Host attribution */}
          {exp.hostName && (
            <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1 truncate">
              <BadgeCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Hosted by <strong className="text-slate-700 font-bold">{exp.hostName}</strong></span>
            </p>
          )}

          {/* Tags */}
          {exp.tags && exp.tags.length > 0 && (
            <div className="flex gap-1.5 flex-wrap pt-0.5">
              {exp.tags.slice(0, 2).map(tag => (
                <span
                  key={tag}
                  className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Pricing & CTA */}
        <div className="flex items-baseline justify-between pt-2 border-t border-slate-100 mt-2">
          <div>
            <span className="text-xs text-slate-400 font-medium mr-1">From</span>
            <span className="text-base font-black text-slate-900">
              ৳{priceBDT.toLocaleString()}
            </span>
            <span className="text-slate-500 text-xs font-normal"> / guest</span>
          </div>

          <span className="text-xs font-black text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
            Book <ChevronRight className="w-3 h-3 stroke-[2.5]" />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Page Component ───────────────────────────────────────────────────────
const Experiences = () => {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language?.startsWith("bn");

  const [allExp, setAllExp] = useState<ExperienceCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Filter states
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [city, setCity] = useState("All");
  const [sortBy, setSortBy] = useState<"recommended" | "rating" | "price_asc" | "price_desc" | "newest">("recommended");
  const [maxPrice, setMaxPrice] = useState(6000);
  const [onlyOriginals, setOnlyOriginals] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Initial load
  useEffect(() => {
    let alive = true;
    api.getExperiences({ isActive: true })
      .then(data => {
        if (alive) {
          setAllExp(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (alive) setLoading(false);
      });

    api.getWishlist().then(setWishlist).catch(() => {});

    const handler = () => {
      api.getExperiences({ isActive: true }).then(data => {
        if (alive) setAllExp(data);
      });
    };
    window.addEventListener("sb:data_changed", handler);
    return () => {
      alive = false;
      window.removeEventListener("sb:data_changed", handler);
    };
  }, []);

  // Filter calculation via useMemo (fast, no extra re-renders, zero loop risk)
  const displayed = useMemo(() => {
    let results = [...allExp];

    if (query.trim()) {
      const q = query.toLowerCase();
      results = results.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.city.toLowerCase().includes(q) ||
        (e.location && e.location.toLowerCase().includes(q)) ||
        (e.description && e.description.toLowerCase().includes(q)) ||
        (e.tags && e.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    if (city !== "All") {
      results = results.filter(e => e.city.toLowerCase() === city.toLowerCase());
    }

    if (category !== "All") {
      results = results.filter(e =>
        e.tags?.some(t => t.toLowerCase().includes(category.toLowerCase())) ||
        (e.category && e.category.toLowerCase().includes(category.toLowerCase()))
      );
    }

    if (onlyOriginals) {
      results = results.filter(e => e.category === "original");
    }

    if (maxPrice < 6000) {
      results = results.filter(e => formatExperiencePrice(e.price) <= maxPrice);
    }

    // Sorting
    if (sortBy === "rating") {
      results.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "price_asc") {
      results.sort((a, b) => formatExperiencePrice(a.price) - formatExperiencePrice(b.price));
    } else if (sortBy === "price_desc") {
      results.sort((a, b) => formatExperiencePrice(b.price) - formatExperiencePrice(a.price));
    } else if (sortBy === "newest") {
      results.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
    }

    return results;
  }, [allExp, query, city, category, onlyOriginals, maxPrice, sortBy]);

  const toggleWishlist = async (id: string) => {
    const added = await api.toggleWishlist(id);
    setWishlist(prev => added ? [...prev, id] : prev.filter(x => x !== id));
  };

  const cities = useMemo(() => ["All", ...Array.from(new Set(allExp.map(e => e.city)))], [allExp]);
  const originals = displayed.filter(e => e.category === "original");
  const standards = displayed.filter(e => e.category !== "original");

  const resetFilters = () => {
    setQuery("");
    setCategory("All");
    setCity("All");
    setMaxPrice(6000);
    setOnlyOriginals(false);
    setSortBy("recommended");
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Header />
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-rose-500" />
        <p className="text-slate-500 font-bold text-sm">
          {isBn ? "অভিজ্ঞতা লোড হচ্ছে..." : "Curating handcrafted experiences across Bangladesh..."}
        </p>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafafc]">
      <Header />

      {/* ── Hero Banner ── */}
      <section className="relative bg-gradient-to-br from-rose-600 via-rose-500 to-amber-500 text-white overflow-hidden py-16 sm:py-20 px-6 sm:px-12">
        {/* Abstract background illumination circles */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="w-[500px] h-[500px] rounded-full bg-white blur-3xl absolute -top-32 -right-24" />
          <div className="w-[450px] h-[450px] rounded-full bg-amber-300 blur-3xl absolute -bottom-32 -left-20" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/30 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{isBn ? "স্টেবিডি অরিজিনাল অভিজ্ঞতা" : "StayBD Bespoke Experiences"}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
              {isBn ? (
                <>স্থানীয় বিশেষজ্ঞদের সাথে <br className="hidden sm:inline" />অবিস্মরণীয় বাংলাদেশ আবিষ্কার</>
              ) : (
                <>Unique Activities &amp; Living <br className="hidden sm:inline" />Hosted by Local Experts</>
              )}
            </h1>

            <p className="text-white/90 text-sm sm:text-base font-medium max-w-2xl leading-relaxed">
              {isBn
                ? "শ্রীমঙ্গলের কুয়াশাচ্ছন্ন চা বাগান, সুন্দরবনের নীরব নৌকা সাফারি, পুরান ঢাকার ঐতিহ্যবাহী কাচ্চি ট্রেইল থেকে ইনানী সমুদ্র সৈকতের সার্ফিং—সবকিছু স্থানীয় মাস্টারদের সাথে।"
                : "From misty tea estate tastings in Sreemangal and silent boat safaris in the Sundarbans to secret Old Dhaka culinary trails and sunset surfing at Inani Beach."}
            </p>

            {/* 4 Trust Highlights */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-xs font-bold">
              <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10">
                <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>{isBn ? "১০০% ভেরিফাইড গাইড" : "Verified Local Hosts"}</span>
              </div>
              <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                <span>{isBn ? "ইনস্ট্যান্ট বুকিং" : "Instant Confirmation"}</span>
              </div>
              <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10">
                <Users className="w-4 h-4 text-cyan-300 shrink-0" />
                <span>{isBn ? "স্মল গ্রুপ অভিজ্ঞতা" : "Small Groups (Max 8)"}</span>
              </div>
              <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10">
                <Compass className="w-4 h-4 text-rose-300 shrink-0" />
                <span>{isBn ? "সহজ ক্যান্সেলেশন" : "Flexible Free Cancel"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Sticky Filter & Search Toolbar ── */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          {/* Top row: Search input + City selector + Sort + Filter button */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="flex-1 min-w-[240px] relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={isBn ? "স্থান বা অভিজ্ঞতার নাম খুঁজুন..." : "Search activities, tea estates, safaris, food..."}
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none transition-all"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* City dropdown */}
            <div className="relative hidden md:block">
              <Globe2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                value={city}
                onChange={e => setCity(e.target.value)}
                className="pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 focus:ring-2 focus:ring-slate-900 outline-none appearance-none cursor-pointer"
              >
                {cities.map(c => (
                  <option key={c} value={c}>
                    {c === "All" ? (isBn ? "সকল শহর" : "All Cities") : c}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort selector */}
            <div className="relative hidden sm:block">
              <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 focus:ring-2 focus:ring-slate-900 outline-none appearance-none cursor-pointer"
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{t(o.label)}</option>
                ))}
              </select>
            </div>

            {/* Toggle StayBD Originals only pill */}
            <button
              onClick={() => setOnlyOriginals(v => !v)}
              className={`hidden lg:flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-black transition-all ${
                onlyOriginals
                  ? "bg-amber-500 text-white shadow-md shadow-amber-200"
                  : "bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isBn ? "স্টেবিডি অরিজিনাল" : "StayBD Originals"}</span>
            </button>

            {/* Expand filters toggle */}
            <button
              onClick={() => setShowFilters(f => !f)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs sm:text-sm font-bold transition-all ${
                showFilters || maxPrice < 6000
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>{t("Filters")}</span>
              {maxPrice < 6000 && <span className="w-2 h-2 rounded-full bg-rose-400" />}
            </button>
          </div>

          {/* Expandable Advanced Filters Drawer */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 pb-2 border-t border-slate-100 mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Mobile City Selector */}
                  <div className="md:hidden">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block mb-1">
                      {isBn ? "শহর" : "City"}
                    </label>
                    <select
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
                    >
                      {cities.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  {/* Price Slider */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
                        {isBn ? "সর্বোচ্চ বাজেট" : "Max Price"}: ৳{maxPrice.toLocaleString()}
                      </label>
                      {maxPrice < 6000 && (
                        <button
                          onClick={() => setMaxPrice(6000)}
                          className="text-[10px] text-rose-600 font-bold hover:underline"
                        >
                          {isBn ? "রিসেট" : "Reset"}
                        </button>
                      )}
                    </div>
                    <input
                      type="range"
                      min={1000}
                      max={6000}
                      step={200}
                      value={maxPrice}
                      onChange={e => setMaxPrice(Number(e.target.value))}
                      className="w-full accent-rose-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] font-bold text-slate-400">
                      <span>৳1,000</span>
                      <span>৳3,500</span>
                      <span>৳6,000+</span>
                    </div>
                  </div>

                  {/* Mobile Sort Selector */}
                  <div className="sm:hidden">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block mb-1">
                      {isBn ? "সর্ট করুন" : "Sort By"}
                    </label>
                    <select
                      value={sortBy}
                      onChange={e => setSortBy(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
                    >
                      {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{t(o.label)}</option>)}
                    </select>
                  </div>

                  {/* Reset All */}
                  <div className="flex items-end">
                    <button
                      onClick={resetFilters}
                      className="text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-400 px-4 py-2 rounded-xl transition-colors"
                    >
                      {isBn ? "সকল ফিল্টার মুছুন" : "Clear All Filters"}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Category Tabs (Scrollable) */}
          <div className="flex gap-2 overflow-x-auto pt-3 pb-1 scrollbar-hide">
            {CATEGORIES.map(cat => {
              const active = category === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                    active
                      ? "bg-slate-900 text-white shadow-sm scale-[1.02]"
                      : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
                  }`}
                >
                  <span className="text-sm">{cat.icon}</span>
                  <span>{t(cat.label)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Main Experience Grid ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Results count header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              {isBn ? "অনুসন্ধান ফলাফল" : "Search Results"}
            </p>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {displayed.length} {displayed.length === 1 ? (isBn ? "টি অভিজ্ঞতা পাওয়া গেছে" : "Experience Found") : (isBn ? "টি অভিজ্ঞতা পাওয়া গেছে" : "Experiences Available")}
              {category !== "All" && <span className="text-rose-600"> · {category}</span>}
              {city !== "All" && <span className="text-slate-500"> in {city}</span>}
            </h2>
          </div>

          {(query || category !== "All" || city !== "All" || onlyOriginals || maxPrice < 6000) && (
            <button
              onClick={resetFilters}
              className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>{isBn ? "ফিল্টার রিসেট" : "Reset filters"}</span>
            </button>
          )}
        </div>

        {displayed.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-28 text-center bg-white rounded-3xl border border-slate-200/70 p-8">
            <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-4">
              <Compass className="w-10 h-10 animate-pulse" />
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">
              {isBn ? "কোনো অভিজ্ঞতা পাওয়া যায়নি" : "No Experiences Found"}
            </h3>
            <p className="text-slate-500 text-sm max-w-md mb-6">
              {isBn
                ? "আপনার ফিল্টার বা সার্চ টার্ম পরিবর্তন করে পুনরায় চেষ্টা করুন।"
                : "We couldn't find any activities matching your selected filters or search keywords."}
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-3 bg-slate-900 hover:bg-black text-white text-xs font-black rounded-2xl shadow-lg transition-all"
            >
              {isBn ? "সকল ফিল্টার ক্লিয়ার করুন" : "Clear All Filters"}
            </button>
          </div>
        ) : (
          <div className="space-y-14">
            {/* 1. StayBD Originals Section */}
            {originals.length > 0 && (
              <section>
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider mb-1">
                      <Sparkles className="w-4 h-4 fill-amber-500" />
                      <span>{isBn ? "হ্যান্ডক্র্যাফটেড কালেকশন" : "StayBD Originals"}</span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                      {isBn ? "স্টেবিডি অরিজিনাল অভিজ্ঞতা" : "StayBD Handcrafted Originals"}
                    </h2>
                    <p className="text-slate-500 text-xs sm:text-sm font-medium mt-0.5">
                      {isBn
                        ? "শুধুমাত্র স্টেবিডি-এর জন্য বিশেষভাবে ডিজাইনকৃত স্থানীয় ও ঐতিহ্যবাহী ট্যুর"
                        : "One-of-a-kind activities hosted by vetted master artisans & certified naturalists"}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                    {originals.length} {isBn ? "টি" : "activities"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {originals.map(exp => (
                    <ExperienceCardUI
                      key={exp.id}
                      exp={exp}
                      isWishlisted={wishlist.includes(exp.id)}
                      onToggleWishlist={toggleWishlist}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* 2. All Guided Tours / Regional Expeditions */}
            {standards.length > 0 && (
              <section>
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
                      <Mountain className="w-4 h-4" />
                      <span>{isBn ? "গাইডেড ট্যুর ও অভিযান" : "Guided Tours & Expeditions"}</span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                      {city !== "All"
                        ? `${isBn ? "অভিজ্ঞতা সমূহ -" : "Experiences in"} ${city}`
                        : isBn ? "সকল গাইডেড অভিজ্ঞতা" : "Explore All Guided Tours"}
                    </h2>
                    <p className="text-slate-500 text-xs sm:text-sm font-medium mt-0.5">
                      {isBn
                        ? "অভিজ্ঞ স্থানীয় ট্যুর লিডারদের তত্ত্বাবধানে রোমাঞ্চকর অ্যাডভেঞ্চার"
                        : "Hosted by licensed tour guides, conservationists, and cultural experts"}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                    {standards.length} {isBn ? "টি" : "activities"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {standards.map(exp => (
                    <ExperienceCardUI
                      key={exp.id}
                      exp={exp}
                      isWishlisted={wishlist.includes(exp.id)}
                      onToggleWishlist={toggleWishlist}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* ── Quality Guarantee Section ── */}
        <section className="mt-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl overflow-hidden relative">
          <div className="max-w-3xl space-y-4 relative z-10">
            <span className="text-rose-400 text-xs font-black uppercase tracking-widest">
              {isBn ? "স্টেবিডি কোয়ালিটি স্ট্যান্ডার্ড" : "The StayBD Experience Guarantee"}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              {isBn
                ? "প্রতিটি অভিজ্ঞতা জাতীয় পর্যটন মান ও নিরাপত্তার সাথে যাচাইকৃত"
                : "Every experience is verified for safety, authenticity, and cultural depth"}
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              {isBn
                ? "আমরা স্থানীয় গাইডদের ব্যক্তিগতভাবে যাচাই করি। কোনো লুকানো চার্জ নেই, সম্পূর্ণ নিশ্চিত বুকিং এবং নিরাপদ bKash ও কার্ড পেমেন্ট সুবিধা।"
                : "We vet our hosts personally, ensuring authentic encounters, transparent pricing, and instant mobile bookings with full bKash, card, and local payment integration."}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10 border-t border-slate-800 pt-6">
            <div className="space-y-1">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                {isBn ? "ভেরিফাইড এক্সপার্ট" : "Vetted Guides"}
              </h4>
              <p className="text-xs text-slate-400">
                {isBn ? "জাতীয় আইডি ও পুলিশ ক্লিয়ারেন্স সম্পন্ন হোস্ট।" : "Licensed hosts with verified credentials and local heritage knowledge."}
              </p>
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                {isBn ? "কোনো লুকানো খরচ নেই" : "Transparent Pricing"}
              </h4>
              <p className="text-xs text-slate-400">
                {isBn ? "সকল পারমিট ও নাস্তা বা লাঞ্চ প্যাকেজেই অন্তর্ভুক্ত।" : "All taxes, forest permits, tastings, and equipment included."}
              </p>
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                {isBn ? "সহজ সাপোর্ট" : "24/7 Concierge"}
              </h4>
              <p className="text-xs text-slate-400">
                {isBn ? "যেকোনো প্রয়োজনে সরাসরি আমাদের হোয়াটসঅ্যাপ ও হটলাইন সাপোর্ট।" : "Dedicated emergency support throughout your journey in Bangladesh."}
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Experiences;
