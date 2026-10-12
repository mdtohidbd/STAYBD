import React from "react";
import {
    Users,
    Building2,
    AlertTriangle,
    BookOpen,
    CreditCard,
    CheckCircle,
    X,
    LogIn,
    Shield,
    Flag,
    LogOut,
    TrendingUp,
    Compass,
    Sparkles,
    Calendar,
    ArrowUpRight,
    HelpCircle,
    ChevronRight
} from "lucide-react";
import { StatCard } from "../components/AdminUIElements";
import { Hotel, Booking } from "../../../services/api";

interface StatsPanelProps {
    stats: any;
    bookings: Booking[];
    hotels: Hotel[];
    onNavigateTab?: (tab: any) => void;
}

export default function StatsPanel({ stats, bookings, hotels, onNavigateTab }: StatsPanelProps) {
    if (!stats) return null;

    const confirmedCount = bookings.filter(b => b.status === "CONFIRMED").length;
    const cancelledCount = bookings.filter(b => b.status === "CANCELLED").length;
    const onlineCount = bookings.filter(b => b.type === "ONLINE").length;
    const walkInCount = bookings.filter(b => b.type === "OFFLINE").length;

    const verifiedHotels = hotels.filter(h => h.isActive && h.isVerified).length;
    const flaggedHotels = hotels.filter(h => h.isRedMarked).length;
    const pendingHotels = hotels.filter(h => !h.isVerified).length;
    const inactiveHotels = hotels.filter(h => !h.isActive).length;

    const recentBookings = [...bookings].reverse().slice(0, 5);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Executive Welcome & Highlights Banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-indigo-700/10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-2 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold backdrop-blur-md">
                            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                            <span>StayBD National Hospitality Platform · Live Cloud Oversight</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                            Executive Platform Overview
                        </h2>
                        <p className="text-sm text-indigo-100 font-medium leading-relaxed">
                            Real-time intelligence across 64 districts. Overseeing registered guests, verified property operators, room inventory, and instant reservation flows.
                        </p>
                    </div>

                    {/* Quick Stat Highlights Pill */}
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
                        <div className="px-4 py-2 text-center border-r border-white/10">
                            <span className="block text-[11px] uppercase font-bold text-indigo-200 tracking-wider">Gross Platform Yield</span>
                            <span className="text-xl md:text-2xl font-black text-white">
                                ৳{(stats.totalRevenuePlatform || 0).toLocaleString()}
                            </span>
                        </div>
                        <div className="px-4 py-2 text-center">
                            <span className="block text-[11px] uppercase font-bold text-indigo-200 tracking-wider">Active Properties</span>
                            <span className="text-xl md:text-2xl font-black text-white">
                                {stats.activeHotels || hotels.length}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Core KPI Metrics - Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Registered Guests"
                    value={stats.totalUsers}
                    color="indigo"
                    icon={<Users className="w-5 h-5" />}
                    subLabel="Active Consumer Base"
                />
                <StatCard
                    label="Hotel Partners & Owners"
                    value={stats.totalOwners}
                    color="purple"
                    icon={<Building2 className="w-5 h-5" />}
                    subLabel="Registered Operators"
                />
                <StatCard
                    label="Active Listed Hotels"
                    value={stats.activeHotels}
                    color="emerald"
                    icon={<Building2 className="w-5 h-5" />}
                    subLabel="Operational Hospitality"
                />
                <StatCard
                    label="Pending Verifications"
                    value={stats.pending || 0}
                    color="amber"
                    icon={<AlertTriangle className="w-5 h-5" />}
                    subLabel="Awaiting Admin Review"
                    alert={(stats.pending || 0) > 0}
                />
            </div>

            {/* Core KPI Metrics - Row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Total Bookings"
                    value={stats.totalBookings || bookings.length}
                    color="blue"
                    icon={<BookOpen className="w-5 h-5" />}
                    subLabel="Lifetime Completed & Live"
                />
                <StatCard
                    label="Today's Bookings"
                    value={stats.todayBookings || 0}
                    color="purple"
                    icon={<Calendar className="w-5 h-5" />}
                    subLabel="New Reservations Today"
                />
                <StatCard
                    label="Platform Commission (10%)"
                    value={`৳${(stats.totalRevenuePlatform || 0).toLocaleString()}`}
                    color="green"
                    icon={<CreditCard className="w-5 h-5" />}
                    subLabel="Direct Platform Accrual"
                />
                <StatCard
                    label="Guest Support Tickets"
                    value={stats.complaints || 0}
                    color="red"
                    icon={<AlertTriangle className="w-5 h-5" />}
                    subLabel="Disputes & Complaints"
                    alert={(stats.complaints || 0) > 0}
                />
            </div>

            {/* Visual Breakdown Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Booking Distribution */}
                <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-7 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                                Reservation Channels & Status
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">Booking distribution and channel flow metrics</p>
                        </div>
                        <span className="text-xs font-bold text-slate-400 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full">
                            Total: {bookings.length}
                        </span>
                    </div>

                    <div className="space-y-4">
                        {[
                            { label: "Confirmed Reservations", count: confirmedCount, color: "bg-emerald-500", textCol: "text-emerald-700", bgLight: "bg-emerald-50", icon: <CheckCircle className="w-4 h-4" /> },
                            { label: "Cancelled Bookings", count: cancelledCount, color: "bg-rose-500", textCol: "text-rose-700", bgLight: "bg-rose-50", icon: <X className="w-4 h-4" /> },
                            { label: "Direct Online Portal", count: onlineCount, color: "bg-blue-500", textCol: "text-blue-700", bgLight: "bg-blue-50", icon: <CreditCard className="w-4 h-4" /> },
                            { label: "Front-desk Walk-in", count: walkInCount, color: "bg-amber-500", textCol: "text-amber-700", bgLight: "bg-amber-50", icon: <LogIn className="w-4 h-4" /> },
                        ].map(row => {
                            const pct = Math.round((row.count / (bookings.length || 1)) * 100);
                            return (
                                <div key={row.label} className="p-3 rounded-2xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-xl ${row.bgLight} ${row.textCol} flex items-center justify-center`}>
                                                {row.icon}
                                            </div>
                                            <span className="text-xs font-bold text-slate-700">{row.label}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-base font-extrabold text-slate-900 mr-2">{row.count}</span>
                                            <span className="text-xs font-semibold text-slate-400">({pct}%)</span>
                                        </div>
                                    </div>
                                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${row.color} rounded-full transition-all duration-700`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Hotel Network Status */}
                <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-7 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                                National Hotel Quality & Health
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">Verification status and operational integrity</p>
                        </div>
                        <span className="text-xs font-bold text-slate-400 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full">
                            Total: {hotels.length}
                        </span>
                    </div>

                    <div className="space-y-4">
                        {[
                            { label: "Verified & Operational", count: verifiedHotels, color: "bg-emerald-500", textCol: "text-emerald-700", bgLight: "bg-emerald-50", icon: <Shield className="w-4 h-4" /> },
                            { label: "High Risk / Flagged", count: flaggedHotels, color: "bg-rose-500", textCol: "text-rose-700", bgLight: "bg-rose-50", icon: <Flag className="w-4 h-4" /> },
                            { label: "Verification Queue", count: pendingHotels, color: "bg-amber-500", textCol: "text-amber-700", bgLight: "bg-amber-50", icon: <AlertTriangle className="w-4 h-4" /> },
                            { label: "Offline / Paused Assets", count: inactiveHotels, color: "bg-slate-400", textCol: "text-slate-700", bgLight: "bg-slate-100", icon: <LogOut className="w-4 h-4" /> },
                        ].map(row => {
                            const pct = Math.round((row.count / (hotels.length || 1)) * 100);
                            return (
                                <div key={row.label} className="p-3 rounded-2xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-xl ${row.bgLight} ${row.textCol} flex items-center justify-center`}>
                                                {row.icon}
                                            </div>
                                            <span className="text-xs font-bold text-slate-700">{row.label}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-base font-extrabold text-slate-900 mr-2">{row.count}</span>
                                            <span className="text-xs font-semibold text-slate-400">({pct}%)</span>
                                        </div>
                                    </div>
                                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${row.color} rounded-full transition-all duration-700`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Recent Bookings Live Preview Table */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                            Recent Platform Reservations
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Live snapshot of incoming reservations across Bangladesh
                        </p>
                    </div>
                    {onNavigateTab && (
                        <button
                            onClick={() => onNavigateTab("bookings")}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition"
                        >
                            <span>Manage All Bookings</span>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-100">
                            <tr>
                                <th className="py-3.5 px-6">Booking ID</th>
                                <th className="py-3.5 px-6">Guest Info</th>
                                <th className="py-3.5 px-6">Hotel Property</th>
                                <th className="py-3.5 px-6">Check In / Out</th>
                                <th className="py-3.5 px-6 text-right">Total Price</th>
                                <th className="py-3.5 px-6 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {recentBookings.map((b) => (
                                <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                                    <td className="py-3.5 px-6">
                                        <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                                            {b.id}
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-6">
                                        <p className="font-bold text-slate-900 text-xs">{b.guestName || "Guest"}</p>
                                        <p className="text-[11px] text-slate-400">{b.guestEmail || "No Email"}</p>
                                    </td>
                                    <td className="py-3.5 px-6">
                                        <p className="font-semibold text-slate-800 text-xs">{b.hotelName}</p>
                                        <p className="text-[11px] text-slate-400">{b.roomType}</p>
                                    </td>
                                    <td className="py-3.5 px-6 text-xs text-slate-600">
                                        <span className="font-medium text-slate-800">{b.checkIn}</span>
                                        <span className="text-slate-400 mx-1.5">→</span>
                                        <span className="font-medium text-slate-800">{b.checkOut}</span>
                                    </td>
                                    <td className="py-3.5 px-6 text-right font-extrabold text-slate-900 text-sm">
                                        ৳{(b.totalPrice || 0).toLocaleString()}
                                    </td>
                                    <td className="py-3.5 px-6 text-center">
                                        <span
                                            className={`inline-block px-2.5 py-1 text-[11px] font-bold rounded-full ${
                                                b.status === "CONFIRMED"
                                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                    : b.status === "PENDING"
                                                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                                                    : "bg-rose-50 text-rose-700 border border-rose-200"
                                            }`}
                                        >
                                            {b.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {recentBookings.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                                        No reservations found in the platform.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
