import React, { useState } from "react";
import {
    X,
    User,
    Mail,
    Phone,
    Calendar,
    Shield,
    Building2,
    Ticket,
    CreditCard,
    CheckCircle2,
    Ban,
    Clock,
    AlertTriangle,
    Eye,
    Printer,
    Sparkles,
    Check,
    FileText
} from "lucide-react";
import { UserProfile, HotelOwner, Booking, Complaint, api } from "../../../services/api";
import { Badge } from "./AdminUIElements";

interface UserDetailModalProps {
    user: UserProfile | HotelOwner;
    bookings: Booking[];
    complaints?: Complaint[];
    onClose: () => void;
    reload: () => void;
    onViewBooking?: (booking: Booking) => void;
}

export default function UserDetailModal({
    user,
    bookings,
    complaints = [],
    onClose,
    reload,
    onViewBooking
}: UserDetailModalProps) {
    const [activeTab, setActiveTab] = useState<"bookings" | "info" | "complaints">("bookings");
    const [actionLoading, setActionLoading] = useState(false);
    const [status, setStatus] = useState(user.status);
    const [role, setRole] = useState(user.role);

    // Correlate all bookings associated with this user
    const userBookings = bookings.filter(b => {
        if (b.userId && b.userId === user.id) return true;
        if (b.guestEmail && user.email && b.guestEmail.toLowerCase() === user.email.toLowerCase()) return true;
        if (b.guestName && user.name && b.guestName.toLowerCase() === user.name.toLowerCase()) return true;
        return false;
    });

    const userComplaints = complaints.filter(c => {
        if (c.userId && c.userId === user.id) return true;
        if (c.userName && user.name && c.userName.toLowerCase() === user.name.toLowerCase()) return true;
        return false;
    });

    const confirmedBookings = userBookings.filter(b => b.status === "CONFIRMED");
    const cancelledBookings = userBookings.filter(b => b.status === "CANCELLED");
    const totalSpent = confirmedBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const totalNights = userBookings.reduce((sum, b) => sum + (b.nights || 1), 0);

    const handleToggleBlock = async () => {
        const newStatus = status === "BLOCKED" ? "ACTIVE" : "BLOCKED";
        const msg = newStatus === "BLOCKED" 
            ? `Are you sure you want to BLOCK "${user.name}"? They will lose access to the platform.`
            : `Restore and ACTIVATE account for "${user.name}"?`;

        if (!window.confirm(msg)) return;

        setActionLoading(true);
        try {
            await api.updateUserStatus(user.id, newStatus);
            setStatus(newStatus);
            reload();
        } catch (err: any) {
            alert(err.message || "Failed to update user status");
        } finally {
            setActionLoading(false);
        }
    };

    const handleToggleRole = async (newRole: "USER" | "ADMIN" | "OWNER") => {
        if (!window.confirm(`Change role of "${user.name}" to ${newRole}?`)) return;

        setActionLoading(true);
        try {
            await api.updateUserRole(user.id, newRole);
            setRole(newRole);
            reload();
        } catch (err: any) {
            alert(err.message || "Failed to update role");
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl max-h-[92vh] shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/80 flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white font-black text-xl flex items-center justify-center shadow-md shadow-indigo-600/20 shrink-0">
                            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                                    {user.name}
                                </h2>
                                <Badge color={role === "ADMIN" ? "amber" : role === "OWNER" ? "purple" : "blue"}>
                                    {role === "ADMIN" ? "Super Admin" : role === "OWNER" ? "Hotel Owner" : "Guest User"}
                                </Badge>
                                <Badge color={status === "ACTIVE" ? "green" : "red"}>
                                    {status}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap font-medium">
                                <span className="flex items-center gap-1">
                                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                                    {user.email}
                                </span>
                                {user.phone && (
                                    <span className="flex items-center gap-1 text-slate-700">
                                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                                        {user.phone}
                                    </span>
                                )}
                                <span className="text-slate-400">·</span>
                                <span className="font-mono text-[11px] text-slate-400">
                                    ID: {user.id}
                                </span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* KPI Metrics Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 sm:p-6 bg-slate-50/30 border-b border-slate-100">
                    <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Total Bookings
                        </span>
                        <span className="text-xl font-black text-slate-900 flex items-center gap-1.5">
                            <Ticket className="w-4 h-4 text-indigo-600" />
                            {userBookings.length}
                        </span>
                    </div>

                    <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Lifetime Spent
                        </span>
                        <span className="text-xl font-black text-emerald-600 flex items-center gap-1">
                            <CreditCard className="w-4 h-4 text-emerald-600" />
                            ৳{totalSpent.toLocaleString()}
                        </span>
                    </div>

                    <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Nights Stayed
                        </span>
                        <span className="text-xl font-black text-slate-800 flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-purple-600" />
                            {totalNights} Nights
                        </span>
                    </div>

                    <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Complaints / Reports
                        </span>
                        <span className={`text-xl font-black ${userComplaints.length > 0 ? 'text-rose-600' : 'text-slate-700'} flex items-center gap-1.5`}>
                            <AlertTriangle className={`w-4 h-4 ${userComplaints.length > 0 ? 'text-rose-600' : 'text-slate-400'}`} />
                            {userComplaints.length}
                        </span>
                    </div>
                </div>

                {/* SubTab Navigation */}
                <div className="px-6 pt-4 border-b border-slate-100 flex items-center gap-2">
                    <button
                        onClick={() => setActiveTab("bookings")}
                        className={`pb-3 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
                            activeTab === "bookings"
                                ? "border-indigo-600 text-indigo-600"
                                : "border-transparent text-slate-500 hover:text-slate-800"
                        }`}
                    >
                        <Ticket className="w-3.5 h-3.5" />
                        <span>Reservation History ({userBookings.length})</span>
                    </button>

                    <button
                        onClick={() => setActiveTab("info")}
                        className={`pb-3 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
                            activeTab === "info"
                                ? "border-indigo-600 text-indigo-600"
                                : "border-transparent text-slate-500 hover:text-slate-800"
                        }`}
                    >
                        <User className="w-3.5 h-3.5" />
                        <span>Account & Security Controls</span>
                    </button>

                    <button
                        onClick={() => setActiveTab("complaints")}
                        className={`pb-3 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
                            activeTab === "complaints"
                                ? "border-indigo-600 text-indigo-600"
                                : "border-transparent text-slate-500 hover:text-slate-800"
                        }`}
                    >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Support Issues ({userComplaints.length})</span>
                    </button>
                </div>

                {/* Modal Body Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {/* TAB 1: RESERVATION HISTORY */}
                    {activeTab === "bookings" && (
                        <div className="space-y-3">
                            {userBookings.length > 0 ? (
                                <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
                                    <table className="w-full text-xs">
                                        <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-100">
                                            <tr>
                                                <th className="py-3 px-4 text-left">Booking Ref</th>
                                                <th className="py-3 px-4 text-left">Hotel & Room</th>
                                                <th className="py-3 px-4 text-center">Dates (In / Out)</th>
                                                <th className="py-3 px-4 text-right">Price</th>
                                                <th className="py-3 px-4 text-center">Status</th>
                                                <th className="py-3 px-4 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {userBookings.map(b => (
                                                <tr key={b.id} className="hover:bg-slate-50/70 transition">
                                                    <td className="py-3 px-4">
                                                        <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                                                            {b.id}
                                                        </span>
                                                        <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">
                                                            {b.type} · {b.paymentMethod || 'CASH'}
                                                        </p>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <p className="font-bold text-slate-900">{b.hotelName}</p>
                                                        <p className="text-[11px] text-slate-500">{b.roomType}</p>
                                                    </td>
                                                    <td className="py-3 px-4 text-center">
                                                        <div className="inline-flex items-center gap-1 text-[11px] bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                                                            <span className="font-medium text-slate-800">{b.checkIn}</span>
                                                            <span className="text-slate-400">→</span>
                                                            <span className="font-medium text-slate-800">{b.checkOut}</span>
                                                        </div>
                                                        <p className="text-[10px] text-slate-400 mt-0.5">{b.nights} night(s)</p>
                                                    </td>
                                                    <td className="py-3 px-4 text-right font-black text-slate-900 text-sm">
                                                        ৳{(b.totalPrice || 0).toLocaleString()}
                                                    </td>
                                                    <td className="py-3 px-4 text-center">
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
                                                    <td className="py-3 px-4 text-right">
                                                        {onViewBooking && (
                                                            <button
                                                                onClick={() => onViewBooking(b)}
                                                                className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition flex items-center gap-1 ml-auto border border-indigo-200"
                                                            >
                                                                <Eye className="w-3.5 h-3.5" />
                                                                <span>Voucher</span>
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="py-16 text-center bg-slate-50/50 rounded-2xl border border-slate-200/80">
                                    <Ticket className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                                    <p className="text-slate-800 font-bold text-sm">No reservations on record</p>
                                    <p className="text-slate-400 text-xs">This user has not completed any hotel bookings yet.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB 2: ACCOUNT & SECURITY CONTROLS */}
                    {activeTab === "info" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Account Metadata */}
                            <div className="bg-slate-50/60 rounded-2xl p-5 border border-slate-200/90 space-y-3.5">
                                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Account Identity & Registration
                                </h3>

                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                                        <span className="text-slate-500 font-medium">Registered Name</span>
                                        <span className="font-bold text-slate-900">{user.name}</span>
                                    </div>
                                    <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                                        <span className="text-slate-500 font-medium">Email Address</span>
                                        <span className="font-bold text-slate-900">{user.email}</span>
                                    </div>
                                    <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                                        <span className="text-slate-500 font-medium">Phone Number</span>
                                        <span className="font-bold text-slate-900">{user.phone || "Not Provided"}</span>
                                    </div>
                                    <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                                        <span className="text-slate-500 font-medium">Member Since</span>
                                        <span className="font-bold text-slate-900">
                                            {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-1.5">
                                        <span className="text-slate-500 font-medium">Database ID</span>
                                        <span className="font-mono text-slate-600">{user.id}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Direct Admin Privileges Control */}
                            <div className="bg-slate-50/60 rounded-2xl p-5 border border-slate-200/90 space-y-4">
                                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Administrative Authority & Access
                                </h3>

                                <div className="space-y-3">
                                    {/* Status Toggle */}
                                    <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-bold text-slate-900">Account Access State</p>
                                            <p className="text-[11px] text-slate-500">Currently {status}</p>
                                        </div>
                                        <button
                                            onClick={handleToggleBlock}
                                            disabled={actionLoading}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                                                status === "BLOCKED"
                                                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                                    : "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200"
                                            }`}
                                        >
                                            {status === "BLOCKED" ? "Unblock Account" : "Block User"}
                                        </button>
                                    </div>

                                    {/* Role Change */}
                                    <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
                                        <p className="text-xs font-bold text-slate-900">Privilege Role Escalation</p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleToggleRole("USER")}
                                                disabled={role === "USER" || actionLoading}
                                                className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition ${
                                                    role === "USER"
                                                        ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                                                        : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
                                                }`}
                                            >
                                                Guest
                                            </button>
                                            <button
                                                onClick={() => handleToggleRole("OWNER")}
                                                disabled={role === "OWNER" || actionLoading}
                                                className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition ${
                                                    role === "OWNER"
                                                        ? "bg-purple-50 border-purple-200 text-purple-700"
                                                        : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
                                                }`}
                                            >
                                                Owner
                                            </button>
                                            <button
                                                onClick={() => handleToggleRole("ADMIN")}
                                                disabled={role === "ADMIN" || actionLoading}
                                                className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition ${
                                                    role === "ADMIN"
                                                        ? "bg-amber-50 border-amber-200 text-amber-700"
                                                        : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
                                                }`}
                                            >
                                                Admin
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 3: COMPLAINTS & ISSUES */}
                    {activeTab === "complaints" && (
                        <div className="space-y-3">
                            {userComplaints.length > 0 ? (
                                userComplaints.map(c => (
                                    <div key={c.id} className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Building2 className="w-4 h-4 text-indigo-600" />
                                                <span className="font-bold text-slate-900 text-xs">{c.hotelName}</span>
                                            </div>
                                            <Badge color={c.status === "Pending" ? "amber" : c.status === "In Progress" ? "blue" : "green"}>
                                                {c.status}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-slate-600 italic">"{c.description}"</p>
                                        <p className="text-[10px] text-slate-400">
                                            Filed on: {new Date(c.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="py-16 text-center bg-slate-50/50 rounded-2xl border border-slate-200/80">
                                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                                    <p className="text-slate-800 font-bold text-sm">Clean Record!</p>
                                    <p className="text-slate-400 text-xs">No disputes or complaints filed by this user.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">
                        StayBD Platform Profile Registry
                    </span>
                    <button
                        onClick={onClose}
                        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}
