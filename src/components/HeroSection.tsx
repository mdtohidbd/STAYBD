import React, { useState, useEffect, useRef } from "react";
import { 
  motion, 
  AnimatePresence, 
  useMotionValue, 
  useSpring, 
  useTransform 
} from "framer-motion";
import { 
  Sparkles, Star, MapPin, ShieldCheck, 
  Building2, ArrowRight, Award,
  Flame, CheckCircle2, ChevronRight
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface SlideData {
  id: string;
  image: string;
  titleHighlight: string;
  titleHighlightBn: string;
  resortName: string;
  resortNameBn: string;
  tagline: string;
  taglineBn: string;
  location: string;
  locationBn: string;
  tabLabel: string;
  tabLabelBn: string;
  rating: string;
  reviewsCount: string;
  priceTag: string;
  priceTagBn: string;
  searchQuery: string;
  badge: string;
  badgeBn: string;
}

const SLIDES: SlideData[] = [
  {
    id: "beachfront",
    image: "/images/hero-coxs-bazar.jpg",
    titleHighlight: "Oceanfront Resort",
    titleHighlightBn: "সি-ভিউ বিচ রিসোর্ট",
    resortName: "Sea Pearl Royal Beach Resort",
    resortNameBn: "সী পার্ল রয়্যাল বিচ রিসোর্ট",
    tagline: "5-Star Oceanfront Villa & Private Beach Sanctuary",
    taglineBn: "ইনানী সৈকত সংলগ্ন ৫-তারকা লাক্সারি বিচ ভিলা",
    location: "Inani Beach, Cox's Bazar",
    locationBn: "ইনানী বিচ, কক্সবাজার",
    tabLabel: "Cox's Bazar",
    tabLabelBn: "কক্সবাজার",
    rating: "4.99",
    reviewsCount: "2,840+ reviews",
    priceTag: "From ৳4,500 / night",
    priceTagBn: "৳৪,৫০০ / রাত থেকে",
    searchQuery: "Cox's Bazar",
    badge: "5-Star Luxury",
    badgeBn: "৫-তারকা লাক্সারি",
  },
  {
    id: "tea-estates",
    image: "/images/hero-sreemangal-tea.jpg",
    titleHighlight: "Tea Sanctuary",
    titleHighlightBn: "সবুজ চা বাগান রিসোর্ট",
    resortName: "Grand Sultan Tea Resort & Golf",
    resortNameBn: "গ্র্যান্ড সুলতান টি রিসোর্ট ও গল্ফ",
    tagline: "Lush Tea Estate Bungalows & Rainforest Golf Retreat",
    taglineBn: "শ্রীমঙ্গলের চা বাগান ঘেরা পরিবেশবান্ধব প্রিমিয়াম রিসোর্ট",
    location: "Radhanagar, Sreemangal",
    locationBn: "রাধানগর, শ্রীমঙ্গল",
    tabLabel: "Sreemangal",
    tabLabelBn: "শ্রীমঙ্গল",
    rating: "4.98",
    reviewsCount: "1,920+ reviews",
    priceTag: "From ৳3,800 / night",
    priceTagBn: "৳৩,৮০০ / রাত থেকে",
    searchQuery: "Sylhet",
    badge: "Eco-Luxe",
    badgeBn: "ইকো-লাক্সারি",
  },
  {
    id: "cloud-valley",
    image: "/images/hero-sajek-clouds.jpg",
    titleHighlight: "Cloud Haven",
    titleHighlightBn: "মেঘের উপত্যকা কটেজ",
    resortName: "Sajek Cloud Valley Eco Resort",
    resortNameBn: "সাজেক ক্লাউড ভ্যালি ইকো রিসোর্ট",
    tagline: "Above-the-Clouds Wooden Cottages & Mountain Views",
    taglineBn: "সাজেক ভ্যালির মেঘছোঁয়া পাহাড় চূড়ায় কাঠের নান্দনিক কটেজ",
    location: "Ruilui Para, Sajek Valley",
    locationBn: "রুইলুই পাড়া, সাজেক ভ্যালি",
    tabLabel: "Sajek",
    tabLabelBn: "সাজেক",
    rating: "5.00",
    reviewsCount: "1,150+ reviews",
    priceTag: "From ৳3,200 / night",
    priceTagBn: "৳৩,২০০ / রাত থেকে",
    searchQuery: "Sajek",
    badge: "Mountain Vistas",
    badgeBn: "মেঘের চূড়া",
  },
  {
    id: "pool-villa",
    image: "/images/hero-pool-villa.jpg",
    titleHighlight: "Private Pool Villa",
    titleHighlightBn: "প্রাইভেট পুল ভিলা",
    resortName: "Sarah Luxury Resort & Pool Villas",
    resortNameBn: "সারাহ লাক্সারি রিসোর্ট ও পুল ভিলা",
    tagline: "Exclusive Swimming Pool Villas & Nature Staycations",
    taglineBn: "পরিবার ও বন্ধুদের সাথে নিরিবিলি প্রিমিয়াম প্রাইভেট পুল ভিলা",
    location: "Rajabari, Gazipur (Dhaka)",
    locationBn: "রাজাবাড়ী, গাজীপুর (ঢাকা)",
    tabLabel: "Pool Villas",
    tabLabelBn: "পুল ভিলা",
    rating: "4.96",
    reviewsCount: "1,480+ reviews",
    priceTag: "From ৳6,500 / night",
    priceTagBn: "৳৬,৫০০ / রাত থেকে",
    searchQuery: "Dhaka",
    badge: "Exclusive Staycation",
    badgeBn: "প্রিমিয়াম স্টেকেশন",
  },
];

const QUICK_INSPIRATION_PILLS = [
  { label: "🏖️ Cox's Bazar Beach", query: "Cox's Bazar" },
  { label: "🍃 Sylhet Tea Estates", query: "Sylhet" },
  { label: "☁️ Sajek Cloud Valley", query: "Sajek" },
  { label: "🏊 Luxury Pool Villas", query: "Villa" },
  { label: "⚡ Secret Member Deals", query: "Sale" },
];

export const HeroSection: React.FC = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [liveBookingsCount, setLiveBookingsCount] = useState(240);
  const sectionRef = useRef<HTMLElement>(null);

  // Smooth mouse parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 140 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const ambientX = useTransform(smoothX, [-0.5, 0.5], [-20, 20]);
  const ambientY = useTransform(smoothY, [-0.5, 0.5], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Automatic 5.5-second slide progression
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5500);
    return () => clearInterval(interval);
  }, []);

  // Increment simulated live bookings
  useEffect(() => {
    const counterInterval = setInterval(() => {
      setLiveBookingsCount((prev) => prev + (Math.random() > 0.6 ? 1 : 0));
    }, 5000);
    return () => clearInterval(counterInterval);
  }, []);

  const slide = SLIDES[currentSlide];
  const isBn = i18n.language === "bn" || i18n.language?.startsWith("bn");

  const handleQuickSearch = (query: string) => {
    navigate(`/hotels?destination=${encodeURIComponent(query)}`);
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[620px] md:min-h-[680px] lg:min-h-[720px] overflow-hidden flex flex-col justify-center select-none bg-slate-950 text-white"
    >
      {/* ═══════════ CINEMATIC CROSSFADE BACKDROP ═══════════ */}
      <div className="absolute inset-0 z-0">
        {SLIDES.map((s, idx) => {
          const isActive = idx === currentSlide;
          return (
            <div
              key={s.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <img
                src={s.image}
                alt={s.tagline}
                className={`w-full h-full object-cover object-center transform transition-transform duration-[8000ms] ease-out ${
                  isActive ? "scale-105" : "scale-100"
                }`}
                loading={idx === 0 ? "eager" : "lazy"}
              />
              {/* Atmospheric Luxury Vignette — balanced so the natural sunlight and landscapes shine */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-slate-950/25" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-transparent to-black/30" />
            </div>
          );
        })}
      </div>

      {/* ═══════════ SOFT AMBIENT LIGHT LEAKS ═══════════ */}
      <motion.div
        style={{ x: ambientX, y: ambientY }}
        className="absolute inset-0 z-10 pointer-events-none overflow-hidden"
      >
        <div className="absolute -top-24 left-1/4 w-[36rem] h-[36rem] bg-indigo-500/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-1/4 w-[32rem] h-[32rem] bg-emerald-500/15 rounded-full blur-[150px]" />
      </motion.div>

      {/* ═══════════ HERO CONTENT CONTAINER ═══════════ */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 md:px-6 pt-8 pb-20 md:py-24 w-full flex flex-col lg:flex-row items-center justify-between gap-10">
        
        {/* LEFT COLUMN: TITLE, NATIONAL TRUST & METRICS */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl text-center lg:text-left"
        >
          {/* Government & National Trust Badge */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 mb-5">
            <div 
              onClick={() => navigate("/national-initiative")}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/15 backdrop-blur-xl border border-white/20 shadow-lg cursor-pointer transition-all duration-300 group"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ring-4 ring-emerald-400/20" />
              <span className="text-[11px] md:text-xs font-bold text-emerald-300 uppercase tracking-widest">
                {isBn ? "জাতীয় প্ল্যাটফর্ম • স্মার্ট বাংলাদেশ ২০৪১" : "National Hospitality Platform • Smart BD 2041"}
              </span>
              <span className="text-[10px] font-black bg-gradient-to-r from-emerald-400 to-teal-300 text-slate-950 px-2.5 py-0.5 rounded-full uppercase shadow-xs">
                {isBn ? "সরকারি স্বীকৃতি" : "Govt Backed"}
              </span>
            </div>
          </div>

          {/* Headline with Champagne Gold Accent */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black text-white leading-[1.12] tracking-tight mb-5 drop-shadow-md">
            <span>{isBn ? "বাংলাদেশের সেরা" : "Find Your Perfect"}</span>{" "}
            <br className="hidden sm:block" />
            <span className="inline-block relative">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={currentSlide}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-400 bg-clip-text text-transparent inline-block drop-shadow-sm font-black"
                >
                  {isBn ? slide.titleHighlightBn : slide.titleHighlight}
                </motion.span>
              </AnimatePresence>
            </span>{" "}
            <span>{isBn ? "অভিজ্ঞতা নিন" : "in Bangladesh"}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-200/95 text-sm sm:text-base md:text-lg max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed mb-6 drop-shadow-xs">
            {isBn 
              ? "StayBD — সহজ অনুসন্ধান। নিরাপদ আবাসন। দেশের ৬৪ জেলার যাচাইকৃত ৫-তারকা বিচ রিসোর্ট, চা বাগান বাংলো ও ক্লাউড কটেজে সরাসরি হোটেল রেটে বুকিং।" 
              : "StayBD — Stay Smart. Book Easy. Discover handpicked 5-star beachfront resorts, tea estate retreats, and mountain cloud lodges across 64 districts with zero hidden fees."}
          </p>

          {/* Key Platform Trust Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 mb-6 border-y border-white/15 max-w-xl mx-auto lg:mx-0">
            <div>
              <p className="text-xl sm:text-2xl font-black text-white">1,250+</p>
              <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">{isBn ? "যাচাইকৃত হোটেল" : "Verified Stays"}</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-emerald-400">0%</p>
              <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">{isBn ? "হিডেন চার্জ" : "Booking Fee"}</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-white">64</p>
              <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">{isBn ? "জেলায় নেটওয়ার্ক" : "Districts"}</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-amber-300">★ 4.9</p>
              <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">{isBn ? "গেস্ট রেটিং" : "Guest Rating"}</p>
            </div>
          </div>

          {/* Quick Popular Destination Tags */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider mr-1.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {isBn ? "জনপ্রিয় গন্তব্য:" : "Popular:"}
            </span>
            {QUICK_INSPIRATION_PILLS.map((pill, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickSearch(pill.query)}
                className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 hover:border-amber-300/60 backdrop-blur-md text-xs font-semibold text-white transition-all duration-300 shadow-xs hover:scale-105 active:scale-95"
              >
                {pill.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* RIGHT COLUMN: LUXURY FROSTED GLASS SANCTUARY CARD */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          className="w-full max-w-lg lg:max-w-md shrink-0"
        >
          {/* Glass Card */}
          <div className="relative bg-white/10 backdrop-blur-2xl border border-white/25 p-5 sm:p-6 rounded-[32px] shadow-2xl overflow-hidden text-left">
            
            {/* Card Header: Live PMS Indicator & Badge */}
            <div className="flex items-center justify-between pb-3.5 border-b border-white/15 mb-3.5">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 shadow-[0_0_8px_#10b981]" />
                </span>
                <span className="text-xs font-black text-white uppercase tracking-wider">
                  {isBn ? "লাইভ ইনভেন্টরি" : "PMS Live Direct"}
                </span>
              </div>
              <span className="text-[10px] font-black bg-emerald-500/25 text-emerald-300 border border-emerald-400/40 px-2.5 py-1 rounded-full uppercase tracking-wider">
                {isBn ? slide.badgeBn : slide.badge}
              </span>
            </div>

            {/* Live Social Proof Banner */}
            <div className="flex items-center gap-3 bg-black/30 border border-white/15 p-2.5 sm:p-3 rounded-2xl mb-3.5">
              <div className="flex -space-x-2">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Guest"
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt="Guest"
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80"
                  alt="Guest"
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-white flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                  <span className="truncate">{liveBookingsCount}+ {isBn ? "জন অতিথি আজ বুক করেছেন" : "Guests Booked Today"}</span>
                </p>
                <p className="text-[11px] text-slate-300 truncate">
                  {isBn ? slide.locationBn : slide.location}
                </p>
              </div>
            </div>

            {/* Spotlight Resort Showcase Card */}
            <div className="relative rounded-2xl overflow-hidden border border-white/20 mb-4 bg-slate-900 group">
              {/* Photo */}
              <div className="h-44 sm:h-48 w-full overflow-hidden relative">
                <img
                  src={slide.image}
                  alt={slide.tagline}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                {/* Top Badge: Rating */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 text-xs font-bold text-amber-300">
                  <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  <span>{slide.rating} ({slide.reviewsCount})</span>
                </div>

                {/* Top Right: Verified */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-600/90 backdrop-blur-md text-[10px] font-black uppercase text-white shadow-xs">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{isBn ? "ভেরিফাইড" : "Verified"}</span>
                </div>

                {/* Bottom Details Overlay */}
                <div className="absolute bottom-2.5 left-3 right-3 text-white">
                  <h3 className="text-sm sm:text-base font-black truncate drop-shadow-sm">
                    {isBn ? slide.resortNameBn : slide.resortName}
                  </h3>
                  <p className="text-[11px] text-slate-200 flex items-center gap-1 truncate mt-0.5">
                    <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                    <span>{isBn ? slide.locationBn : slide.location}</span>
                  </p>
                </div>
              </div>

              {/* Price & Action Row */}
              <div className="p-3 bg-slate-950/90 flex items-center justify-between gap-2 border-t border-white/10">
                <div>
                  <span className="text-xs sm:text-sm font-black text-amber-300">
                    {isBn ? slide.priceTagBn : slide.priceTag}
                  </span>
                  <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">
                    {isBn ? "সরাসরি হোটেল রেট" : "Direct PMS Tariff"}
                  </p>
                </div>
                <button
                  onClick={() => handleQuickSearch(slide.searchQuery)}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 text-xs font-black uppercase shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
                >
                  <span>{isBn ? "রিসোর্ট দেখুন" : "Explore"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Segmented Destination Tabs with Animated Timer */}
            <div className="w-full bg-black/40 backdrop-blur-xl border border-white/20 p-1 rounded-xl">
              <div className="grid grid-cols-4 gap-1">
                {SLIDES.map((s, idx) => {
                  const isActive = idx === currentSlide;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setCurrentSlide(idx)}
                      aria-label={`Switch to ${s.tabLabel}`}
                      className={`relative py-1.5 px-1 rounded-lg text-center transition-all duration-300 overflow-hidden ${
                        isActive
                          ? "bg-white/25 text-white font-black shadow-xs border border-white/30"
                          : "hover:bg-white/10 text-slate-300 hover:text-white font-bold"
                      }`}
                    >
                      <div className="text-[10px] md:text-[11px] uppercase tracking-wider truncate">
                        {isBn ? s.tabLabelBn : s.tabLabel}
                      </div>

                      {/* Smooth Progress Timer */}
                      {isActive && (
                        <motion.div
                          key={`timer-${currentSlide}`}
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 5.5, ease: "linear" }}
                          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 rounded-full"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </motion.div>

      </div>

      {/* Subtle bottom edge gradient for smooth seamless transition into SearchBar */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-950/80 to-transparent z-10 pointer-events-none" />
    </section>
  );
};

export default HeroSection;
