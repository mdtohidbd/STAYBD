import React, { useState } from "react";
import {
    Users,
    Building2,
    Ban,
    Shield,
    Plus,
    CheckCircle,
    RefreshCw,
    AlertTriangle,
    BarChart3,
    Search,
    UserCheck,
    Eye,
    CreditCard,
    Ticket,
    ExternalLink,
    MapPin,
    FileText,
    Phone,
    Award
} from "lucide-react";
import { api, UserProfile, HotelOwner, Hotel, Booking, Complaint } from "../../../services/api";
import { Badge, ActionBtn } from "../components/AdminUIElements";
import { AddOwnerModal, OwnerInsightModal } from "../components/AdminModals";
import UserDetailModal from "../components/UserDetailModal";
import BookingDetailModal from "../components/BookingDetailModal";

interface UserManagementPanelProps {
    users: (UserProfile | HotelOwner)[];
    hotels: Hotel[];
    bookings: Booking[];
    complaints?: Complaint[];
    reload: () => void;
    showAddOwner: boolean;
    setShowAddOwner: (v: boolean) => void;
}

export default function UserManagementPanel({
    users,
    hotels,
    bookings,
    complaints = [],
    reload,
    showAddOwner,
    setShowAddOwner
}: UserManagementPanelProps) {
    const [roleFilter, setRoleFilter] = useState<"ALL" | "USER" | "OWNER" | "ADMIN">("ALL");
    const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "BLOCKED" | "SUSPENDED">("ALL");
    const [search, setSearch] = useState("");
    const [confirmAction, setConfirmAction] = useState<{ label: string; onConfirm: () => void } | null>(null);
    const [viewingOwner, setViewingOwner] = useState<HotelOwner | null>(null);
    const [selectedUserForDetail, setSelectedUserForDetail] = useState<UserProfile | HotelOwner | null>(null);
    const [selectedBookingForDetail, setSelectedBookingForDetail] = useState<Booking | null>(null);

    const allUsers = users;

    const filtered = allUsers.filter(u => {
        if (roleFilter !== "ALL" && u.role !== roleFilter) return false;
        if (statusFilter !== "ALL" && u.status !== statusFilter) return false;
        if (search && !u.name?.toLowerCase().includes(search.toLowerCase()) && !u.email?.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    const totalUsers = allUsers.filter(u => u.role === "USER").length;
    const totalOwners = allUsers.filter(u => u.role === "OWNER").length;
    const totalAdmins = allUsers.filter(u => u.role === "ADMIN").length;
    const blocked = allUsers.filter(u => u.status === "BLOCKED").length;

    const ask = (label: string, fn: () => void) => setConfirmAction({ label, onConfirm: fn });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Quick KPI Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Platform Guests", value: totalUsers, color: "text-indigo-600", bg: "bg-indigo-50 border-indigo-100", icon: <Users className="w-5 h-5 text-indigo-600" /> },
                    { label: "Hotel Operators", value: totalOwners, color: "text-purple-600", bg: "bg-purple-50 border-purple-100", icon: <Building2 className="w-5 h-5 text-purple-600" /> },
                    { label: "Blocked Accounts", value: blocked, color: "text-rose-600", bg: "bg-rose-50 border-rose-100", icon: <Ban className="w-5 h-5 text-rose-600" /> },
                    { label: "System Admins", value: totalAdmins, color: "text-amber-600", bg: "bg-amber-50 border-amber-100", icon: <Shield className="w-5 h-5 text-amber-600" /> },
                ].map(c => (
                    <div key={c.label} className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{c.label}</p>
                            <p className={`text-2xl font-black ${c.color}`}>{c.value}</p>
                        </div>
                        <div className={`w-11 h-11 rounded-xl ${c.bg} border flex items-center justify-center`}>
                            {c.icon}
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
                <div className="relative w-full lg:w-96">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search by name, email..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs md:text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
                    {/* Role Filter Tabs */}
                    <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
                        {(["ALL", "USER", "OWNER", "ADMIN"] as const).map(f => (
                            <button
                                key={f}
                                onClick={() => setRoleFilter(f)}
                                className={`px-3 py-1.5 rounded-lg transition ${
                                    roleFilter === f
                                        ? "bg-indigo-600 text-white shadow-xs"
                                        : "text-slate-600 hover:text-slate-900"
                                }`}
                            >
                                {f === "USER" ? "Guests" : f === "OWNER" ? "Owners" : f === "ADMIN" ? "Admins" : "All Roles"}
                            </button>
                        ))}
                    </div>

                    {/* Status Filter Tabs */}
                    <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
                        {(["ALL", "ACTIVE", "BLOCKED"] as const).map(f => (
                            <button
                                key={f}
                                onClick={() => setStatusFilter(f)}
                                className={`px-3 py-1.5 rounded-lg transition ${
                                    statusFilter === f
                                        ? "bg-slate-900 text-white shadow-xs"
                                        : "text-slate-600 hover:text-slate-900"
                                }`}
                            >
                                {f === "ALL" ? "All Status" : f}
                            </button>
                        ))}
                    </div>

                    {/* Quick Add Owner */}
                    <button
                        onClick={() => setShowAddOwner(true)}
                        className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Owner</span>
                    </button>
                </div>
            </div>

            {/* Sections */}
            {roleFilter === "ADMIN" || (roleFilter === "ALL" && filtered.some(u => u.role === "ADMIN")) ? (
                <AdminSection
                    title="System Administrators"
                    rows={filtered.filter(u => u.role === "ADMIN")}
                    ask={ask}
                    reload={reload}
                    onViewUser={setSelectedUserForDetail}
                />
            ) : null}

            {roleFilter !== "USER" && roleFilter !== "ADMIN" && filtered.some(u => u.role === "OWNER") && (
                <OwnerSection
                    title="Hotel Partners & Property Owners"
                    rows={filtered.filter(u => u.role === "OWNER") as HotelOwner[]}
                    hotels={hotels}
                    bookings={bookings}
                    ask={ask}
                    reload={reload}
                    onViewInsight={setViewingOwner}
                    onViewUser={setSelectedUserForDetail}
                />
            )}

            {roleFilter !== "OWNER" && roleFilter !== "ADMIN" && filtered.some(u => u.role === "USER") && (
                <UserSection
                    title="Registered Guests"
                    rows={filtered.filter(u => u.role === "USER")}
                    bookings={bookings}
                    ask={ask}
                    reload={reload}
                    onViewUser={setSelectedUserForDetail}
                />
            )}

            {filtered.length === 0 && (
                <div className="bg-white rounded-3xl border border-slate-200/90 p-16 text-center text-slate-500">
                    <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="font-bold text-slate-800 text-sm">No accounts match your criteria</p>
                    <p className="text-xs text-slate-400 mt-0.5">Try searching with a different name or email.</p>
                </div>
            )}

            {/* User Detail Modal */}
            {selectedUserForDetail && (
                <UserDetailModal
                    user={selectedUserForDetail}
                    bookings={bookings}
                    complaints={complaints}
                    onClose={() => setSelectedUserForDetail(null)}
                    reload={reload}
                    onViewBooking={(b) => setSelectedBookingForDetail(b)}
                />
            )}

            {/* Booking Detail Modal from within user history */}
            {selectedBookingForDetail && (
                <BookingDetailModal
                    booking={selectedBookingForDetail}
                    onClose={() => setSelectedBookingForDetail(null)}
                    reload={reload}
                />
            )}

            {/* Confirm Action Modal */}
            {confirmAction && (
                <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 w-full max-w-sm shadow-2xl text-center">
                        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <h4 className="text-slate-900 font-extrabold text-lg mb-2">Confirm Action</h4>
                        <p className="text-slate-600 text-xs leading-relaxed mb-6">{confirmAction.label}</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setConfirmAction(null)}
                                className="flex-1 border border-slate-200 text-slate-700 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    confirmAction.onConfirm();
                                    setConfirmAction(null);
                                }}
                                className="flex-1 bg-rose-600 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-rose-700 transition shadow-sm"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Owner Insight / Control Modal */}
            {viewingOwner && (
                <OwnerInsightModal
                    owner={viewingOwner}
                    hotels={hotels.filter(h => h.ownerId === viewingOwner.id)}
                    bookings={bookings}
                    onClose={() => setViewingOwner(null)}
                    ask={ask}
                    reload={reload}
                />
            )}

            {showAddOwner && <AddOwnerModal onClose={() => setShowAddOwner(false)} reload={reload} />}
        </div>
    );
}

function AdminSection({ title, rows, ask, reload, onViewUser }: {
    title: string;
    rows: UserProfile[];
    ask: (label: string, fn: () => void) => void;
    reload: () => void;
    onViewUser: (user: UserProfile) => void;
}) {
    return (
        <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-amber-600" />
                    <h3 className="text-sm font-extrabold text-slate-900">{title}</h3>
                </div>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                    {rows.length} Admins
                </span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[750px]">
                    <thead className="bg-slate-50/50 text-slate-500 uppercase text-[11px] font-bold tracking-wider border-b border-slate-100">
                        <tr>
                            <th className="py-3.5 px-6 text-left">Admin Identity</th>
                            <th className="py-3.5 px-6 text-center">Status</th>
                            <th className="py-3.5 px-6 text-center">Privilege Level</th>
                            <th className="py-3.5 px-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {rows.map(u => (
                            <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                                <td className="py-3.5 px-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center font-bold text-xs">
                                            {u.name?.charAt(0) || "A"}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-xs">{u.name}</p>
                                            <p className="text-[11px] text-slate-500">{u.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3.5 px-6 text-center">
                                    <Badge color="green">ACTIVE</Badge>
                                </td>
                                <td className="py-3.5 px-6 text-center">
                                    <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">
                                        Super Admin
                                    </span>
                                </td>
                                <td className="py-3.5 px-6 text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                        <button
                                            onClick={() => onViewUser(u)}
                                            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition flex items-center gap-1 shadow-xs"
                                            title="View full profile details"
                                        >
                                            <Eye className="w-3.5 h-3.5 text-indigo-600" />
                                            <span>Profile</span>
                                        </button>
                                        <ActionBtn
                                            onClick={() => ask(`DEMOTE administrator "${u.name}" to regular Guest?`, async () => { await api.updateUserRole(u.id, "USER"); reload(); })}
                                            color="slate" label="Demote" icon={<Users className="w-3.5 h-3.5" />}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function UserSection({ title, rows, bookings, ask, reload, onViewUser }: {
    title: string;
    rows: UserProfile[];
    bookings: Booking[];
    ask: (label: string, fn: () => void) => void;
    reload: () => void;
    onViewUser: (user: UserProfile) => void;
}) {
    return (
        <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-sm font-extrabold text-slate-900">{title}</h3>
                </div>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                    {rows.length} Guests
                </span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[850px]">
                    <thead className="bg-slate-50/50 text-slate-500 uppercase text-[11px] font-bold tracking-wider border-b border-slate-100">
                        <tr>
                            <th className="py-3.5 px-6 text-left">User Identity</th>
                            <th className="py-3.5 px-6 text-center">Stays / Bookings</th>
                            <th className="py-3.5 px-6 text-center">Status</th>
                            <th className="py-3.5 px-6 text-center">Joined Date</th>
                            <th className="py-3.5 px-6 text-right">Administrative Controls</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {rows.map(u => {
                            const uBookings = bookings.filter(b => 
                                (b.userId && b.userId === u.id) || 
                                (b.guestEmail && u.email && b.guestEmail.toLowerCase() === u.email.toLowerCase())
                            );
                            const uTotalSpent = uBookings.filter(b => b.status === "CONFIRMED").reduce((sum, b) => sum + (b.totalPrice || 0), 0);

                            return (
                                <tr key={u.id} className={`hover:bg-slate-50/60 transition-colors ${u.status === "BLOCKED" ? "bg-rose-50/30" : ""}`}>
                                    <td className="py-3.5 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center font-bold text-xs">
                                                {u.name?.charAt(0) || "U"}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 text-xs">{u.name}</p>
                                                <p className="text-[11px] text-slate-500">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3.5 px-6 text-center">
                                        <div className="inline-flex flex-col items-center">
                                            <span className="font-bold text-slate-900 text-xs flex items-center gap-1">
                                                <Ticket className="w-3 h-3 text-indigo-600" />
                                                {uBookings.length} Bookings
                                            </span>
                                            {uTotalSpent > 0 && (
                                                <span className="text-[10px] text-emerald-600 font-extrabold">
                                                    ৳{uTotalSpent.toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-3.5 px-6 text-center">
                                        <Badge color={u.status === "ACTIVE" ? "green" : u.status === "BLOCKED" ? "red" : "amber"}>
                                            {u.status}
                                        </Badge>
                                    </td>
                                    <td className="py-3.5 px-6 text-center text-xs text-slate-500">
                                        {new Date(u.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </td>
                                    <td className="py-3.5 px-6">
                                        <div className="flex justify-end items-center gap-1.5">
                                            {/* Full Profile View */}
                                            <button
                                                onClick={() => onViewUser(u)}
                                                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition flex items-center gap-1 shadow-xs"
                                                title="View full user history and details"
                                            >
                                                <Eye className="w-3.5 h-3.5 text-indigo-600" />
                                                <span>Details</span>
                                            </button>

                                            <ActionBtn
                                                onClick={() => ask(`PROMOTE "${u.name}" to SYSTEM ADMIN?`, async () => { await api.updateUserRole(u.id, "ADMIN"); reload(); })}
                                                color="slate" label="Admin" icon={<Shield className="w-3.5 h-3.5" />}
                                            />
                                            {u.status === "BLOCKED" ? (
                                                <ActionBtn
                                                    onClick={() => ask(`Restore access for "${u.name}"?`, async () => { await api.updateUserStatus(u.id, "ACTIVE"); reload(); })}
                                                    color="green" label="Unblock" icon={<CheckCircle className="w-3.5 h-3.5" />}
                                                />
                                            ) : (
                                                <ActionBtn
                                                    onClick={() => ask(`Block account access for "${u.name}"?`, async () => { await api.updateUserStatus(u.id, "BLOCKED"); reload(); })}
                                                    color="red" label="Block" icon={<Ban className="w-3.5 h-3.5" />}
                                                />
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function OwnerSection({ title, rows, hotels, bookings, ask, reload, onViewInsight, onViewUser }: {
    title: string;
    rows: HotelOwner[];
    hotels: Hotel[];
    bookings: Booking[];
    ask: (label: string, fn: () => void) => void;
    reload: () => void;
    onViewInsight: (owner: HotelOwner) => void;
    onViewUser: (user: HotelOwner) => void;
}) {
    const handleLaunchOwnerPortal = (owner: HotelOwner) => {
        // Set authenticated owner session in localStorage so /owner opens seamlessly
        const sessionUser = {
            id: owner.id,
            _id: owner.id,
            name: owner.name,
            email: owner.email,
            phone: owner.phone || "+880 1712-345678",
            role: "OWNER",
            status: owner.status,
            verificationStatus: owner.verificationStatus,
            nidNumber: owner.nidNumber,
            hotelName: owner.hotelName,
            hotelAddress: owner.hotelAddress
        };
        localStorage.setItem("ownerToken", "token_partner_" + owner.id);
        localStorage.setItem("ownerUser", JSON.stringify(sessionUser));
        window.open("/owner", "_blank");
    };

    return (
        <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-purple-600" />
                    <h3 className="text-sm font-extrabold text-slate-900">{title}</h3>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                        Enterprise PMS Integrated
                    </span>
                    <span className="text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full">
                        {rows.length} Operators
                    </span>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[1100px]">
                    <thead className="bg-slate-50/50 text-slate-500 uppercase text-[11px] font-bold tracking-wider border-b border-slate-100">
                        <tr>
                            <th className="py-3.5 px-6 text-left">Partner & Phone</th>
                            <th className="py-3.5 px-6 text-left">Voter ID (NID) & License</th>
                            <th className="py-3.5 px-6 text-left">Property & Address</th>
                            <th className="py-3.5 px-6 text-center">Portfolio & Bookings</th>
                            <th className="py-3.5 px-6 text-center">Verification</th>
                            <th className="py-3.5 px-6 text-center">Status</th>
                            <th className="py-3.5 px-6 text-right">Software & Controls</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {rows.map(owner => {
                            const oHotels = hotels.filter(h => h.ownerId === owner.id);
                            const primaryHotel = oHotels[0];
                            const aHotels = oHotels.filter(h => h.isActive).length;
                            const oHotelIds = oHotels.map(h => h.id);
                            const tBookings = bookings.filter(b => oHotelIds.includes(b.hotelId)).length;
                            const hotelNameDisplay = owner.hotelName || primaryHotel?.name || "Assigned Property";
                            const hotelAddressDisplay = owner.hotelAddress || primaryHotel?.address || (owner.hotelCity ? `${owner.hotelCity}, Bangladesh` : "Address Registered");

                            return (
                                <tr key={owner.id} className={`hover:bg-slate-50/60 transition-colors ${owner.status === "BLOCKED" ? "bg-rose-50/30" : ""}`}>
                                    {/* Partner Identity & Contact */}
                                    <td className="py-3.5 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 border border-purple-200 flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                                                {owner.name?.charAt(0) || "O"}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                                                    {owner.name}
                                                </p>
                                                <p className="text-[11px] text-slate-500">{owner.email}</p>
                                                {owner.phone ? (
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded mt-0.5">
                                                        <Phone className="w-2.5 h-2.5 text-indigo-600" />
                                                        {owner.phone}
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] text-slate-400">+880 1712-000000</span>
                                                )}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Voter ID (NID) & Trade License */}
                                    <td className="py-3.5 px-6">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5">
                                                <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-slate-800 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                                                    <FileText className="w-3 h-3 text-emerald-600" />
                                                    {owner.nidNumber || "19902692518291024"}
                                                </span>
                                                {owner.nidDocUrl && (
                                                    <a
                                                        href={owner.nidDocUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 underline bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100"
                                                        title="Click to view full Voter ID photo"
                                                    >
                                                        View Card
                                                    </a>
                                                )}
                                            </div>
                                            {owner.tradeLicenseNumber && (
                                                <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                                                    <span className="font-semibold text-slate-600">Lic:</span> {owner.tradeLicenseNumber}
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    {/* Property & Address */}
                                    <td className="py-3.5 px-6">
                                        <div className="max-w-[220px]">
                                            <p className="font-bold text-slate-900 text-xs truncate" title={hotelNameDisplay}>
                                                {hotelNameDisplay}
                                            </p>
                                            <p className="text-[11px] text-slate-500 flex items-center gap-1 truncate mt-0.5" title={hotelAddressDisplay}>
                                                <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                                                <span className="truncate">{hotelAddressDisplay}</span>
                                            </p>
                                            {owner.hotelCity && (
                                                <span className="inline-block mt-0.5 text-[9px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-100">
                                                    {owner.hotelCity}
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    {/* Portfolio & Bookings */}
                                    <td className="py-3.5 px-6 text-center">
                                        <div className="inline-flex flex-col items-center">
                                            <span className="font-bold text-slate-900 text-xs">
                                                {aHotels} / {oHotels.length || 1} Hotel
                                            </span>
                                            <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full mt-0.5">
                                                {tBookings} Bookings
                                            </span>
                                            <span className="text-[9px] text-slate-400 font-medium mt-0.5">
                                                {owner.commissionRate ?? 10}% Comm.
                                            </span>
                                        </div>
                                    </td>

                                    {/* Verification */}
                                    <td className="py-3.5 px-6 text-center">
                                        <Badge color={owner.verificationStatus === "VERIFIED" ? "green" : owner.verificationStatus === "REJECTED" ? "red" : "amber"}>
                                            {owner.verificationStatus === "VERIFIED" ? "VERIFIED" : owner.verificationStatus === "REJECTED" ? "REJECTED" : "PENDING"}
                                        </Badge>
                                    </td>

                                    {/* Status */}
                                    <td className="py-3.5 px-6 text-center">
                                        <Badge color={owner.status === "ACTIVE" ? "green" : "red"}>
                                            {owner.status}
                                        </Badge>
                                    </td>

                                    {/* Software & Controls */}
                                    <td className="py-3.5 px-6">
                                        <div className="flex justify-end items-center gap-1.5">
                                            {/* Direct Launch Owner SaaS Portal */}
                                            <button
                                                onClick={() => handleLaunchOwnerPortal(owner)}
                                                className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1 shadow-xs"
                                                title="Open Hotel Management Software Portal (/owner)"
                                            >
                                                <ExternalLink className="w-3.5 h-3.5" />
                                                <span>Launch Software</span>
                                            </button>

                                            {/* Dossier & Insights */}
                                            <button
                                                onClick={() => onViewInsight(owner)}
                                                title="View Voter ID Document & Financial Dossier"
                                                className="p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 transition"
                                            >
                                                <BarChart3 className="w-3.5 h-3.5" />
                                            </button>

                                            {/* Profile modal */}
                                            <button
                                                onClick={() => onViewUser(owner)}
                                                className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition"
                                                title="View Account Profile"
                                            >
                                                <Eye className="w-3.5 h-3.5 text-slate-600" />
                                            </button>

                                            {owner.verificationStatus === "PENDING" && (
                                                <ActionBtn
                                                    onClick={() => ask(`Approve credentials and Voter ID for "${owner.name}"?`, async () => { await api.updateVerificationStatus(owner.id, "VERIFIED"); reload(); })}
                                                    color="green" label="Approve" icon={<CheckCircle className="w-3 h-3" />}
                                                />
                                            )}

                                            {owner.status === "BLOCKED" ? (
                                                <ActionBtn
                                                    onClick={() => ask(`Unblock owner "${owner.name}"?`, async () => { await api.updateUserStatus(owner.id, "ACTIVE"); reload(); })}
                                                    color="green" label="Enable" icon={<CheckCircle className="w-3 h-3" />}
                                                />
                                            ) : (
                                                <ActionBtn
                                                    onClick={() => ask(`Block owner "${owner.name}"? All associated hotels will be taken offline.`, async () => { await api.updateUserStatus(owner.id, "BLOCKED"); reload(); })}
                                                    color="red" label="Block" icon={<Ban className="w-3 h-3" />}
                                                />
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
