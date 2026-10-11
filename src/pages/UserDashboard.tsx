import { useEffect, useState } from "react";
import { useUser, RedirectToSignIn, useClerk } from "@clerk/react";
import { useNavigate } from "react-router-dom";
import { api, Booking, Hotel, Notification } from "../services/api";
import {
  MapPin, Calendar, Star, Send, Loader2, Bell, CheckCircle, Ban, Trash2,
  ChevronRight, MessageSquare, ShieldCheck, Gift, LifeBuoy, CreditCard,
  ChevronLeft, LayoutGrid, Compass, BookText, Headphones, Award, Sparkles,
  Ticket, QrCode, Printer, ExternalLink, Wallet, Heart, TrendingUp,
  Copy, Check, Clock, Phone, BedDouble, ArrowUpRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import Header from "../components/Header";
import Footer from "../components/Footer";
import ComplaintBox from "../components/ComplaintBox";
import ExtraServices from "../components/ExtraServices";

export default function UserDashboard() {
  const { isSignedIn, isLoaded, user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [hotels, setHotels] = useState<Record<string, Hotel>>({});
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [access, setAccess] = useState<{ hasAccess: boolean; reason?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [mongoUser, setMongoUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "wishlist">("upcoming");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Review form
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverStar, setHoverStar] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (user && user.id) {
      api.syncUser({
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress || "",
        name: user.fullName || "Guest",
        avatar: user.imageUrl,
      }).then(mu => {
        setMongoUser(mu);
        if (mu.status === "BLOCKED" || mu.status === "SUSPENDED") {
          setAccess({ hasAccess: false, reason: `Account is ${mu.status.toLowerCase()}. Please contact support.` });
        } else {
          setAccess({ hasAccess: true });
        }
      });
    }
  }, [user]);

  useEffect(() => {
    if (access && !access.hasAccess && access.reason?.includes("blocked")) {
      signOut();
    }
  }, [access, signOut]);

  useEffect(() => {
    if (!access?.hasAccess || !mongoUser) return;
    setLoading(true);
    api.getUserBookings(mongoUser.id).then(async (res) => {
      setBookings(res);

      // Fetch hotel details for images
      const hotelIds = Array.from(new Set(res.map(b => b.hotelId)));
      const hotelData: Record<string, Hotel> = {};
      await Promise.all(hotelIds.map(async (id) => {
        const h = await api.getHotelById(id);
        if (h) hotelData[id] = h;
      }));
      setHotels(hotelData);
      setLoading(false);
    });
    api.getNotifications(mongoUser.id).then(setNotifications);
  }, [access, mongoUser]);

  if (!isLoaded || access === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
        <Loader2 className="w-9 h-9 animate-spin text-emerald-600" />
      </div>
    );
  }
  if (!isSignedIn) return <RedirectToSignIn />;

  if (!access.hasAccess) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-8 text-center relative">
        <button onClick={() => signOut()} className="absolute top-8 right-8 text-gray-500 hover:text-gray-900 font-semibold px-4 py-2 border rounded-full text-sm flex gap-2 items-center">
          <Trash2 className="w-4 h-4" /> Sign Out
        </button>
        <Ban className="w-20 h-20 text-red-500 mb-6" />
        <h1 className="text-3xl font-bold text-gray-800 mb-3">Account Restricted</h1>
        <p className="text-gray-500 mb-6 max-w-sm">{access.reason}</p>
        <button onClick={() => navigate("/")} className="bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-emerald-700">
          Go to Home
        </button>
      </div>
    );
  }

  const confirmedBookings = bookings.filter(b => b.status === "CONFIRMED");
  const upcoming = confirmedBookings.filter(b => new Date(b.checkIn) >= new Date()).sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime());
  const past = confirmedBookings.filter(b => new Date(b.checkIn) < new Date()).sort((a, b) => new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime());

  const activeHotelBooking = upcoming[0] ?? past[0] ?? null;
  const activeHotelBookings = activeHotelBooking
    ? bookings.filter(b => b.hotelId === activeHotelBooking.hotelId && b.status === "CONFIRMED")
    : [];

  const now = new Date();
  const currentMonth = now.toLocaleString('default', { month: 'long', year: 'numeric' }).toUpperCase();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const bookingDays = upcoming.map(b => new Date(b.checkIn).getDate());

  const copyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleSubmitReview = async () => {
    if (!comment.trim() || !mongoUser) return;
    setSubmitting(true);
    const review: any = {
      userId: mongoUser.id,
      userName: user?.fullName || "Guest",
      hotelId: bookings[0]?.hotelId ?? "hotel_1",
      rating,
      comment,
      type: "REVIEW",
    };
    await api.addReview(review);
    setComment("");
    setSubmitted(true);
    setSubmitting(false);
    setTimeout(() => setSubmitted(false), 3000);
  };

  // Curated inspiration stays for when user has 0 bookings (Airbnb / Booking.com style)
  const curatedEscapes = [
    {
      id: "escape-1",
      name: "Sayeman Beach Resort",
      city: "Cox's Bazar",
      tag: "Oceanfront Luxury",
      price: 6500,
      originalPrice: 8500,
      rating: 4.8,
      reviews: 320,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
      link: "/hotels",
    },
    {
      id: "escape-2",
      name: "Sajek Valley Cloud Cottage",
      city: "Rangamati",
      tag: "Mountain Mist",
      price: 3200,
      originalPrice: 4200,
      rating: 4.9,
      reviews: 185,
      image: "https://images.unsplash.com/photo-1542314831-c6a4d27289b8?w=600",
      link: "/hotels",
    },
    {
      id: "escape-3",
      name: "Grand Sultan Tea Resort",
      city: "Sreemangal, Sylhet",
      tag: "Tea Retreat",
      price: 7800,
      originalPrice: 9900,
      rating: 4.7,
      reviews: 290,
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600",
      link: "/hotels",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans">
      <Header />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-8">
        {/* ══════════ TOP GREETING & GENIUS VIP TIER BANNER ══════════ */}
        <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* User Greeting & Status */}
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Verified National Traveler
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  Genius VIP Level 2
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                Welcome back, {user?.firstName ?? "Explorer"}!
              </h1>
              <p className="text-slate-300 text-sm md:text-base max-w-xl">
                Every stay is a story across Bangladesh. Unlock exclusive member savings and seamless travel benefits.
              </p>
            </div>

            {/* StayBD Rewards Wallet & Progress (Booking.com Genius + Agoda VIP Style) */}
            <div className="w-full lg:w-auto bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 shrink-0 space-y-3">
              <div className="flex items-center justify-between gap-6">
                <div>
                  <span className="text-[10px] text-slate-300 uppercase font-black tracking-widest block">Traveler Wallet</span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-2xl font-black text-amber-300">৳ 1,250</span>
                    <span className="text-xs text-slate-300 font-medium">Points</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-emerald-300 uppercase font-black tracking-widest block">Unlocked Perks</span>
                  <span className="text-xs font-bold text-white block mt-0.5">15% Off VIP Deals</span>
                </div>
              </div>

              {/* Tier Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-300">
                  <span>Level 2 (Explorer)</span>
                  <span className="text-amber-300 font-bold">1 stay to Level 3 Platinum</span>
                </div>
                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-gradient-to-r from-emerald-400 to-amber-300 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Background Elements */}
          <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-10 -bottom-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        </section>

        {/* ══════════ METRIC STATS STRIP (GoZayaan / Airbnb Style) ══════════ */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Total Stays</p>
              <p className="text-lg md:text-xl font-black text-slate-900">{confirmedBookings.length > 0 ? confirmedBookings.length : "0 Stays"}</p>
            </div>
          </div>

          <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Districts Visited</p>
              <p className="text-lg md:text-xl font-black text-slate-900">4 / 64 BD</p>
            </div>
          </div>

          <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Total Saved</p>
              <p className="text-lg md:text-xl font-black text-emerald-600">৳ 3,850</p>
            </div>
          </div>

          <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Active Vouchers</p>
              <p className="text-lg md:text-xl font-black text-slate-900">3 Available</p>
            </div>
          </div>
        </section>

        {/* ══════════ MAIN 2-COLUMN SECTION ══════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ── LEFT COLUMN (8 SPANS): BOOKINGS & ESCAPES ── */}
          <div className="lg:col-span-8 space-y-8">
            {/* Interactive Trip Tabs Bar */}
            <div className="bg-white p-2 rounded-2xl border border-slate-200 flex items-center gap-2 shadow-xs">
              <button
                onClick={() => setActiveTab("upcoming")}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                  activeTab === "upcoming"
                    ? "bg-slate-900 text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                Upcoming Stays ({upcoming.length})
              </button>

              <button
                onClick={() => setActiveTab("past")}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                  activeTab === "past"
                    ? "bg-slate-900 text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                Past Journeys ({past.length})
              </button>

              <button
                onClick={() => setActiveTab("wishlist")}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                  activeTab === "wishlist"
                    ? "bg-slate-900 text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
                Saved Wishlist
              </button>
            </div>

            {/* TAB CONTENT: UPCOMING STAYS */}
            {activeTab === "upcoming" && (
              <div className="space-y-6">
                {upcoming.length > 0 ? (
                  upcoming.map((b) => {
                    const h = hotels[b.hotelId];
                    return (
                      <motion.div
                        key={b.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition"
                      >
                        <div className="p-6 md:p-7 flex flex-col md:flex-row gap-6">
                          <img
                            src={h?.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600"}
                            alt={b.hotelName}
                            className="w-full md:w-52 h-44 rounded-2xl object-cover shrink-0"
                          />
                          <div className="flex-1 space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                                Confirmed & Guaranteed
                              </span>
                              <span className="font-mono text-xs font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                ID: {b.id}
                              </span>
                            </div>

                            <h3 className="text-xl font-black text-slate-900 leading-tight">
                              {h?.name || b.hotelName}
                            </h3>

                            <p className="text-xs text-slate-500 flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                              {h?.address || "Prime Location"}, {h?.city || "Bangladesh"}
                            </p>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                              <div>
                                <span className="text-[10px] text-slate-400 font-bold block">Check-In</span>
                                <span className="font-bold text-slate-900">{b.checkIn}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 font-bold block">Check-Out</span>
                                <span className="font-bold text-slate-900">{b.checkOut}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 font-bold block">Total Paid</span>
                                <span className="font-black text-emerald-600">BDT {b.totalPrice?.toLocaleString()}</span>
                              </div>
                            </div>

                            <div className="pt-2 flex flex-wrap gap-2.5">
                              <button
                                onClick={() => navigate(`/property/${b.hotelId}`)}
                                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition"
                              >
                                View Hotel & Room
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </button>
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${b.hotelName} Bangladesh`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition"
                              >
                                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                                Directions
                              </a>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  /* ── INSPIRATION SHOWCASE WHEN 0 BOOKINGS (Airbnb / Booking.com Style) ── */
                  <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black uppercase tracking-wider mb-1">
                          <Sparkles className="w-3 h-3 text-emerald-500" /> Member Exclusives
                        </div>
                        <h2 className="text-xl md:text-2xl font-black text-slate-900">
                          Ready for Your Next Escape?
                        </h2>
                        <p className="text-xs md:text-sm text-slate-500">
                          You have no upcoming trips scheduled. Discover handpicked luxury resorts with your Genius VIP discounts:
                        </p>
                      </div>

                      <button
                        onClick={() => navigate("/hotels")}
                        className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md transition shrink-0"
                      >
                        Explore All 64 Districts
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {curatedEscapes.map((esc) => (
                        <div
                          key={esc.id}
                          onClick={() => navigate(esc.link)}
                          className="group rounded-2xl border border-slate-200/90 overflow-hidden bg-slate-50 hover:bg-white hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col"
                        >
                          <div className="relative aspect-[16/10] overflow-hidden">
                            <img
                              src={esc.image}
                              alt={esc.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                            />
                            <span className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                              {esc.tag}
                            </span>
                            <span className="absolute bottom-2.5 right-2.5 bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
                              15% Off VIP
                            </span>
                          </div>

                          <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                            <div>
                              <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold mb-1">
                                ⭐ {esc.rating} <span className="text-slate-400">({esc.reviews} reviews)</span>
                              </div>
                              <h4 className="font-black text-slate-900 text-sm group-hover:text-emerald-700 transition leading-snug">
                                {esc.name}
                              </h4>
                              <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                <MapPin className="w-3 h-3 text-rose-500" /> {esc.city}
                              </p>
                            </div>

                            <div className="border-t border-slate-200/60 pt-3 flex items-center justify-between">
                              <div>
                                <span className="text-[10px] text-slate-400 line-through">BDT {esc.originalPrice}</span>
                                <p className="text-sm font-black text-slate-900">
                                  BDT {esc.price} <span className="text-[10px] font-normal text-slate-500">/night</span>
                                </p>
                              </div>
                              <button className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-bold text-xs group-hover:bg-emerald-600 transition">
                                Book
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: PAST JOURNEYS */}
            {activeTab === "past" && (
              <div className="space-y-4">
                {past.length > 0 ? (
                  past.map((b) => (
                    <div
                      key={b.id}
                      className="bg-white rounded-2xl p-5 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                          <CheckCircle className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900 text-base">{b.hotelName}</h4>
                          <p className="text-xs text-slate-500">{b.roomType} • {b.checkIn} to {b.checkOut}</p>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md mt-1 inline-block">
                            Completed Journey
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => navigate(`/property/${b.hotelId}`)}
                          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
                        >
                          Book Again
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-3">
                    <Compass className="w-12 h-12 text-slate-300 mx-auto" />
                    <h3 className="text-lg font-bold text-slate-900">No Past Journeys Yet</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Your completed trips will appear here with downloadable invoices, loyalty certificates, and re-booking perks.
                    </p>
                    <button
                      onClick={() => navigate("/hotels")}
                      className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
                    >
                      Explore Stays
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: WISHLIST */}
            {activeTab === "wishlist" && (
              <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-3">
                <Heart className="w-12 h-12 text-rose-400 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900">Your Saved Properties</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click the heart icon on any hotel card while browsing to save it here for quick access later.
                </p>
                <button
                  onClick={() => navigate("/hotels")}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
                >
                  Browse Hotels
                </button>
              </div>
            )}

            {/* ── EXTRA HOTEL SERVICES CATALOG (If active stay exists) ── */}
            {activeHotelBooking && (
              <section className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
                <ExtraServices
                  hotelId={activeHotelBooking.hotelId}
                  hotelName={hotels[activeHotelBooking.hotelId]?.name || activeHotelBooking.hotelName}
                  userId={mongoUser?.id}
                  bookings={activeHotelBookings}
                />
              </section>
            )}

            {/* ── FEEDBACK & REVIEW PAST STAY SECTION ── */}
            <section className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Rate & Review Your Experience</h3>
                  <p className="text-xs text-slate-500">Your feedback helps fellow travelers and elevates hospitality standards across Bangladesh.</p>
                </div>
                <div className="flex gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverStar(star)}
                      onMouseLeave={() => setHoverStar(0)}
                      className="p-1 transition hover:scale-125"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          (hoverStar || rating) >= star ? "fill-amber-400 text-amber-400" : "text-slate-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details of your room cleanliness, staff friendliness, view, and food quality..."
                  className="w-full rounded-2xl border border-slate-200 p-4 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[11px] text-slate-400">Minimum 10 characters</span>
                <button
                  disabled={submitting || !comment.trim()}
                  onClick={handleSubmitReview}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 transition"
                >
                  {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  Submit Review
                </button>
              </div>

              {submitted && (
                <p className="text-xs text-emerald-600 font-bold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                  ✔ Thank you! Your review was successfully recorded.
                </p>
              )}
            </section>
          </div>

          {/* ── RIGHT COLUMN (4 SPANS): CALENDAR, COUPONS & ASSISTANCE ── */}
          <div className="lg:col-span-4 space-y-6">
            {/* Interactive Upcoming Calendar */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Trip Calendar
                </h3>
                <span className="text-xs font-black text-slate-900">{currentMonth}</span>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-1">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                  <span key={i}>{d}</span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
                  const isStay = bookingDays.includes(d);
                  const isToday = d === now.getDate();
                  return (
                    <div
                      key={d}
                      className={`aspect-square flex items-center justify-center text-[10px] rounded-xl transition ${
                        isStay
                          ? "bg-emerald-600 text-white font-black shadow-sm"
                          : isToday
                          ? "bg-slate-900 text-white font-bold"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {d}
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-100">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-900" /> Today
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> Stay Dates
                </span>
              </div>
            </div>

            {/* Travel Wallet Vouchers & Promo Coupons (Agoda / GoZayaan Style) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Ticket className="w-3.5 h-3.5 text-rose-500" /> Promo Coupons
                </h3>
                <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                  3 Active
                </span>
              </div>

              <div className="space-y-3">
                {/* Coupon 1 */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-black text-emerald-950 block">EID FESTIVAL SPECIAL</span>
                    <span className="text-[11px] text-emerald-700">25% OFF on luxury resorts</span>
                  </div>
                  <button
                    onClick={() => copyCoupon("EID25")}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider shrink-0 transition"
                  >
                    {copiedCode === "EID25" ? "COPIED!" : "EID25"}
                  </button>
                </div>

                {/* Coupon 2 */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-black text-amber-950 block">INSTANT CASHBACK</span>
                    <span className="text-[11px] text-amber-700">৳ 500 OFF next booking</span>
                  </div>
                  <button
                    onClick={() => copyCoupon("STAYBD500")}
                    className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-black uppercase tracking-wider shrink-0 transition"
                  >
                    {copiedCode === "STAYBD500" ? "COPIED!" : "STAYBD500"}
                  </button>
                </div>

                {/* Coupon 3 */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-black text-blue-950 block">BEACH ESCAPE DEAL</span>
                    <span className="text-[11px] text-blue-700">15% OFF Cox's Bazar & Kuakata</span>
                  </div>
                  <button
                    onClick={() => copyCoupon("BEACH15")}
                    className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-wider shrink-0 transition"
                  >
                    {copiedCode === "BEACH15" ? "COPIED!" : "BEACH15"}
                  </button>
                </div>
              </div>
            </div>

            {/* Need Assistance & 24/7 Concierge Banner */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-md space-y-4 relative overflow-hidden">
              <div className="relative z-10 space-y-2">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-full">
                  <Headphones className="w-3 h-3" /> VIP Concierge
                </span>
                <h4 className="text-lg font-black text-white">Need Assistance?</h4>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Our dedicated concierge team is available 24/7 across Bangladesh to arrange airport transfers, room upgrades, or answer travel questions.
                </p>
                <div className="pt-2 flex flex-wrap gap-2.5">
                  <button
                    onClick={() => navigate("/help")}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs text-center transition"
                  >
                    Support Center
                  </button>
                  <button
                    onClick={() => navigate("/national-initiative")}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs text-center border border-white/20 transition"
                  >
                    Govt Initiative
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
