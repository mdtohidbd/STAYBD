import React, { useState } from "react";
import {
    Ticket,
    LogIn,
    LogOut,
    Ban,
    Sparkles,
    Search,
    Download,
    CheckCircle,
    Clock,
    Phone,
    Mail,
    Filter,
    Calendar,
    Eye,
    UserCheck,
    Printer,
    Briefcase,
    Globe,
    CreditCard
} from "lucide-react";
import { api, Booking, UserProfile, HotelOwner, Complaint } from "../../../services/api";
import { Badge, ActionBtn } from "../components/AdminUIElements";
import BookingDetailModal from "../components/BookingDetailModal";
import UserDetailModal from "../components/UserDetailModal";

interface BookingsPanelProps {
    bookings: Booking[];
    users?: (UserProfile | HotelOwner)[];
    complaints?: Complaint[];
    reload: () => void;
}

export default function BookingsPanel({ bookings, users = [], complaints = [], reload }: BookingsPanelProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [typeFilter, setTypeFilter] = useState<string>("ALL");
    const [selectedBookingForModal, setSelectedBookingForModal] = useState<Booking | null>(null);
    const [selectedUserForModal, setSelectedUserForModal] = useState<UserProfile | HotelOwner | null>(null);

    // Filter logic
    const filteredBookings = bookings.filter(b => {
        const matchesSearch =
            !searchTerm ||
            b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (b.guestName && b.guestName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (b.guestEmail && b.guestEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (b.guestPhone && b.guestPhone.includes(searchTerm)) ||
            (b.hotelName && b.hotelName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (b.specialRequests && b.specialRequests.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus = statusFilter === "ALL" || b.status === statusFilter;
        const matchesType = typeFilter === "ALL" || b.type === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
    });

    const totalRevenue = bookings
        .filter(b => b.status === "CONFIRMED")
        .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    const exportToCSV = () => {
        const headers = [
            "Booking ID", "Guest Name", "Guest Email", "Guest Phone", "Country", 
            "Hotel Name", "Room Type", "Check In", "Check Out", "Nights", 
            "Arrival Time", "Business Stay", "Special Requests", 
            "Payment Method", "Status", "Total Price"
        ];
        const rows = filteredBookings.map(b => [
            b.id,
            `"${b.guestName || ''}"`,
            b.guestEmail || '',
            b.guestPhone || '',
            b.country || 'Bangladesh',
            `"${b.hotelName || ''}"`,
            `"${b.roomType || ''}"`,
            b.checkIn,
            b.checkOut,
            b.nights,
            `"${b.arrivalTime || ''}"`,
            b.travelingForWork ? "Yes" : "No",
            `"${(b.specialRequests || '').replace(/"/g, '""')}"`,
            b.paymentMethod || 'cash',
            b.status,
            b.totalPrice || 0
        ]);
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `staybd_bookings_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Helper to open guest profile by email or name
    const handleOpenGuestProfile = (guestEmailOrName: string) => {
        const found = users.find(u => 
            (u.email && u.email.toLowerCase() === guestEmailOrName.toLowerCase()) ||
            (u.name && u.name.toLowerCase() === guestEmailOrName.toLowerCase())
        );

        if (found) {
            setSelectedUserForModal(found);
        } else {
            const virtualUser: UserProfile = {
                id: `guest_${guestEmailOrName.replace(/\W/g, '')}`,
                name: guestEmailOrName.includes('@') ? guestEmailOrName.split('@')[0] : guestEmailOrName,
                email: guestEmailOrName.includes('@') ? guestEmailOrName : 'guest@staybuddy.com',
                role: "USER",
                status: "ACTIVE",
                createdAt: new Date().toISOString()
            };
            setSelectedUserForModal(virtualUser);
        }
    };

    // Payment badge color helper
    const getPaymentBadge = (method?: string) => {
        const m = (method || "cash").toLowerCase();
        if (m.includes("bkash")) return { label: "bKash", color: "bg-pink-50 text-pink-700 border-pink-200" };
        if (m.includes("nagad")) return { label: "Nagad", color: "bg-orange-50 text-orange-700 border-orange-200" };
        if (m.includes("card")) return { label: "Card", color: "bg-blue-50 text-blue-700 border-blue-200" };
        return { label: "Cash", color: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Top Insight Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Total Reservations
                    </span>
                    <span className="text-2xl font-black text-slate-900">{bookings.length}</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Confirmed Stays
                    </span>
                    <span className="text-2xl font-black text-emerald-600">
                        {bookings.filter(b => b.status === "CONFIRMED").length}
                    </span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Confirmed Revenue
                    </span>
                    <span className="text-2xl font-black text-slate-900">
                        ৳{totalRevenue.toLocaleString()}
                    </span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Cancellations
                    </span>
                    <span className="text-2xl font-black text-rose-600">
                        {bookings.filter(b => b.status === "CANCELLED").length}
                    </span>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search guest name, phone, email, hotel, request..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs md:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
                    {/* Status Filter */}
                    <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
                        {["ALL", "CONFIRMED", "PENDING", "CANCELLED"].map(status => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-3 py-1.5 rounded-lg transition ${
                                    statusFilter === status
                                        ? "bg-indigo-600 text-white shadow-xs"
                                        : "text-slate-600 hover:text-slate-900"
                                }`}
                            >
                                {status === "ALL" ? "All Status" : status}
                            </button>
                        ))}
                    </div>

                    {/* Export Button */}
                    <button
                        onClick={exportToCSV}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-xs"
                    >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export CSV</span>
                    </button>
                </div>
            </div>

            {/* Detailed Bookings Table */}
            <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[1100px]">
                        <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
                            <tr>
                                <th className="py-4 px-6 text-left">Booking Ref & Channel</th>
                                <th className="py-4 px-6 text-left">Guest Details</th>
                                <th className="py-4 px-6 text-left">Hotel & Room</th>
                                <th className="py-4 px-6 text-left">Stay Schedule & Requests</th>
                                <th className="py-4 px-6 text-center">Status</th>
                                <th className="py-4 px-6 text-right">Payment & Price</th>
                                <th className="py-4 px-6 text-right">Front-Desk Controls</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredBookings.map(b => {
                                const payBadge = getPaymentBadge(b.paymentMethod);
                                return (
                                    <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                                        {/* Column 1: Ref & Channel */}
                                        <td className="py-4 px-6 align-top">
                                            <div className="flex flex-col items-start gap-1">
                                                <button
                                                    onClick={() => setSelectedBookingForModal(b)}
                                                    className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg border border-indigo-200 transition text-left"
                                                    title="Click to view full reservation voucher"
                                                >
                                                    #{b.id}
                                                </button>
                                                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${payBadge.color}`}>
                                                        {payBadge.label}
                                                    </span>
                                                    <Badge color={b.type === "ONLINE" ? "blue" : "amber"}>
                                                        {b.type}
                                                    </Badge>
                                                </div>
                                                {b.createdAt && (
                                                    <span className="text-[10px] text-slate-400 mt-1 font-medium">
                                                        {new Date(b.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Column 2: Guest Details */}
                                        <td className="py-4 px-6 align-top">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1.5">
                                                    <button
                                                        onClick={() => handleOpenGuestProfile(b.guestEmail || b.guestName || '')}
                                                        className="text-slate-900 font-extrabold text-xs hover:text-indigo-600 hover:underline text-left"
                                                        title="Click to inspect guest profile & all history"
                                                    >
                                                        {b.guestName || "Walk-in Guest"}
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenGuestProfile(b.guestEmail || b.guestName || '')}
                                                        className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                                                        title="View user profile"
                                                    >
                                                        <Eye className="w-3 h-3" />
                                                    </button>
                                                </div>

                                                <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                                                    <Mail className="w-3 h-3 text-slate-400" />
                                                    <span>{b.guestEmail || "No email on record"}</span>
                                                </p>

                                                {b.guestPhone ? (
                                                    <a
                                                        href={`tel:${b.guestPhone}`}
                                                        className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100 px-2 py-0.5 rounded border border-indigo-100 transition mt-0.5"
                                                        title="Click to call guest"
                                                    >
                                                        <Phone className="w-3 h-3 text-indigo-600" />
                                                        <span>{b.guestPhone}</span>
                                                    </a>
                                                ) : (
                                                    <span className="text-[10px] text-slate-400 italic">No phone provided</span>
                                                )}

                                                {b.country && b.country !== "Bangladesh" && (
                                                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                                                        <Globe className="w-3 h-3" /> {b.country}
                                                    </p>
                                                )}

                                                {b.bookingFor === "someone" && (
                                                    <span className="inline-block text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded">
                                                        Booking for someone else
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Column 3: Hotel & Room */}
                                        <td className="py-4 px-6 align-top">
                                            <div className="space-y-1">
                                                <p className="text-slate-900 font-extrabold text-xs">{b.hotelName}</p>
                                                <div className="inline-block bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded text-[11px] font-semibold">
                                                    {b.roomType} {b.roomNumber ? `· #${b.roomNumber}` : ''}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Column 4: Schedule, Arrival & Preferences */}
                                        <td className="py-4 px-6 align-top">
                                            <div className="space-y-1.5">
                                                {/* Dates & Nights */}
                                                <div className="flex items-center gap-1.5 text-xs">
                                                    <div className="inline-flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200 text-[11px]">
                                                        <span className="font-semibold text-slate-800">{b.checkIn}</span>
                                                        <span className="text-slate-400">→</span>
                                                        <span className="font-semibold text-slate-800">{b.checkOut}</span>
                                                    </div>
                                                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                                        {b.nights}N
                                                    </span>
                                                </div>

                                                {/* Arrival Time */}
                                                {b.arrivalTime && b.arrivalTime !== "I don't know" && (
                                                    <p className="text-[11px] text-slate-600 flex items-center gap-1 font-medium">
                                                        <Clock className="w-3 h-3 text-indigo-500" />
                                                        <span>Est. Arrival: {b.arrivalTime}</span>
                                                    </p>
                                                )}

                                                {/* Work Trip */}
                                                {b.travelingForWork && (
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-md">
                                                        <Briefcase className="w-3 h-3" /> Business Trip
                                                    </span>
                                                )}

                                                {/* Special Requests Callout */}
                                                {b.specialRequests && (
                                                    <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-1.5 mt-1">
                                                        <p className="text-[11px] text-amber-900 font-medium italic line-clamp-2">
                                                            <Sparkles className="w-3 h-3 text-amber-600 inline mr-1" />
                                                            "{b.specialRequests}"
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        {/* Column 5: Status */}
                                        <td className="py-4 px-6 text-center align-top">
                                            <Badge
                                                color={
                                                    b.status === "CONFIRMED"
                                                        ? "green"
                                                        : b.status === "PENDING"
                                                        ? "amber"
                                                        : "red"
                                                }
                                            >
                                                {b.status}
                                            </Badge>
                                        </td>

                                        {/* Column 6: Price & Billing */}
                                        <td className="py-4 px-6 text-right align-top">
                                            <p className="font-black text-slate-900 text-sm">
                                                ৳{(b.totalPrice || 0).toLocaleString()}
                                            </p>
                                            <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">
                                                {b.paymentMethod || "CASH"}
                                            </p>
                                        </td>

                                        {/* Column 7: Actions */}
                                        <td className="py-4 px-6 align-top">
                                            <div className="flex flex-col items-end gap-1.5">
                                                {/* Full Voucher */}
                                                <button
                                                    onClick={() => setSelectedBookingForModal(b)}
                                                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition flex items-center gap-1 shadow-xs"
                                                    title="View complete voucher and guest details"
                                                >
                                                    <Eye className="w-3.5 h-3.5 text-indigo-600" />
                                                    <span>Voucher</span>
                                                </button>

                                                {b.status === "CONFIRMED" && (
                                                    <div className="flex items-center gap-1">
                                                        <ActionBtn
                                                            icon={<LogIn className="w-3 h-3" />}
                                                            label="Check-In"
                                                            color="green"
                                                            onClick={async () => {
                                                                await api.processCheckIn(b.id);
                                                                reload();
                                                            }}
                                                        />
                                                        <ActionBtn
                                                            icon={<LogOut className="w-3 h-3" />}
                                                            label="Check-Out"
                                                            color="slate"
                                                            onClick={async () => {
                                                                await api.processCheckOut(b.id);
                                                                reload();
                                                            }}
                                                        />
                                                        <button
                                                            onClick={async () => {
                                                                if (window.confirm(`Cancel booking ${b.id}?`)) {
                                                                    await api.cancelBooking(b.id);
                                                                    reload();
                                                                }
                                                            }}
                                                            title="Cancel reservation"
                                                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 border border-rose-200 transition"
                                                        >
                                                            <Ban className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}

                            {filteredBookings.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="py-16 text-center">
                                        <Ticket className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                                        <p className="text-slate-600 font-bold text-sm">No reservations found</p>
                                        <p className="text-slate-400 text-xs">Try adjusting your filters or search query.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Booking Detail Modal */}
            {selectedBookingForModal && (
                <BookingDetailModal
                    booking={selectedBookingForModal}
                    onClose={() => setSelectedBookingForModal(null)}
                    reload={reload}
                    onInspectGuest={(emailOrName) => {
                        setSelectedBookingForModal(null);
                        handleOpenGuestProfile(emailOrName);
                    }}
                />
            )}

            {/* User Detail Modal */}
            {selectedUserForModal && (
                <UserDetailModal
                    user={selectedUserForModal}
                    bookings={bookings}
                    complaints={complaints}
                    onClose={() => setSelectedUserForModal(null)}
                    reload={reload}
                    onViewBooking={(b) => setSelectedBookingForModal(b)}
                />
            )}
        </div>
    );
}
