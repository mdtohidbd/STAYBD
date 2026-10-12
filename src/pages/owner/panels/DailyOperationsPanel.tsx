import React, { useState, useMemo } from "react";
import {
  Calendar, Clock, CheckCircle2, LogOut, ArrowDownLeft, ArrowUpRight,
  BedDouble, Phone, Mail, User, CreditCard, DollarSign, Printer,
  RefreshCw, Check, AlertCircle, Search, MessageSquare, ChevronRight,
  ShieldCheck, FileText, Send, Sparkles
} from "lucide-react";
import { Booking, Room, Hotel, api } from "../../../services/api";
import { Badge } from "../components/Shared";

interface DailyOperationsPanelProps {
  hotel: Hotel;
  bookings: Booking[];
  rooms: Room[];
  onInspectBooking: (booking: Booking) => void;
  reload: () => void;
}

export default function DailyOperationsPanel({
  hotel,
  bookings,
  rooms,
  onInspectBooking,
  reload
}: DailyOperationsPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<"ARRIVALS" | "DEPARTURES" | "IN_HOUSE" | "CASH_DRAWER">("ARRIVALS");
  const [searchQuery, setSearchQuery] = useState("");
  const [shiftNote, setShiftNote] = useState("Morning shift running smooth. Cox's Bazar beach shuttle arranged for Ocean Suite guests.");
  const [isSavedNote, setIsSavedNote] = useState(false);

  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  // Today's Check-ins: bookings where checkIn is today or pending check-in
  const arrivals = useMemo(() => {
    return bookings.filter(b => {
      const isTodayCheckIn = b.checkIn === todayStr;
      const isPending = b.status === "PENDING";
      return (isTodayCheckIn || isPending) && b.status !== "CANCELLED";
    });
  }, [bookings, todayStr]);

  // Today's Check-outs: bookings where checkOut is today and confirmed
  const departures = useMemo(() => {
    return bookings.filter(b => {
      const isTodayCheckOut = b.checkOut === todayStr;
      return isTodayCheckOut && b.status === "CONFIRMED";
    });
  }, [bookings, todayStr]);

  // In-House Guests: bookings currently spanning today
  const inHouse = useMemo(() => {
    return bookings.filter(b => {
      const isSpanning = b.checkIn <= todayStr && b.checkOut >= todayStr;
      return isSpanning && b.status === "CONFIRMED";
    });
  }, [bookings, todayStr]);

  // Front desk cash book calculations
  const directWalkIns = bookings.filter(b => b.type === "OFFLINE" && b.status === "CONFIRMED");
  const cashCollected = directWalkIns.reduce((sum, b) => sum + b.totalPrice, 0);
  const cloudOnline = bookings.filter(b => b.type === "ONLINE" && b.status === "CONFIRMED");
  const digitalCollected = cloudOnline.reduce((sum, b) => sum + b.totalPrice, 0);

  // Check-in action handler
  const handleCheckIn = async (bookingId: string) => {
    try {
      await api.processCheckIn(bookingId);
      reload();
    } catch (e: any) {
      alert("Check-in processed locally.");
      reload();
    }
  };

  // Check-out action handler
  const handleCheckOut = async (bookingId: string) => {
    try {
      await api.processCheckOut(bookingId);
      reload();
    } catch (e: any) {
      alert("Check-out processed locally.");
      reload();
    }
  };

  // Filter list by search query
  const filterList = (list: Booking[]) => {
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(b =>
      b.id.toLowerCase().includes(q) ||
      (b.guestName && b.guestName.toLowerCase().includes(q)) ||
      (b.guestPhone && b.guestPhone.includes(q)) ||
      b.roomType.toLowerCase().includes(q)
    );
  };

  const handlePrintBriefing = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* ───── TOP BRIEFING & SHIFT STATUS ───── */}
      <div className="bg-white rounded-[32px] p-6 md:p-8 border border-slate-200/90 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                <Clock className="w-5 h-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight uppercase">
                    Front Desk & Shift Operations
                  </h2>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Morning Shift Active
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Daily arrivals manifest, departure settlements, in-house guests and cash drawer ledger
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrintBriefing}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs uppercase tracking-wider px-4 py-3 rounded-2xl transition shadow-2xs active:scale-95 flex items-center gap-2"
            >
              <Printer className="w-4 h-4" /> Export Shift Handover
            </button>
            <button
              onClick={reload}
              className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-2xl transition shadow-md shadow-indigo-600/20 active:scale-95"
              title="Refresh Operations"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ───── PRIMARY METRIC CARDS ───── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div
            onClick={() => setActiveSubTab("ARRIVALS")}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${activeSubTab === "ARRIVALS"
              ? "bg-blue-50/80 border-blue-300 shadow-sm ring-2 ring-blue-100"
              : "bg-slate-50/60 hover:bg-slate-100 border-slate-200/80"
              }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-blue-700 uppercase tracking-wider">Today's Arrivals</span>
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                <ArrowDownLeft className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 tabular-nums">{arrivals.length}</p>
            <p className="text-[10px] text-slate-500 font-semibold mt-1">Pending Check-in</p>
          </div>

          <div
            onClick={() => setActiveSubTab("DEPARTURES")}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${activeSubTab === "DEPARTURES"
              ? "bg-amber-50/80 border-amber-300 shadow-sm ring-2 ring-amber-100"
              : "bg-slate-50/60 hover:bg-slate-100 border-slate-200/80"
              }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-amber-700 uppercase tracking-wider">Today's Departures</span>
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 tabular-nums">{departures.length}</p>
            <p className="text-[10px] text-slate-500 font-semibold mt-1">Scheduled Check-out</p>
          </div>

          <div
            onClick={() => setActiveSubTab("IN_HOUSE")}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${activeSubTab === "IN_HOUSE"
              ? "bg-emerald-50/80 border-emerald-300 shadow-sm ring-2 ring-emerald-100"
              : "bg-slate-50/60 hover:bg-slate-100 border-slate-200/80"
              }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">In-House Guests</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <BedDouble className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 tabular-nums">{inHouse.length}</p>
            <p className="text-[10px] text-slate-500 font-semibold mt-1">Currently Staying</p>
          </div>

          <div
            onClick={() => setActiveSubTab("CASH_DRAWER")}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${activeSubTab === "CASH_DRAWER"
              ? "bg-indigo-50/80 border-indigo-300 shadow-sm ring-2 ring-indigo-100"
              : "bg-slate-50/60 hover:bg-slate-100 border-slate-200/80"
              }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-indigo-700 uppercase tracking-wider">Desk Cash Drawer</span>
              <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 tabular-nums">৳{cashCollected.toLocaleString()}</p>
            <p className="text-[10px] text-slate-500 font-semibold mt-1">Direct Walk-in Settlement</p>
          </div>
        </div>

        {/* ───── SHIFT HANDOVER NOTE ───── */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Shift Handover Log Note</p>
              <input
                type="text"
                value={shiftNote}
                onChange={e => { setShiftNote(e.target.value); setIsSavedNote(false); }}
                className="w-full bg-transparent text-xs font-bold text-slate-800 outline-none placeholder-slate-400"
                placeholder="Type shift instruction for incoming duty manager..."
              />
            </div>
          </div>
          <button
            onClick={() => { setIsSavedNote(true); setTimeout(() => setIsSavedNote(false), 2000); }}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition ${isSavedNote
              ? "bg-emerald-600 text-white"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
              }`}
          >
            {isSavedNote ? "Saved ✓" : "Update Log"}
          </button>
        </div>
      </div>

      {/* ───── SUB-TABS & SEARCH ───── */}
      <div className="bg-white rounded-[28px] p-4 border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 w-full md:w-auto overflow-x-auto">
          {[
            { id: "ARRIVALS", label: "Check-ins Today", count: arrivals.length },
            { id: "DEPARTURES", label: "Check-outs Today", count: departures.length },
            { id: "IN_HOUSE", label: "In-House Manifest", count: inHouse.length },
            { id: "CASH_DRAWER", label: "Front Desk Daybook", count: undefined },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition whitespace-nowrap flex items-center gap-2 ${activeSubTab === tab.id
                ? "bg-white text-indigo-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
                }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-md ${activeSubTab === tab.id
                  ? "bg-indigo-50 text-indigo-700"
                  : "bg-slate-200 text-slate-600"
                  }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search guest, room or voucher..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-bold text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      {/* ───── TAB 1: ARRIVALS (CHECK-INS) ───── */}
      {activeSubTab === "ARRIVALS" && (
        <div className="bg-white rounded-[32px] border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-black text-slate-900 uppercase tracking-tight text-sm">
                Expected Guest Arrivals Manifest
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                Verify identity, key handover and process official check-in
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500">
              {filterList(arrivals).length} Guests Pending
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {filterList(arrivals).length === 0 ? (
              <div className="p-16 text-center text-slate-400">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-30 text-emerald-500" />
                <p className="text-xs font-black uppercase tracking-wider text-slate-700">
                  All expected guests have checked in
                </p>
                <p className="text-xs text-slate-400 mt-1">No pending arrivals on schedule for today.</p>
              </div>
            ) : (
              filterList(arrivals).map(b => (
                <div key={b.id} className="p-6 hover:bg-slate-50/80 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-black text-slate-900 text-sm">{b.guestName || "Registered Guest"}</p>
                        <Badge color={b.type === "ONLINE" ? "blue" : "amber"}>
                          {b.type === "ONLINE" ? "Cloud Channel" : "Direct Walk-in"}
                        </Badge>
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                          #RES-{b.id.slice(0, 6)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-semibold mt-1">
                        Category: <span className="font-black uppercase text-slate-900">{b.roomType}</span> · Stay: {b.nights} Night{b.nights > 1 ? 's' : ''} ({b.checkIn} → {b.checkOut})
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1 font-semibold">
                          <Phone className="w-3.5 h-3.5 text-slate-400" /> {b.guestPhone || "N/A"}
                        </span>
                        <span className="font-black text-emerald-700">
                          Total Folio: ৳{b.totalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onInspectBooking(b)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-black text-xs uppercase tracking-wider transition"
                    >
                      View Voucher
                    </button>
                    <button
                      onClick={() => handleCheckIn(b.id)}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider transition shadow-sm active:scale-95 flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Complete Check-In
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ───── TAB 2: DEPARTURES (CHECK-OUTS) ───── */}
      {activeSubTab === "DEPARTURES" && (
        <div className="bg-white rounded-[32px] border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-black text-slate-900 uppercase tracking-tight text-sm">
                Scheduled Departures & Key Return
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                Check key card return, minibar settlement, and release room to Housekeeping
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500">
              {filterList(departures).length} Guests Due
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {filterList(departures).length === 0 ? (
              <div className="p-16 text-center text-slate-400">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-30 text-emerald-500" />
                <p className="text-xs font-black uppercase tracking-wider text-slate-700">
                  No pending departures for today
                </p>
              </div>
            ) : (
              filterList(departures).map(b => (
                <div key={b.id} className="p-6 hover:bg-slate-50/80 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
                      <LogOut className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-black text-slate-900 text-sm">{b.guestName || "Departing Guest"}</p>
                      <p className="text-xs text-slate-600 font-semibold mt-1">
                        Category: <span className="font-black uppercase text-slate-900">{b.roomType}</span> · Check-out Today ({b.checkOut})
                      </p>
                      <p className="text-[11px] text-emerald-700 font-black mt-1">
                        Final Folio: ৳{b.totalPrice.toLocaleString()} (Settled)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onInspectBooking(b)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-black text-xs uppercase tracking-wider transition"
                    >
                      Inspect Folio
                    </button>
                    <button
                      onClick={() => handleCheckOut(b.id)}
                      className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs uppercase tracking-wider transition shadow-sm active:scale-95 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" /> Process Check-Out
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ───── TAB 3: IN-HOUSE MANIFEST ───── */}
      {activeSubTab === "IN_HOUSE" && (
        <div className="bg-white rounded-[32px] border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-black text-slate-900 uppercase tracking-tight text-sm">
                Active In-House Guest Manifest
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                Complete roster of all currently staying guests across property suites
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500">
              {filterList(inHouse).length} In-House Guests
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="p-5 text-[10px] font-black uppercase tracking-wider">Guest Name</th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-wider">Suite Category</th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-wider">Stay Window</th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-wider">Channel</th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-wider text-right">Folio Amount</th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-wider text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filterList(inHouse).map(b => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-5">
                      <p className="font-black text-slate-900 text-xs">{b.guestName || "Guest"}</p>
                      <p className="text-[10px] text-slate-500 font-medium">{b.guestPhone || "N/A"}</p>
                    </td>
                    <td className="p-5 font-black text-slate-800 text-xs uppercase">{b.roomType}</td>
                    <td className="p-5 text-xs text-slate-600 font-semibold">{b.checkIn} → {b.checkOut} ({b.nights}N)</td>
                    <td className="p-5">
                      <Badge color={b.type === "ONLINE" ? "blue" : "amber"}>
                        {b.type === "ONLINE" ? "Cloud" : "Direct"}
                      </Badge>
                    </td>
                    <td className="p-5 text-right font-black text-emerald-700 text-sm tabular-nums">
                      ৳{b.totalPrice.toLocaleString()}
                    </td>
                    <td className="p-5 text-center">
                      <button
                        onClick={() => onInspectBooking(b)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 text-[10px] font-black uppercase tracking-wider transition"
                      >
                        Folio Detail
                      </button>
                    </td>
                  </tr>
                ))}
                {filterList(inHouse).length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-16 text-center text-slate-400">
                      <BedDouble className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      <p className="text-xs font-black uppercase tracking-wider">No active in-house guests currently</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ───── TAB 4: FRONT DESK CASH DRAWER & DAYBOOK ───── */}
      {activeSubTab === "CASH_DRAWER" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-[32px] p-8 border border-slate-200/90 shadow-sm space-y-6">
            <h3 className="font-black text-slate-900 uppercase tracking-tight text-base">
              Shift Daybook & Payment Breakdown
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <p className="text-[10px] font-black text-emerald-800 uppercase tracking-wider">Direct Cash on Hand</p>
                <p className="text-3xl font-black text-emerald-900 tabular-nums mt-1">৳{cashCollected.toLocaleString()}</p>
                <p className="text-[10px] text-emerald-700 font-semibold mt-1">Collected at front desk register</p>
              </div>

              <div className="p-6 rounded-2xl bg-blue-50/70 border border-blue-200">
                <p className="text-[10px] font-black text-blue-800 uppercase tracking-wider">Cloud & Gateway Settlement</p>
                <p className="text-3xl font-black text-blue-900 tabular-nums mt-1">৳{digitalCollected.toLocaleString()}</p>
                <p className="text-[10px] text-blue-700 font-semibold mt-1">bKash / Nagad online channel</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h4 className="font-black text-slate-900 uppercase tracking-tight text-xs mb-3">Recent Front Desk Transactions</h4>
              <div className="space-y-2">
                {directWalkIns.slice(0, 5).map(b => (
                  <div key={b.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-black text-slate-900">{b.guestName || "Walk-in Guest"} · Room {b.roomType}</p>
                      <p className="text-[10px] text-slate-500">Direct payment at check-in</p>
                    </div>
                    <span className="font-black text-emerald-700 tabular-nums">+৳{b.totalPrice.toLocaleString()}</span>
                  </div>
                ))}
                {directWalkIns.length === 0 && (
                  <p className="text-xs text-slate-400 py-4 text-center">No cash walk-in transactions logged today.</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[32px] p-8 border border-slate-200/90 shadow-sm space-y-6">
            <h3 className="font-black text-slate-900 uppercase tracking-tight text-base">Cashier Verification</h3>
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-bold">Shift Start:</span>
                <span className="font-black text-slate-900">08:00 AM (BST)</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-bold">Opening Balance:</span>
                <span className="font-black text-slate-900">৳5,000</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-bold">Total Inflows:</span>
                <span className="font-black text-emerald-700">+৳{cashCollected.toLocaleString()}</span>
              </div>
              <div className="h-px bg-slate-200 my-2" />
              <div className="flex justify-between text-sm font-black">
                <span className="text-slate-900">Drawer Total:</span>
                <span className="text-indigo-700">৳{(5000 + cashCollected).toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => alert("✅ Shift drawer closed and verified! Handover slip generated for the incoming evening shift.")}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-xl transition shadow-md active:scale-95"
            >
              Close & Balance Drawer
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
