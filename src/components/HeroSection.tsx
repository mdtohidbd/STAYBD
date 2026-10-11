import React, { useState, useEffect, useRef } from "react";
import { 
  motion, 
  AnimatePresence, 
  useMotionValue, 
  useSpring, 
  useTransform 
} from "framer-motion";
import { 
  Sparkles, Star, MapPin, Award, Zap, ShieldCheck, 
  ChevronRight, Heart, Users, CheckCircle2, TrendingUp, 
  Compass, Building2, Flame, ArrowUpRight, Play, Check 
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// 4 Handpicked, Breathtaking Outdoor Luxury Resort, Infinity Pool & Sky Villa Assets
import resortLuxe1 from "../assets/pexels-didi-lecatompessy-2149441489-33125906.jpg";
import resortLuxe2 from "../assets/pexels-quang-nguyen-vinh-222549-29000012.jpg";
import resortLuxe3 from "../assets/pexels-pixabay-164595.jpg";
import resortLuxe4 from "../assets/pexels-cheng-shi-song-427082720-35022072.jpg";

interface SlideData {
  id: string;
  image: string;
  titleHighlight: string;
  titleHighlightBn: string;
  tagline: string;
  taglineBn: string;
  location: string;
  locationBn: string;
  label: string;
  labelBn: string;
  rating: string;
  priceTag: string;
  priceTagBn: string;
  searchQuery: string;
  badge: string;
  badgeBn: string;
}

const SLIDES: SlideData[] = [
  {
    id: "beachfront",
    image: resortLuxe1,
    titleHighlight: "Beach Resort",
    titleHighlightBn: "সি-ভিউ রিসোর্ট",
    tagline: "5-Star Oceanfront Villa & Infinity Beach Sanctuary",
    taglineBn: "কক্সবাজার সমুদ্র সৈকত ও ৫-তারকা ইনফিনিটি পুল ভিলা",
    location: "Kolatoli & Inani Beach, Cox's Bazar",
    locationBn: "কলাতলী ও ইনানী বিচ, কক্সবাজার",
    label: "01 BEACHFRONT",
    labelBn: "০১ সমুদ্র সৈকত",
    rating: "4.99 (2,840+ reviews)",
    priceTag: "From ৳4,500 / night",
    priceTagBn: "৳৪,৫০০ / রাত থেকে",
    searchQuery: "Cox's Bazar",
    badge: "Most Popular",
    badgeBn: "শীর্ষ পছন্দ",
  },
  {
    id: "tea-estates",
    image: resortLuxe2,
    titleHighlight: "Tea Retreat",
    titleHighlightBn: "টি-রিসোর্ট",
    tagline: "Lush Tea Estate Bungalows & Rainforest Golf Resort",
    taglineBn: "শ্রীমঙ্গল ও সিলেটের সবুজ চা বাগানের মাঝে বিলাসবহুল রিসোর্ট",
    location: "Radhanagar, Sreemangal & Sylhet",
    locationBn: "রাধানগর, শ্রীমঙ্গল ও সিলেট",
    label: "02 TEA RETREAT",
    labelBn: "০২ চা বাগান",
    rating: "4.98 (1,920+ reviews)",
    priceTag: "From ৳3,800 / night",
    priceTagBn: "৳৩,৮০০ / রাত থেকে",
    searchQuery: "Sylhet",
    badge: "Eco-Luxe",
    badgeBn: "ইকো-লাক্সারি",
  },
  {
    id: "cloud-valley",
    image: resortLuxe4,
    titleHighlight: "Cloud Haven",
    titleHighlightBn: "মেঘের কটেজ",
    tagline: "Above-the-Clouds Wooden Cottages & Mountain Vistas",
    taglineBn: "সাজেক ভ্যালির মেঘছোঁয়া পাহাড় চূড়ায় কাঠের নান্দনিক কটেজ",
    location: "Ruilui Para, Sajek & Bandarban",
    locationBn: "রুইলুই পাড়া, সাজেক ভ্যালি ও বান্দরবান",
    label: "03 CLOUD HAVEN",
    labelBn: "০৩ মেঘের ভ্যালি",
    rating: "5.00 (1,150+ reviews)",
    priceTag: "From ৳3,200 / night",
    priceTagBn: "৳৩,২০০ / রাত থেকে",
    searchQuery: "Chittagong",
    badge: "Loved by Couples",
    badgeBn: "কাপলদের সেরা পছন্দ",
  },
  {
    id: "pool-villa",
    image: resortLuxe3,
    titleHighlight: "Pool Villa",
    titleHighlightBn: "প্রাইভেট ভিলা",
    tagline: "Exclusive Private Swimming Pool Villas & Staycations",
    taglineBn: "পরিবার ও বন্ধুদের সাথে নিরিবিলি প্রিমিয়াম প্রাইভেট পুল ভিলা",
    location: "Gazipur & Dhaka Outskirts",
    locationBn: "গাজীপুর ও ঢাকা মেট্রো সংলগ্ন",
    label: "04 POOL VILLA",
    labelBn: "০৪ পুল ভিলা",
    rating: "4.96 (1,480+ reviews)",
    priceTag: "From ৳6,500 / night",
    priceTagBn: "৳৬,৫০০ / রাত থেকে",
    searchQuery: "Dhaka",
    badge: "VIP Exclusive",
    badgeBn: "ভিআইপি এক্সক্লুসিভ",
  },
];

const QUICK_INSPIRATION_PILLS = [
  { label: "🏖️ Cox's Bazar Beach", query: "Cox's Bazar", badge: "Hot" },
  { label: "☕ Sylhet Tea Gardens", query: "Sylhet", badge: "Scenic" },
  { label: "☁️ Sajek Cloud Valley", query: "Sajek", badge: "Trending" },
  { label: "🏊 Private Pool Villas", query: "Villa", badge: "Luxury" },
  { label: "🔥 50% Flash Sale", query: "Sale", badge: "Deal" },
];

export const HeroSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [liveBookingsCount, setLiveBookingsCount] = useState(240);
  const sectionRef = useRef<HTMLElement>(null);

  // 3D Parallax Mouse Tracking with Framer Motion Springs
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 140 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const ambientX = useTransform(smoothX, [-0.5, 0.5], [-25, 25]);
  const ambientY = useTransform(smoothY, [-0.5, 0.5], [-20, 20]);
  const cardTiltX = useTransform(smoothY, [-0.5, 0.5], [6, -6]);
  const cardTiltY = useTransform(smoothX, [-0.5, 0.5], [-7, 7]);

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

  // Continuous 5-Second Aesthetic Cinematic Slide Progression
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5500);
    return () => clearInterval(interval);
  }, []);

  // Simulated live booking updates
  useEffect(() => {
    const counterInterval = setInterval(() => {
      setLiveBookingsCount((prev) => prev + (Math.random() > 0.6 ? 1 : 0));
    }, 4500);
    return () => clearInterval(counterInterval);
  }, []);

  const slide = SLIDES[currentSlide];
  const isBengali = i18n.language === "bn" || i18n.language?.startsWith("bn");
  const highlightWord = isBengali ? slide.titleHighlightBn : slide.titleHighlight;

  const handleQuickSearch = (query: string) => {
    navigate(`/hotels?destination=${encodeURIComponent(query)}`);
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[580px] md:min-h-[640px] lg:min-h-[700px] overflow-hidden flex flex-col justify-center select-none bg-slate-950"
    >
      {/* ═══════════ CINEMATIC PRELOADED CROSSFADE CAROUSEL ═══════════ */}
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
                className={`w-full h-full object-cover object-center brightness-105 contrast-105 transform transition-transform duration-[7000ms] ease-out ${
                  isActive ? "scale-105" : "scale-100"
                }`}
                loading={idx === 0 ? "eager" : "lazy"}
              />
              {/* Aesthetic High-Contrast Dark Vignette Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-slate-950/20" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-transparent to-black/40" />
            </div>
          );
        })}
      </div>

      {/* ═══════════ INTERACTIVE MOUSE-PARALLAX AMBIENT LIGHT LEAKS ═══════════ */}
      <motion.div
        style={{ x: ambientX, y: ambientY }}
        className="absolute inset-0 z-10 pointer-events-none overflow-hidden"
      >
        {/* Luminous Gold Aurora Orb */}
        <div className="absolute -top-24 -left-20 w-[36rem] h-[36rem] bg-amber-400/20 rounded-full blur-[140px] animate-pulse" />
        {/* Deep Emerald Glow Orb */}
        <div className="absolute bottom-10 right-1/4 w-[30rem] h-[30rem] bg-emerald-400/15 rounded-full blur-[150px]" />

        {/* Shimmering Aesthetic Gold Sparkle Dust */}
        {[...Array(14)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              opacity: 0,
              y: 90,
              x: (i - 7) * 75 + (Math.random() * 50 - 25),
              scale: 0.4,
            }}
            animate={{
              opacity: [0, 0.95, 0],
              y: [-20, -260],
              scale: [0.4, 1.3, 0.3],
            }}
            transition={{
              duration: 4.5 + (i % 4),
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeOut",
            }}
            className="absolute pointer-events-none"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 drop-shadow-[0_0_10px_rgba(245,158,11,1)]" />
          </motion.div>
        ))}
      </motion.div>

      {/* ═══════════ MAIN HERO CONTENT CONTAINER ═══════════ */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 md:px-6 pt-10 pb-16 md:py-20 w-full flex flex-col lg:flex-row items-center justify-between gap-10">
        
        {/* LEFT COLUMN: AWARD-WINNING AESTHETIC TYPOGRAPHY */}
        <motion.div
          initial={{ opacity: 0, x: -35 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl text-center lg:text-left"
        >
          {/* Trust Badges Bar */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 mb-6">
            <motion.div 
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              onClick={() => navigate("/national-initiative")}
              className="inline-flex items-center gap-2 bg-slate-900/85 backdrop-blur-xl px-4 py-1.5 rounded-full border border-emerald-500/40 shadow-2xl group cursor-pointer hover:bg-slate-900 hover:border-emerald-400 transition-all duration-300"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_#10b981]" />
              </span>
              <span className="text-[11px] md:text-xs font-bold text-emerald-300 uppercase tracking-widest">
                {isBengali ? "জাতীয় প্ল্যাটফর্ম • স্মার্ট বাংলাদেশ ২০৪১" : "National Platform • Smart BD 2041"}
              </span>
              <span className="text-[10px] font-black bg-gradient-to-r from-emerald-400 to-teal-300 text-slate-950 px-2.5 py-0.5 rounded-full uppercase shadow-sm">
                {isBengali ? "সরকারি উদ্যোগ" : "Govt Initiative"}
              </span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-rose-600/80 to-amber-600/80 backdrop-blur-xl px-3.5 py-1.5 rounded-full border border-white/25 shadow-2xl"
            >
              <Flame className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
              <span className="text-[11px] md:text-xs font-extrabold text-white uppercase tracking-wider">
                {isBengali ? "ফ্ল্যাশ সেল: সর্বোচ্চ ৫০% ছাড়" : "Flash Sale: Up to 50% OFF"}
              </span>
            </motion.div>
          </div>

          {/* Morphing Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.12] tracking-tight mb-6 drop-shadow-2xl">
            <span>{isBengali ? "খুঁজে নিন আপনার স্বপ্নের" : "Find Your Perfect"}</span>{" "}
            <br className="hidden sm:block" />
            
            {/* Highly Aesthetic Vivid Gold Dynamic Word Wrapper */}
            <span className="relative inline-block px-1 font-black">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentSlide}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="inline-block text-[#FFD700] drop-shadow-[0_0_30px_rgba(255,215,0,0.9)]"
                >
                  {highlightWord}
                </motion.span>
              </AnimatePresence>

              {/* Glowing Champagne-Gold Underline */}
              <motion.span 
                key={`underline-${currentSlide}`}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                className="absolute left-0 right-0 -bottom-1 h-1.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 rounded-full origin-left shadow-[0_0_20px_rgba(245,158,11,1)]"
              />
            </span>{" "}
            <span>{isBengali ? "বাংলাদেশে" : "in Bangladesh"}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-white/90 text-sm md:text-base lg:text-lg max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed mb-8 drop-shadow-md">
            {isBengali 
              ? "StayBD — সহজ অনুসন্ধান। নিরাপদ আবাসন। দেশের ৬৪ জেলার যাচাইকৃত হোটেল, রিসোর্ট ও কটেজে মধ্যস্বত্বভোগী ছাড়া সরাসরি নিশ্চিত বুকিং।" 
              : "StayBD — Stay Smart. Book Easy. Discover handpicked, verified luxury resorts, tea retreats, and eco-lodges across 64 districts with zero hidden fees."}
          </p>

          {/* ═══════════ INTERACTIVE QUICK-INSPIRATION PILLS ═══════════ */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-2">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider mr-1.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {isBengali ? "জনপ্রিয় গন্তব্য:" : "Popular:"}
            </span>
            {QUICK_INSPIRATION_PILLS.map((pill, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleQuickSearch(pill.query)}
                className="group relative inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/70 hover:bg-slate-900 border border-white/20 hover:border-amber-400/60 backdrop-blur-md text-xs font-medium text-white transition-all duration-300 shadow-md"
              >
                <span>{pill.label}</span>
                <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-400/25 text-amber-300 border border-amber-400/40">
                  {pill.badge}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* RIGHT COLUMN: AESTHETIC 3D GLASS SPOTLIGHT SHOWCASE & SLIDE SWITCHER */}
        <motion.div
          style={{ rotateX: cardTiltX, rotateY: cardTiltY }}
          initial={{ opacity: 0, x: 35 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          {/* Luxury Glass Spotlight Card */}
          <div className="relative bg-gradient-to-br from-slate-900/85 via-slate-900/70 to-slate-950/80 backdrop-blur-2xl border border-white/25 p-5 md:p-6 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.7)] overflow-hidden">
            
            {/* Card Ambient Glow Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/15 mb-4">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 shadow-[0_0_10px_#10b981]" />
                </span>
                <span className="text-xs font-extrabold text-white uppercase tracking-widest">
                  {isBengali ? "লাইভ বুকিং অ্যাক্টিভিটি" : "LIVE ACTIVITY"}
                </span>
              </div>
              <span className="text-[11px] font-black bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full border border-amber-400/30 uppercase">
                {isBengali ? "উচ্চ চাহিদা 🔥" : "High Demand 🔥"}
              </span>
            </div>

            {/* Live Social Proof Avatar Group & Counter */}
            <div className="flex items-center gap-3.5 bg-slate-950/70 border border-white/15 p-3.5 rounded-2xl mb-4">
              <div className="flex -space-x-2.5">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Guest"
                  className="w-9 h-9 rounded-full border-2 border-emerald-500 object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt="Guest"
                  className="w-9 h-9 rounded-full border-2 border-emerald-500 object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80"
                  alt="Guest"
                  className="w-9 h-9 rounded-full border-2 border-emerald-500 object-cover"
                />
              </div>
              <div className="text-left">
                <p className="text-xs font-extrabold text-white flex items-center gap-1">
                  <Flame className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
                  <span>{liveBookingsCount}+ {isBengali ? "জন অতিথি আজ বুক করেছেন" : "Guests Booked Today"}</span>
                </p>
                <p className="text-[11px] text-white/70">
                  {isBengali ? slide.locationBn : slide.location}
                </p>
              </div>
            </div>

            {/* Spotlight Sanctuary Showcase */}
            <div className="bg-white/10 border border-white/20 rounded-2xl p-4 mb-4 text-left shadow-lg backdrop-blur-md transition-all duration-500">
              <div className="flex items-center gap-3.5 mb-3">
                <img
                  src={slide.image}
                  alt={slide.tagline}
                  className="w-16 h-16 rounded-xl object-cover border-2 border-amber-400/80 shadow-md shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-300" />
                      {slide.rating}
                    </span>
                    <span className="text-[10px] font-black text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      {isBengali ? "১০০% যাচাইকৃত" : "100% Verified"}
                    </span>
                  </div>
                  <h3 className="text-sm font-extrabold text-white leading-snug truncate">
                    {isBengali ? slide.taglineBn : slide.tagline}
                  </h3>
                  <p className="text-xs text-amber-300 font-extrabold mt-0.5">
                    {isBengali ? slide.priceTagBn : slide.priceTag}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2.5 border-t border-white/15 text-xs">
                <span className="text-white/90 flex items-center gap-1.5 font-medium truncate">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  {isBengali ? slide.locationBn : slide.location}
                </span>
                <button
                  onClick={() => handleQuickSearch(slide.searchQuery)}
                  className="text-[11px] font-black bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-slate-950 px-3.5 py-1.5 rounded-full uppercase shadow-md hover:scale-105 active:scale-95 transition-all shrink-0 flex items-center gap-1"
                >
                  <span>{isBengali ? "রিসোর্ট দেখুন" : "Explore"}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Segmented Slide Switcher with Progress Lines */}
            <div className="w-full bg-slate-950/80 backdrop-blur-xl border border-white/20 p-2 rounded-2xl">
              <div className="flex items-center justify-between gap-1.5">
                {SLIDES.map((s, idx) => {
                  const isActive = idx === currentSlide;
                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      aria-label={`Switch to slide ${idx + 1}`}
                      className={`relative flex-1 py-2 px-1 rounded-xl text-center transition-all duration-300 overflow-hidden ${
                        isActive
                          ? "bg-gradient-to-r from-amber-500/30 via-yellow-500/20 to-amber-500/30 border border-amber-400/60 shadow-[0_0_15px_rgba(245,158,11,0.35)] text-amber-300 font-extrabold"
                          : "hover:bg-white/10 text-white/70 hover:text-white font-bold"
                      }`}
                    >
                      <div className="text-[10px] md:text-xs uppercase tracking-wider truncate">
                        {isBengali ? s.labelBn : s.label}
                      </div>

                      {/* Smooth Active Timer Line */}
                      {isActive && (
                        <motion.div
                          key={`timer-${currentSlide}`}
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 5.5, ease: "linear" }}
                          className="absolute bottom-0 left-0 h-[2.5px] bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 rounded-full shadow-[0_0_10px_#f59e0b]"
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

      {/* Sleek Dark Vignette Edge */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-950/80 to-transparent z-10 pointer-events-none" />
    </section>
  );
};

export default HeroSection;
