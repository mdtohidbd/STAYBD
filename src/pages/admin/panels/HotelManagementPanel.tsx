import React, { useState } from "react";
import {
    Building2,
    Bed,
    CheckCircle,
    Trash2,
    Flag,
    Ban,
    Plus,
    Search,
    Filter,
    Sparkles,
    MapPin,
    ExternalLink
} from "lucide-react";
import { api, Hotel, Room, UserProfile, HotelOwner } from "../../../services/api";
import { StatCard, Badge, ActionBtn } from "../components/AdminUIElements";
import { AddHotelModal, AddRoomModal } from "../../owner/components/OwnerModals";

interface HotelManagementPanelProps {
    hotels: Hotel[];
    rooms: (Room & { hotelName: string })[];
    userList: (UserProfile | HotelOwner)[];
    reload: () => void;
}

export default function HotelManagementPanel({ hotels, rooms, userList, reload }: HotelManagementPanelProps) {
    const [subTab, setSubTab] = useState<"hotels" | "rooms">("hotels");
    const [showAddHotel, setShowAddHotel] = useState(false);
    const [selectedHotelForRoom, setSelectedHotelForRoom] = useState<{ id: string; name: string } | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCity, setSelectedCity] = useState("ALL");

    const owners = userList.filter(u => u.role === "OWNER") as HotelOwner[];
    const defaultOwnerId = owners[0]?.id || userList[0]?.id || "admin_owner";

    const vacantRooms = rooms.reduce((sum, r) => sum + (r.availableCount || 0), 0);
    const totalRooms = rooms.reduce((sum, r) => sum + (r.totalInventory || 0), 0);

    // Unique cities/spots for filter dropdown
    const cities = ["ALL", ...Array.from(new Set(hotels.map(h => h.city).filter(Boolean)))];

    // Filter hotels
    const filteredHotels = hotels.filter(h => {
        const matchesSearch = !searchTerm || 
            h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            h.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
            h.address.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCity = selectedCity === "ALL" || h.city.toLowerCase() === selectedCity.toLowerCase();
        return matchesSearch && matchesCity;
    });

    // Filter rooms
    const filteredRooms = rooms.filter(r => {
        return !searchTerm || 
            r.hotelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.type.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Overview & Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Properties" value={hotels.length} color="indigo" icon={<Building2 className="w-5 h-5" />} subLabel="Verified Live Registry" />
                <StatCard label="Room Configurations" value={rooms.length} color="purple" icon={<Bed className="w-5 h-5" />} subLabel="Active Configurations" />
                <StatCard label="Available Vacancy" value={`${vacantRooms} / ${totalRooms}`} color="green" icon={<CheckCircle className="w-5 h-5" />} subLabel="Inventory Available" />
                
                {/* Admin Quick Creation Card */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Admin Fast Actions
                        </span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                        <button
                            onClick={() => setShowAddHotel(true)}
                            className="flex-1 px-3 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs"
                        >
                            <Plus className="w-3.5 h-3.5" /> New Property
                        </button>
                        {hotels.length > 0 && (
                            <button
                                onClick={() => setSelectedHotelForRoom({ id: hotels[0].id, name: hotels[0].name })}
                                className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                            >
                                <Plus className="w-3.5 h-3.5" /> Room
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Filter and Control Bar */}
            <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
                {/* SubTab Toggle */}
                <div className="flex gap-2 w-full lg:w-auto">
                    <button 
                        onClick={() => setSubTab("hotels")} 
                        className={`flex-1 lg:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                            subTab === "hotels" 
                                ? "bg-indigo-600 text-white shadow-xs" 
                                : "text-slate-600 hover:text-slate-900 bg-slate-50 border border-slate-200"
                        }`}
                    >
                        <Building2 className="w-4 h-4" /> Properties ({hotels.length})
                    </button>
                    <button 
                        onClick={() => setSubTab("rooms")} 
                        className={`flex-1 lg:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                            subTab === "rooms" 
                                ? "bg-indigo-600 text-white shadow-xs" 
                                : "text-slate-600 hover:text-slate-900 bg-slate-50 border border-slate-200"
                        }`}
                    >
                        <Bed className="w-4 h-4" /> Room Inventory ({rooms.length})
                    </button>
                </div>

                {/* Search & City Filter */}
                <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search hotel name, location..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs md:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                        />
                    </div>

                    {subTab === "hotels" && cities.length > 1 && (
                        <select
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            {cities.map(c => (
                                <option key={c} value={c}>
                                    {c === "ALL" ? "All Locations" : c}
                                </option>
                            ))}
                        </select>
                    )}

                    <button
                        onClick={() => subTab === "hotels" ? setShowAddHotel(true) : setSelectedHotelForRoom(hotels[0] ? { id: hotels[0].id, name: hotels[0].name } : null)}
                        className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs shrink-0"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{subTab === "hotels" ? "Add Hotel" : "Add Room"}</span>
                    </button>
                </div>
            </div>

            {/* Hotels Table */}
            {subTab === "hotels" && (
                <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm min-w-[900px]">
                            <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
                                <tr>
                                    <th className="py-4 px-6 text-left">Property Details</th>
                                    <th className="py-4 px-6 text-left">City & Location</th>
                                    <th className="py-4 px-6 text-center">Status</th>
                                    <th className="py-4 px-6 text-center">Verification</th>
                                    <th className="py-4 px-6 text-center">Risk Flag</th>
                                    <th className="py-4 px-6 text-right">Quick Controls</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredHotels.map(h => {
                                    const ownerName = owners.find(o => o.id === h.ownerId)?.name || "StayBD Partner";
                                    return (
                                        <tr key={h.id} className="hover:bg-slate-50/60 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3.5">
                                                    <div className="w-14 h-11 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shadow-xs shrink-0">
                                                        <img 
                                                            src={h.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400"} 
                                                            alt="" 
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 text-xs tracking-tight mb-0.5">{h.name}</p>
                                                        <p className="text-[11px] text-slate-500">
                                                            Owner: {ownerName} · ⭐ {h.rating || 4.5}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-1 text-slate-800 font-semibold text-xs mb-0.5">
                                                    <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                                    <span>{h.city}</span>
                                                </div>
                                                <p className="text-[11px] text-slate-400 truncate max-w-[180px]">{h.address}</p>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <Badge color={h.isActive ? "green" : "red"}>{h.isActive ? "Active" : "Offline"}</Badge>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <Badge color={h.isVerified ? "blue" : "amber"}>{h.isVerified ? "Verified" : "Pending"}</Badge>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <Badge color={h.isRedMarked ? "red" : "slate"}>{h.isRedMarked ? "Flagged" : "Normal"}</Badge>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        onClick={() => setSelectedHotelForRoom({ id: h.id, name: h.name })}
                                                        title="Add Room to this Hotel"
                                                        className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition flex items-center gap-1"
                                                    >
                                                        <Plus className="w-3 h-3" /> Room
                                                    </button>

                                                    <ActionBtn 
                                                        color={h.isVerified ? "slate" : "green"} 
                                                        icon={<CheckCircle className="w-3.5 h-3.5" />} 
                                                        label={h.isVerified ? "Unverify" : "Verify"} 
                                                        onClick={async () => { await api.updateHotel(h.id, { isVerified: !h.isVerified }); reload(); }} 
                                                    />
                                                    <ActionBtn 
                                                        color={h.isRedMarked ? "slate" : "red"} 
                                                        icon={<Flag className="w-3.5 h-3.5" />} 
                                                        label={h.isRedMarked ? "Clear" : "Flag"} 
                                                        onClick={async () => { await api.toggleRedMark(h.id); reload(); }} 
                                                    />
                                                    <ActionBtn 
                                                        color={h.isActive ? "slate" : "green"} 
                                                        icon={<Ban className="w-3.5 h-3.5" />} 
                                                        label={h.isActive ? "Pause" : "Resume"} 
                                                        onClick={async () => { await api.toggleHotelActive(h.id); reload(); }} 
                                                    />
                                                    <button 
                                                        onClick={async () => { 
                                                            if (window.confirm(`Delete "${h.name}" from the platform?`)) { 
                                                                await api.deleteHotel(h.id); 
                                                                reload(); 
                                                            } 
                                                        }} 
                                                        title="Delete property"
                                                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 border border-rose-200 transition"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {filteredHotels.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="py-16 text-center">
                                            <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                                            <p className="text-slate-700 font-bold text-sm">
                                                No matching hotels found
                                            </p>
                                            <button
                                                onClick={() => setShowAddHotel(true)}
                                                className="mt-3 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
                                            >
                                                + Register Hotel
                                            </button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Rooms Table */}
            {subTab === "rooms" && (
                <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm min-w-[900px]">
                            <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
                                <tr>
                                    <th className="py-4 px-6 text-left">Hotel Property</th>
                                    <th className="py-4 px-6 text-left">Room Configuration</th>
                                    <th className="py-4 px-6 text-right">Price / Night</th>
                                    <th className="py-4 px-6 text-center">Total Inventory</th>
                                    <th className="py-4 px-6 text-center">Available Units</th>
                                    <th className="py-4 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredRooms.map(r => (
                                    <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="py-4 px-6 font-bold text-slate-900 text-xs">
                                            {r.hotelName}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 rounded-lg text-xs font-semibold">
                                                {r.type}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right font-black text-slate-900 text-sm">
                                            ৳{r.pricePerNight?.toLocaleString()}
                                        </td>
                                        <td className="py-4 px-6 text-center text-slate-600 font-bold text-xs">
                                            {r.totalInventory} Units
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border ${
                                                r.availableCount > 0 
                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                                                    : "bg-rose-50 text-rose-700 border-rose-200"
                                            }`}>
                                                {r.availableCount} Available
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <button 
                                                onClick={async () => { 
                                                    if (window.confirm(`Remove room configuration "${r.type}"?`)) { 
                                                        await api.deleteRoom(r.id); 
                                                        reload(); 
                                                    } 
                                                }} 
                                                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 border border-rose-200 transition"
                                                title="Delete room"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredRooms.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="py-16 text-center">
                                            <Bed className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                                            <p className="text-slate-700 font-bold text-sm">
                                                No active room configurations found
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modals */}
            {showAddHotel && (
                <AddHotelModal
                    ownerId={defaultOwnerId}
                    onClose={() => setShowAddHotel(false)}
                    onDone={() => {
                        setShowAddHotel(false);
                        reload();
                    }}
                />
            )}

            {selectedHotelForRoom && (
                <AddRoomModal
                    hotelId={selectedHotelForRoom.id}
                    onClose={() => setSelectedHotelForRoom(null)}
                    onDone={() => {
                        setSelectedHotelForRoom(null);
                        reload();
                    }}
                />
            )}
        </div>
    );
}
