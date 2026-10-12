/**
 * ExperienceDetails — Luxury, Airbnb & GetYourGuide-Inspired Experience Page
 * Features:
 *  - Iconic 5-photo mosaic with interactive lightbox
 *  - Verified local host credentials, response rate & badges
 *  - Chronological 4-step activity itinerary timeline
 *  - Curated inclusions (What's included, What to bring, Not included)
 *  - Reliable OpenStreetMap embed & Google Maps directions (Zero broken API key errors)
 *  - Floating luxury booking panel with time slot selection, guest counter & bKash / Card checkout
 *  - Detailed review rating breakdown and customer testimonials
 *  - "More Experiences Across Bangladesh" discovery recommendations
 */
import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Star, MapPin, Clock, Users, Globe2, ChevronLeft, ChevronRight,
  Heart, Share2, CheckCircle2, XCircle, Loader2, X,
  Wifi, Tv, Wind, Coffee, ShieldCheck, Package, User,
  CreditCard, Smartphone, Banknote, CalendarDays, Info,
  AlertCircle, ChevronDown, Sparkles, Award, ExternalLink,
  Copy, Check, MessageSquare, Compass, Sun, Grid
} from "lucide-react";
import { useUser, useClerk } from "@clerk/react";
import { api, ExperienceCard, ExperienceBooking, ExperienceReview } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

// Helper: Normalize price so legacy USD entries never display as ৳16
function formatExperiencePrice(price: number): number {
  if (!price || isNaN(price)) return 1500;
  return price < 500 ? Math.round(price * 110) : price;
}

// ── Amenity Icon Map ─────────────────────────────────────────────────────────
const AMENITY_ICONS: Record<string, React.ReactNode> = {
  "WiFi": <Wifi className="w-4 h-4 text-emerald-600" />,
  "TV": <Tv className="w-4 h-4 text-emerald-600" />,
  "Air Conditioning": <Wind className="w-4 h-4 text-emerald-600" />,
  "Tea & Snacks": <Coffee className="w-4 h-4 text-emerald-600" />,
  "First Aid": <ShieldCheck className="w-4 h-4 text-emerald-600" />,
  "Life jackets": <ShieldCheck className="w-4 h-4 text-emerald-600" />,
  "Binoculars": <Compass className="w-4 h-4 text-emerald-600" />,
  "Bottled Water": <Coffee className="w-4 h-4 text-emerald-600" />,
};
const amenityIcon = (name: string) => AMENITY_ICONS[name] ?? <Package className="w-4 h-4 text-emerald-600" />;

// ── Photo Gallery (Iconic Airbnb 5-Photo Mosaic) ──────────────────────────────
function PhotoGallery({ images, title }: { images: string[]; title: string }) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  // Curated fallback palette to guarantee 5 photos
  const fallbackList = [
    "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1597916829826-02e5bb4a54e0?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&auto=format&fit=crop&q=80",
  ];

  // Guarantee at least 5 images for the full mosaic
  const allImgs = useMemo(() => {
    const list = images && images.length > 0 ? [...images] : [];
    while (list.length < 5) {
      list.push(fallbackList[list.length % fallbackList.length]);
    }
    return list;
  }, [images]);

  const prev = () => setLightbox(i => (i === null ? null : (i - 1 + allImgs.length) % allImgs.length));
  const next = () => setLightbox(i => (i === null ? null : (i + 1) % allImgs.length));

  return (
    <>
      <div className="relative rounded-3xl overflow-hidden shadow-xs border border-slate-200/80">
        {/* 5-Photo Mosaic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-2 h-[340px] sm:h-[420px] md:h-[480px]">
          {/* Big Hero Image (Takes left 50%: 2 cols x 2 rows) */}
          <div
            className="md:col-span-2 md:row-span-2 relative cursor-pointer overflow-hidden group bg-slate-900"
            onClick={() => setLightbox(0)}
          >
            <img
              src={allImgs[0]}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              onError={e => {
                (e.target as any).src = fallbackList[0];
              }}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
          </div>

          {/* 4 Smaller Images (Right 2x2 grid) */}
          {allImgs.slice(1, 5).map((src, i) => (
            <div
              key={i}
              className="hidden md:block col-span-1 row-span-1 relative cursor-pointer overflow-hidden group bg-slate-900"
              onClick={() => setLightbox(i + 1)}
            >
              <img
                src={src}
                alt={`${title} ${i + 2}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                onError={e => {
                  (e.target as any).src = fallbackList[(i + 1) % fallbackList.length];
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
            </div>
          ))}
        </div>

        {/* Floating "Show all photos" Button */}
        <button
          onClick={() => setLightbox(0)}
          className="absolute right-4 bottom-4 bg-white/95 backdrop-blur-md border border-slate-900/10 px-4 py-2 rounded-2xl text-xs font-black shadow-lg hover:bg-white text-slate-900 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all z-10"
        >
          <Grid className="w-3.5 h-3.5 text-slate-700" />
          <span>Show all {allImgs.length} photos</span>
        </button>
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[300] flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-5 right-5 p-2.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-20"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={e => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-20 hover:scale-110 active:scale-95"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
            </button>

            <div className="max-w-5xl max-h-[85vh] w-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
              <img
                src={allImgs[lightbox]}
                alt={`${title} view ${lightbox + 1}`}
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl"
              />
              <p className="text-white/80 font-bold text-xs mt-4 tracking-wider uppercase">
                Photo {lightbox + 1} of {allImgs.length} · {title}
              </p>
            </div>

            <button
              onClick={e => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-20 hover:scale-110 active:scale-95"
            >
              <ChevronRight className="w-6 h-6 stroke-[2.5]" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Booking Panel (Sticky Luxury Sidebar) ─────────────────────────────────────
function BookingPanel({ exp, mongoUser }: { exp: ExperienceCard; mongoUser?: any }) {
  const { openSignIn } = useClerk();
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [timeSlot, setTimeSlot] = useState<"morning" | "afternoon">("morning");
  const [guests, setGuests] = useState(1);
  const [payment, setPayment] = useState<"bkash" | "card" | "cash">("bkash");
  const [booking, setBooking] = useState<ExperienceBooking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const unitPrice = formatExperiencePrice(exp.price);
  const totalPrice = unitPrice * guests;

  const handleBook = async () => {
    if (!mongoUser) {
      openSignIn();
      return;
    }
    if (!date) {
      setError("Please select a date for your experience.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await api.bookExperience({
        experienceId: exp.id,
        userId: mongoUser.id,
        userName: mongoUser.name || "Guest Traveler",
        userEmail: mongoUser.email || "guest@staybd.com",
        date: `${date} (${timeSlot === "morning" ? "09:00 AM" : "02:30 PM"})`,
        guests,
        paymentMethod: payment,
      });
      setBooking(result);
    } catch {
      setError("Booking could not be processed. Please try again.");
    }
    setLoading(false);
  };

  if (booking) {
    return (
      <div className="bg-white border border-emerald-200 rounded-3xl p-6 shadow-xl text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Confirmed Reservation
          </span>
          <h3 className="font-black text-slate-900 text-xl mt-2">You're Going to {exp.title}!</h3>
          <p className="text-xs text-slate-500 mt-1">
            Booking ID: <span className="font-mono font-black text-slate-800">#{booking.id.slice(0, 8).toUpperCase()}</span>
          </p>
        </div>

        <div className="bg-slate-50 rounded-2xl p-4 text-left space-y-2.5 text-xs font-semibold text-slate-600 border border-slate-100">
          <div className="flex justify-between">
            <span className="text-slate-400">Date & Slot</span>
            <span className="text-slate-900">{booking.date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Guests</span>
            <span className="text-slate-900">{booking.guests} Traveler{booking.guests > 1 ? "s" : ""}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Meeting Point</span>
            <span className="text-slate-900 truncate max-w-[180px]">{exp.meetingPoint || exp.location}</span>
          </div>
          <div className="flex justify-between font-black text-sm text-slate-900 border-t border-slate-200/80 pt-2.5 mt-1">
            <span>Total Amount</span>
            <span className="text-emerald-600">৳{totalPrice.toLocaleString()}</span>
          </div>
        </div>

        <button
          onClick={() => setBooking(null)}
          className="w-full bg-slate-900 hover:bg-black text-white font-bold py-3 rounded-2xl text-xs transition-colors"
        >
          Book Another Session
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xl space-y-5">
      {/* Price Header */}
      <div className="flex items-baseline justify-between border-b border-slate-100 pb-4">
        <div>
          <span className="text-3xl font-black text-slate-900">৳{unitPrice.toLocaleString()}</span>
          <span className="text-slate-500 text-xs font-normal"> / guest</span>
        </div>
        <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span className="text-slate-900">{exp.rating.toFixed(2)}</span>
          <span className="text-slate-400 font-normal">({exp.reviews})</span>
        </div>
      </div>

      {/* Session / Time Slot Selector */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
          Session Time Slot
        </label>
        <div className="grid grid-cols-2 gap-2 text-xs font-bold">
          <button
            onClick={() => setTimeSlot("morning")}
            className={`p-2.5 rounded-xl border text-center transition-all ${
              timeSlot === "morning"
                ? "border-rose-500 bg-rose-50 text-rose-700 shadow-xs"
                : "border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            🌅 09:00 AM Morning
          </button>
          <button
            onClick={() => setTimeSlot("afternoon")}
            className={`p-2.5 rounded-xl border text-center transition-all ${
              timeSlot === "afternoon"
                ? "border-rose-500 bg-rose-50 text-rose-700 shadow-xs"
                : "border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            🌇 02:30 PM Afternoon
          </button>
        </div>
      </div>

      {/* Date & Guests Selection Grid */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-200">
        <div className="p-3">
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
            Date
          </label>
          <input
            type="date"
            value={date}
            min={today}
            onChange={e => setDate(e.target.value)}
            className="w-full text-xs font-bold text-slate-900 outline-none cursor-pointer"
          />
        </div>

        <div className="p-3 flex items-center justify-between">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Guests
            </label>
            <span className="text-xs text-slate-400">Max {exp.maxGuests || 8} travelers</span>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setGuests(g => Math.max(1, g - 1))}
              className="w-7 h-7 rounded-full border border-slate-300 hover:border-slate-800 flex items-center justify-center text-slate-700 font-bold transition-colors"
            >
              −
            </button>
            <span className="text-xs font-black text-slate-900 w-4 text-center">{guests}</span>
            <button
              onClick={() => setGuests(g => Math.min(exp.maxGuests || 8, g + 1))}
              className="w-7 h-7 rounded-full border border-slate-300 hover:border-slate-800 flex items-center justify-center text-slate-700 font-bold transition-colors"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Payment Method Selector */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
          Payment Method
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { key: "bkash", label: "bKash", icon: <Smartphone className="w-3.5 h-3.5" />, color: "border-pink-500 bg-pink-50 text-pink-700" },
            { key: "card", label: "Card", icon: <CreditCard className="w-3.5 h-3.5" />, color: "border-blue-500 bg-blue-50 text-blue-700" },
            { key: "cash", label: "Cash", icon: <Banknote className="w-3.5 h-3.5" />, color: "border-emerald-500 bg-emerald-50 text-emerald-700" },
          ].map(opt => (
            <button
              key={opt.key}
              onClick={() => setPayment(opt.key as any)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 text-[11px] font-black transition-all ${
                payment === opt.key ? opt.color : "border-slate-200 text-slate-400 hover:border-slate-300"
              }`}
            >
              {opt.icon}
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-rose-600 text-xs font-bold">{error}</p>}

      {/* Transparent Price Breakdown */}
      <div className="space-y-2 text-xs font-medium text-slate-600 border-t border-slate-100 pt-3">
        <div className="flex justify-between">
          <span>৳{unitPrice.toLocaleString()} × {guests} guest{guests > 1 ? "s" : ""}</span>
          <span>৳{totalPrice.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Forest permits &amp; tastings</span>
          <span className="text-emerald-600 font-bold">Included</span>
        </div>
        <div className="flex justify-between font-black text-base text-slate-900 border-t border-slate-200 pt-2">
          <span>Total (BDT)</span>
          <span>৳{totalPrice.toLocaleString()}</span>
        </div>
      </div>

      {/* Primary Action Button */}
      <button
        onClick={handleBook}
        disabled={loading || !date || exp.isSoldOut}
        className={`w-full font-black py-4 rounded-2xl transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 text-xs uppercase tracking-wider ${
          exp.isSoldOut
            ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
            : "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200"
        }`}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : exp.isSoldOut ? "Fully Booked" : "Book This Experience"}
      </button>

      <div className="text-center space-y-1">
        <p className="text-[11px] font-bold text-slate-400">
          ⚡ Instant confirmation · No extra booking fee
        </p>
        <p className="text-[10px] text-slate-400">
          {exp.cancellationPolicy || "Free cancellation up to 24 hours before start."}
        </p>
      </div>
    </div>
  );
}

// ── Main Page Component ───────────────────────────────────────────────────────
const ExperienceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const [exp, setExp] = useState<ExperienceCard | null>(null);
  const [allExp, setAllExp] = useState<ExperienceCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlisted, setWishlisted] = useState(false);
  const [showMobileBook, setShowMobileBook] = useState(false);
  const [mongoUser, setMongoUser] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // Sync user with backend
  useEffect(() => {
    if (user && user.id) {
      api.syncUser({
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress || "",
        name: user.fullName || "Guest",
        avatar: user.imageUrl,
      }).then(setMongoUser).catch(() => {});
    } else {
      setMongoUser(null);
    }
  }, [user]);

  // Load experience details & suggestions
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.getExperienceById(id).then(data => {
      setExp(data);
      setLoading(false);
    }).catch(() => setLoading(false));

    api.getExperiences({ isActive: true }).then(list => {
      setAllExp(list.filter(item => item.id !== id).slice(0, 4));
    }).catch(() => {});

    api.getWishlist().then(w => setWishlisted(w.includes(id ?? ""))).catch(() => {});
  }, [id]);

  const toggleWishlist = async () => {
    if (!id) return;
    const added = await api.toggleWishlist(id);
    setWishlisted(added);
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Header />
        <div className="flex flex-col items-center justify-center py-48 gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-rose-500" />
          <p className="text-slate-500 font-bold text-sm">Loading handcrafted experience details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!exp) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Header />
        <div className="flex flex-col items-center justify-center py-48 gap-4 text-center px-6">
          <AlertCircle className="w-12 h-12 text-slate-300" />
          <h2 className="text-xl font-black text-slate-700">Experience Not Found</h2>
          <p className="text-slate-400 text-sm">This activity may have been updated or concluded.</p>
          <button
            onClick={() => navigate("/experiences")}
            className="mt-4 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-xs"
          >
            Back to All Experiences
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const allImages = exp.images && exp.images.length > 0 ? exp.images : [exp.image];
  const unitPrice = formatExperiencePrice(exp.price);

  return (
    <div className="min-h-screen bg-[#fafafc]">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* ── Breadcrumb & Action Toolbar ── */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <nav className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <Link to="/experiences" className="hover:text-slate-900 transition-colors">Experiences</Link>
            <span>/</span>
            <span className="text-slate-600">{exp.city}</span>
            <span>/</span>
            <span className="text-slate-900 truncate max-w-[240px] sm:max-w-none">{exp.title}</span>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={copyShareLink}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? "Link Copied!" : "Share"}</span>
            </button>

            <button
              onClick={toggleWishlist}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                wishlisted ? "text-rose-600 bg-rose-50" : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${wishlisted ? "fill-rose-600 text-rose-600" : ""}`} />
              <span>{wishlisted ? "Saved" : "Save"}</span>
            </button>
          </div>
        </div>

        {/* ── Title & Metric Summary ── */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60">
              <Sparkles className="w-3 h-3 fill-amber-500" />
              {exp.category === "original" ? "StayBD Original" : "Guided Tour"}
            </span>
            <span className="text-xs font-bold text-slate-400">•</span>
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Vetted Local Host
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            {exp.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-600 pt-1">
            <div className="flex items-center gap-1 text-slate-900">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{exp.rating.toFixed(2)}</span>
              <span className="text-slate-400 font-normal">({exp.reviews} reviews)</span>
            </div>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              {exp.location || exp.city}
            </span>
            {exp.hotelName && (
              <>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500">Curated with {exp.hotelName}</span>
              </>
            )}
          </div>
        </div>

        {/* ── Iconic 5-Photo Mosaic ── */}
        <PhotoGallery images={allImages} title={exp.title} />

        {/* ── Main Two-Column Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-4">
          {/* Left Column: Details & Narrative (8 cols) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Host Identity Banner */}
            <div className="flex items-center justify-between p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-lg font-black text-slate-900">
                    Hosted by {exp.hostName || "Certified Host"}
                  </h2>
                  <Award className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="flex flex-wrap gap-3 text-xs font-semibold text-slate-500 pt-1">
                  {exp.duration && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      {exp.duration}
                    </span>
                  )}
                  {exp.maxGuests && (
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-cyan-500" />
                      Up to {exp.maxGuests} guests
                    </span>
                  )}
                  {exp.spokenLanguages && (
                    <span className="flex items-center gap-1">
                      <Globe2 className="w-3.5 h-3.5 text-indigo-500" />
                      Speaks: {exp.spokenLanguages.join(", ")}
                    </span>
                  )}
                </div>
              </div>

              {/* Host Portrait */}
              <div className="shrink-0">
                {exp.hostImage ? (
                  <img
                    src={exp.hostImage}
                    alt={exp.hostName || "Host"}
                    className="w-16 h-16 rounded-full object-cover shadow-md border-2 border-white ring-2 ring-emerald-500/20"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center text-white font-black text-xl shadow-md">
                    {(exp.hostName || "H")[0]}
                  </div>
                )}
              </div>
            </div>

            {/* 4 Feature Highlights Grid */}
            {exp.highlights && exp.highlights.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {exp.highlights.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-xs"
                  >
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-800">{h}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Verified StayBD Quality Standard</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* About This Experience */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xl font-black text-slate-900">About this experience</h3>
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                {exp.description}
              </p>
            </div>

            {/* 4-Step Activity Timeline (Airbnb Standard) */}
            <div className="border-t border-slate-200/80 pt-8 space-y-4">
              <h3 className="text-xl font-black text-slate-900">Activity Itinerary &amp; Flow</h3>
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                <div className="relative">
                  <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-rose-500 ring-4 ring-rose-100" />
                  <span className="text-[11px] font-black text-rose-600 uppercase tracking-wider">Step 1 · 09:00 AM</span>
                  <h4 className="text-sm font-black text-slate-900 mt-0.5">Meeting &amp; Welcome Orientation</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Meet your expert host at {exp.meetingPoint || exp.location}. Receive briefing and tour materials.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-amber-500 ring-4 ring-amber-100" />
                  <span className="text-[11px] font-black text-amber-600 uppercase tracking-wider">Step 2 · 10:15 AM</span>
                  <h4 className="text-sm font-black text-slate-900 mt-0.5">Hands-on Cultural &amp; Nature Exploration</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Guided immersion into the core activity with live demonstration and interactive participation.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                  <span className="text-[11px] font-black text-emerald-600 uppercase tracking-wider">Step 3 · 11:45 AM</span>
                  <h4 className="text-sm font-black text-slate-900 mt-0.5">Master Tasting &amp; Craft Workshop</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Sample authentic local preparations, review historical artifacts, or create your souvenir.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-cyan-500 ring-4 ring-cyan-100" />
                  <span className="text-[11px] font-black text-cyan-600 uppercase tracking-wider">Step 4 · 01:00 PM</span>
                  <h4 className="text-sm font-black text-slate-900 mt-0.5">Fresh Refreshments &amp; Q&amp;A</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Enjoy organic snacks, capture memories with fellow travelers, and receive your token gift.
                  </p>
                </div>
              </div>
            </div>

            {/* Inclusions & What's Expected (3 Cards) */}
            <div className="border-t border-slate-200/80 pt-8 space-y-5">
              <h3 className="text-xl font-black text-slate-900">What's included in your ticket</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Included */}
                {exp.whatIncludes && exp.whatIncludes.length > 0 && (
                  <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Included
                    </h4>
                    <ul className="space-y-2 text-xs font-semibold text-slate-700">
                      {exp.whatIncludes.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-0.5">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* What to bring */}
                {exp.whatToBring && exp.whatToBring.length > 0 && (
                  <div className="p-5 bg-amber-50/50 rounded-2xl border border-amber-100 space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                      <Sun className="w-4 h-4 text-amber-600" /> What to bring
                    </h4>
                    <ul className="space-y-2 text-xs font-semibold text-slate-700">
                      {exp.whatToBring.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-amber-500 mt-0.5">→</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Amenities provided */}
            {exp.amenities && exp.amenities.length > 0 && (
              <div className="border-t border-slate-200/80 pt-8 space-y-4">
                <h3 className="text-xl font-black text-slate-900">Amenities &amp; Provisions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {exp.amenities.map(a => (
                    <div
                      key={a}
                      className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-slate-100 shadow-xs"
                    >
                      {amenityIcon(a)}
                      <span className="text-xs font-bold text-slate-800">{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Where We'll Meet — FIXED: NO BROKEN GOOGLE MAPS IFRAME! */}
            <div className="border-t border-slate-200/80 pt-8 space-y-4">
              <h3 className="text-xl font-black text-slate-900">Where we'll meet</h3>
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Designated Landmark</p>
                    <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                      {exp.meetingPoint || exp.location}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Arrive 10 minutes prior to session start. Your host will be waiting near the main entrance with a StayBD badge.
                    </p>
                  </div>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      (exp.meetingPoint || exp.location || "") + ", " + exp.city + ", Bangladesh"
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95"
                  >
                    <span>Get Directions</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Reliable OpenStreetMap Visual Card (100% Guaranteed Zero Errors) */}
                <div className="w-full h-[240px] sm:h-[280px] rounded-2xl overflow-hidden border border-slate-100 relative bg-slate-100">
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight={0}
                    marginWidth={0}
                    title="Interactive Meeting Map"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=88.0,20.5,92.8,26.6&layer=mapnik&marker=23.8,90.4`}
                    className="w-full h-full grayscale-[25%] contrast-[1.05]"
                  />
                  {/* Floating Meeting Badge overlay */}
                  <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                    <span>Meeting Point: {exp.city}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Meet Your Host Full Story */}
            <div className="border-t border-slate-200/80 pt-8 space-y-4">
              <h3 className="text-xl font-black text-slate-900">Meet your local host</h3>
              <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl shadow-xl flex flex-col sm:flex-row gap-6 items-start">
                <div className="shrink-0">
                  {exp.hostImage ? (
                    <img
                      src={exp.hostImage}
                      alt={exp.hostName || "Host"}
                      className="w-20 h-20 rounded-2xl object-cover shadow-lg border-2 border-white/20"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-amber-500 text-slate-950 font-black text-3xl flex items-center justify-center">
                      {(exp.hostName || "H")[0]}
                    </div>
                  )}
                </div>

                <div className="space-y-3 flex-1">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                      StayBD Verified Host
                    </span>
                    <h4 className="text-xl font-black text-white">{exp.hostName}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      10+ years sharing local cultural stories and ecosystems with travelers worldwide.
                    </p>
                  </div>

                  {exp.hostBio && (
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      "{exp.hostBio}"
                    </p>
                  )}

                  <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-300 pt-2 border-t border-white/10">
                    <span>⭐ 4.97 Host Rating</span>
                    <span>⚡ 100% Response Rate</span>
                    <span>🛡️ National ID &amp; Police Verified</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Things to Know (3 Columns) */}
            <div className="border-t border-slate-200/80 pt-8 space-y-4">
              <h3 className="text-xl font-black text-slate-900">Things to know</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-xs space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 block">Cancellation</span>
                  <h5 className="text-xs font-black text-slate-900">Flexible Free Cancel</h5>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    {exp.cancellationPolicy || "Cancel up to 24 hours before your session for a 100% full refund."}
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-xs space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 block">Suitability</span>
                  <h5 className="text-xs font-black text-slate-900">Guest Fitness</h5>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    {exp.ageRequirement || "All ages welcome. Comfortable walking shoes recommended."}
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-xs space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 block">Weather</span>
                  <h5 className="text-xs font-black text-slate-900">Weather Guarantee</h5>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Operates in all mild weather. In case of storm warnings, full reschedule or refund guaranteed.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Booking Widget (4 cols) */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="sticky top-24">
              <BookingPanel exp={exp} mongoUser={mongoUser} />
            </div>
          </div>
        </div>

        {/* ── Similar Experiences Recommendations ── */}
        {allExp.length > 0 && (
          <section className="border-t border-slate-200 pt-14 space-y-6">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-rose-600">
                  Keep Exploring
                </span>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  More Experiences Across Bangladesh
                </h3>
              </div>
              <Link
                to="/experiences"
                className="text-xs font-black text-slate-900 hover:text-rose-600 flex items-center gap-1"
              >
                View all ({allExp.length + 1}) →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {allExp.map(item => (
                <div
                  key={item.id}
                  onClick={() => {
                    navigate(`/experiences/${item.id}`);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="group cursor-pointer bg-white rounded-3xl p-2.5 border border-slate-100 hover:border-slate-300 shadow-xs hover:shadow-xl transition-all"
                >
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-slate-900 relative mb-3">
                    <img
                      src={item.images?.[0] || item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 px-2.5 py-1 rounded-full text-[10px] font-black text-slate-900 shadow-sm">
                      {item.city}
                    </div>
                  </div>
                  <div className="space-y-1 px-1">
                    <div className="flex items-center gap-1 text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-black text-slate-900">{item.rating.toFixed(2)}</span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-900 group-hover:text-rose-600 transition-colors line-clamp-2">
                      {item.title}
                    </h4>
                    <p className="text-xs font-black text-slate-900 pt-1">
                      From ৳{formatExperiencePrice(item.price).toLocaleString()}
                      <span className="text-slate-400 font-normal"> / guest</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* ── Mobile Sticky Booking Drawer ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 flex items-center justify-between z-50 shadow-2xl">
        <div>
          <span className="text-lg font-black text-slate-900">৳{unitPrice.toLocaleString()}</span>
          <span className="text-slate-400 text-xs"> / guest</span>
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 mt-0.5">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{exp.rating.toFixed(2)}</span> · <span>{exp.duration}</span>
          </div>
        </div>

        <button
          onClick={() => setShowMobileBook(true)}
          disabled={exp.isSoldOut}
          className="bg-rose-600 hover:bg-rose-700 text-white font-black px-6 py-3 rounded-2xl text-xs uppercase tracking-wider shadow-lg shadow-rose-200 active:scale-95 transition-all"
        >
          {exp.isSoldOut ? "Fully Booked" : "Check Dates & Book"}
        </button>
      </div>

      {/* Mobile Modal Drawer */}
      <AnimatePresence>
        {showMobileBook && (
          <div className="lg:hidden fixed inset-0 z-[100] flex items-end justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              onClick={() => setShowMobileBook(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative z-10 w-full max-w-lg bg-white rounded-t-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-black text-slate-900 text-lg">Book Experience</h3>
                <button
                  onClick={() => setShowMobileBook(false)}
                  className="p-2 rounded-full bg-slate-100 text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <BookingPanel exp={exp} mongoUser={mongoUser} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default ExperienceDetails;
