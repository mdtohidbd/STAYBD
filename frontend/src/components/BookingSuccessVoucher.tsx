import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle2, Printer, Calendar, MapPin, Copy, Check,
  Share2, Phone, ShieldCheck, Sparkles, QrCode, ArrowRight,
  Clock, Gift, Compass, FileText, ChevronRight, MessageSquare,
  Building, User, Mail, BedDouble, ExternalLink, Award
} from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import { Hotel, Room } from "../services/api";

interface BookingSuccessVoucherProps {
  booking: any;
  hotel: (Hotel & { rooms?: Room[] }) | null;
  selectedRoom: Room | null;
  checkIn: string;
  checkOut: string;
  nights: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  paymentMethod: string;
  specialRequests?: string;
}

export default function BookingSuccessVoucher({
  booking,
  hotel,
  selectedRoom,
  checkIn,
  checkOut,
  nights,
  guestName,
  guestEmail,
  guestPhone,
  paymentMethod,
  specialRequests,
}: BookingSuccessVoucherProps) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const bookingId = booking?.id || `SB-RES-${Math.floor(100000 + Math.random() * 900000)}`;
  const hotelName = hotel?.name || booking?.hotelName || "Luxury Stay";
  const hotelCity = hotel?.city || "Bangladesh";
  const hotelAddress = hotel?.address || "Prime Tourism Hub, Bangladesh";
  const hotelImg = hotel?.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200";
  const roomType = selectedRoom?.type || booking?.roomType || "Deluxe Suite";
  const roomCategory = selectedRoom?.category || "Premium King";
  const totalPrice = booking?.totalPrice || (selectedRoom?.discountPrice || selectedRoom?.pricePerNight || 3500) * (nights || 1);
  const earnedPoints = Math.round(totalPrice * 0.05);

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  const copyBookingId = () => {
    navigator.clipboard.writeText(bookingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Google Calendar URL generator
  const getGoogleCalendarUrl = () => {
    try {
      const startDate = checkIn ? checkIn.replace(/-/g, "") + "T140000Z" : "";
      const endDate = checkOut ? checkOut.replace(/-/g, "") + "T120000Z" : "";
      const title = encodeURIComponent(`Hotel Stay: ${hotelName}`);
      const details = encodeURIComponent(`StayBD Confirmation: ${bookingId}\nRoom: ${roomType}\nContact: ${guestPhone || "Via StayBD"}`);
      const location = encodeURIComponent(`${hotelName}, ${hotelAddress}`);
      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}`;
    } catch {
      return "#";
    }
  };

  const getGoogleMapsUrl = () => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hotelName} ${hotelCity} Bangladesh`)}`;
  };

  // Floating celebration confetti pieces
  const confettiItems = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: -20 - Math.random() * 40,
    size: 6 + Math.random() * 8,
    color: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#14b8a6'][i % 6],
    rotation: Math.random() * 360,
    delay: Math.random() * 0.5,
  }));

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans print:bg-white print:p-0">
      <div className="print:hidden">
        <Header />
      </div>

      {/* Floating Confetti Effect (Framer Motion) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-40 print:hidden">
        {confettiItems.map((c) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 1, y: -20, x: `${c.x}vw`, rotate: 0 }}
            animate={{
              opacity: [1, 1, 0],
              y: '100vh',
              rotate: c.rotation + 720,
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: c.delay,
              ease: "easeOut",
            }}
            style={{
              position: "absolute",
              width: c.size,
              height: c.size * (c.id % 2 === 0 ? 1 : 1.8),
              backgroundColor: c.color,
              borderRadius: c.id % 3 === 0 ? "50%" : "2px",
            }}
          />
        ))}
      </div>

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* ── TOP HERO CONFIRMATION BANNER ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden mb-8"
        >
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
                <CheckCircle2 className="w-10 h-10 md:w-12 md:h-12 text-emerald-300 drop-shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                  National Verified Reservation
                </div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight">
                  Your booking is confirmed!
                </h1>
                <p className="text-emerald-100 text-sm md:text-base mt-1">
                  We've sent your official booking confirmation & e-voucher to <strong className="text-white underline">{guestEmail}</strong>.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => window.print()}
                className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/20 backdrop-blur-md transition-all active:scale-95"
              >
                <Printer className="w-4 h-4" />
                Print Voucher
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 transition-all active:scale-95"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Decorative Background Accents */}
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-40 -top-10 w-48 h-48 bg-teal-300/10 rounded-full blur-2xl pointer-events-none" />
        </motion.div>

        {/* ── MAIN CONTENT GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ══════════ LEFT COLUMN: OFFICIAL BOARDING PASS & VOUCHER ══════════ */}
          <div className="lg:col-span-8 space-y-6">
            {/* The Digital Guest Pass Card (Boarding Pass Layout) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-lg overflow-hidden relative print:shadow-none print:border-slate-400"
            >
              {/* Pass Top Branding Header */}
              <div className="bg-slate-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
                    <img src="/Logo.png" alt="StayBD" className="w-6 h-6 object-contain" />
                  </div>
                  <div>
                    <span className="text-sm font-black tracking-wider uppercase text-slate-200">
                      Stay<span className="text-emerald-400">BD</span> Digital Guest Pass
                    </span>
                    <span className="block text-[10px] text-emerald-400/90 font-medium">Civil Aviation & BPC Aligned</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-slate-800 px-3 py-1 rounded-lg border border-slate-700 flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Pass ID:</span>
                    <span className="text-xs font-mono font-black text-amber-300">{bookingId}</span>
                  </div>
                  <button
                    onClick={copyBookingId}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    title="Copy Booking ID"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Pass Content Body */}
              <div className="p-6 md:p-8 space-y-6">
                {/* Hotel Summary Header */}
                <div className="flex flex-col sm:flex-row gap-5 items-start">
                  <img
                    src={hotelImg}
                    alt={hotelName}
                    className="w-full sm:w-36 h-32 rounded-2xl object-cover shadow-sm border border-slate-100"
                  />
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold uppercase tracking-wide">
                        Verified Stay
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                        ⭐ {hotel?.rating || "4.8"} / 5.0
                      </span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
                      {hotelName}
                    </h2>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      {hotelAddress}, {hotelCity}
                    </p>
                    <p className="text-xs text-indigo-600 font-bold pt-1">
                      {roomType} • {roomCategory}
                    </p>
                  </div>
                </div>

                {/* Dashed Tear-Off Separator with Notches */}
                <div className="relative py-2">
                  <div className="border-t-2 border-dashed border-slate-200 w-full" />
                  <div className="absolute -left-10 -top-2 w-6 h-6 bg-[#F8FAFC] rounded-full border-r border-slate-200 print:hidden" />
                  <div className="absolute -right-10 -top-2 w-6 h-6 bg-[#F8FAFC] rounded-full border-l border-slate-200 print:hidden" />
                </div>

                {/* Key Stay Timings & Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Check-In</span>
                    <span className="text-xs md:text-sm font-black text-slate-900 block">{formatDisplayDate(checkIn)}</span>
                    <span className="text-[11px] font-medium text-emerald-600 block flex items-center gap-1">
                      <Clock className="w-3 h-3" /> From 2:00 PM
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Check-Out</span>
                    <span className="text-xs md:text-sm font-black text-slate-900 block">{formatDisplayDate(checkOut)}</span>
                    <span className="text-[11px] font-medium text-amber-600 block flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Until 12:00 PM
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Duration</span>
                    <span className="text-xs md:text-sm font-black text-slate-900 block">{nights} Night{nights > 1 ? "s" : ""}</span>
                    <span className="text-[11px] text-slate-500 block">1 Room • 2 Guests</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Status</span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
                    </span>
                  </div>
                </div>

                {/* Guest & Room Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl border border-slate-100 bg-white space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-500" /> Primary Guest Details
                    </span>
                    <p className="text-sm font-bold text-slate-900">{guestName}</p>
                    <p className="text-slate-600 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" /> {guestEmail}
                    </p>
                    {guestPhone && (
                      <p className="text-slate-600 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" /> {guestPhone}
                      </p>
                    )}
                  </div>

                  <div className="p-4 rounded-xl border border-slate-100 bg-white space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <BedDouble className="w-3.5 h-3.5 text-slate-500" /> Room Amenities & Perks
                    </span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                        🍳 Complimentary Breakfast
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                        📶 High-Speed WiFi
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                        ❄️ Air Conditioned
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                        🏊 Pool & Fitness Access
                      </span>
                    </div>
                    {specialRequests && (
                      <p className="text-[11px] text-slate-500 pt-1 italic">
                        Special Requests: "{specialRequests}"
                      </p>
                    )}
                  </div>
                </div>

                {/* QR Code & Reception Check-in Strip */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex flex-col sm:flex-row items-center justify-between gap-5">
                  <div className="flex items-center gap-4">
                    {/* Visual QR Code Generator */}
                    <div className="w-20 h-20 bg-white p-1.5 rounded-xl shrink-0 shadow-md flex items-center justify-center">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=StayBD-Booking-${bookingId}`}
                        alt="Check-in QR"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                        <QrCode className="w-4 h-4 text-emerald-400" />
                        Contactless Reception Pass
                      </h4>
                      <p className="text-slate-300 text-xs mt-0.5">
                        Present this QR code or Booking ID <span className="font-mono text-amber-300 font-bold">{bookingId}</span> at the hotel reception upon check-in.
                      </p>
                      <span className="inline-block mt-2 text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                        ✔ Instant Key Delivery Guaranteed
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 text-center sm:text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">PIN Code</span>
                    <span className="text-lg font-mono font-black text-amber-300">4829</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ── AIRCOVER & GUARANTEE BADGE (Airbnb & Booking.com style) ── */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h4 className="text-sm font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-1.5">
                  StayBD AirCover Protection Included
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded-full">
                    FREE
                  </span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  100% Booking Guarantee: If the host cancels or room is unavailable, we find you a comparable or better stay, or 100% instant refund.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer shrink-0">
                Learn more
              </span>
            </div>
          </div>

          {/* ══════════ RIGHT COLUMN: QUICK ACTIONS & PAYMENT SUMMARY ══════════ */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Actions Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                Trip Quick Actions
              </h3>

              <a
                href={getGoogleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-slate-800 text-xs font-bold flex items-center justify-between transition group"
              >
                <span className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  Add to Google Calendar
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
              </a>

              <a
                href={getGoogleMapsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 text-slate-800 text-xs font-bold flex items-center justify-between transition group"
              >
                <span className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  Get Directions (Google Maps)
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
              </a>

              <button
                onClick={() => window.print()}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center justify-between transition"
              >
                <span className="flex items-center gap-2.5">
                  <Printer className="w-4 h-4 text-slate-600" />
                  Download PDF / Print
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => navigate("/experiences")}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 text-slate-800 text-xs font-bold flex items-center justify-between transition group"
              >
                <span className="flex items-center gap-2.5">
                  <Compass className="w-4 h-4 text-purple-600" />
                  Explore Local Experiences
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600" />
              </button>
            </div>

            {/* Payment Breakdown Card (GoZayaan style) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Payment Receipt
                </h3>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {paymentMethod === "Cash" ? "Pay at Hotel" : "Paid via bKash / Card"}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Room Charge ({nights} Night{nights > 1 ? "s" : ""})</span>
                  <span className="font-bold text-slate-800">BDT {totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Govt VAT & Tourism Cess (15%)</span>
                  <span className="font-semibold text-emerald-600">Included (৳ 0)</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Service Fee</span>
                  <span className="font-semibold text-emerald-600">Free (৳ 0)</span>
                </div>
                <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline">
                  <span className="text-sm font-black text-slate-900">Total Amount</span>
                  <span className="text-xl font-black text-slate-900">BDT {totalPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Reward Points Pill */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-xs">
                  <span className="font-black text-slate-900 block">+{earnedPoints} StayBD Points Earned!</span>
                  <span className="text-slate-500 text-[10px]">Credited to your Traveler Wallet</span>
                </div>
              </div>
            </div>

            {/* Need Help / 24/7 Concierge */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md space-y-3">
              <h4 className="text-sm font-black text-white flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                24/7 National Tourism Concierge
              </h4>
              <p className="text-slate-300 text-xs leading-relaxed">
                Need to adjust check-in time or request airport pickup? Our concierge is on standby.
              </p>
              <div className="pt-1 flex gap-2">
                <button
                  onClick={() => navigate("/help")}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs text-center transition"
                >
                  Help Desk
                </button>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="flex-1 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs text-center border border-white/20 transition"
                >
                  My Stays
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}
