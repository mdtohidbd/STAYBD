import React, { useState } from 'react';
import { Loader2, Trash2, Edit3, Image as ImageIcon, Zap, ChevronRight, CheckCircle2, Globe, Eye, Sparkles, ExternalLink, BedDouble } from 'lucide-react';
import { api, Room } from '../../../services/api';
import { RoomModal } from './OwnerModals';
import { Link } from 'react-router-dom';

export function RoomCardPremium({ room, onUpdate }: { room: Room; onUpdate: () => void }) {
    const [quickEditing, setQuickEditing] = useState(false);
    const [fullEditOpen, setFullEditOpen] = useState(false);
    const [price, setPrice] = useState(room.pricePerNight);
    const [inventory, setInventory] = useState(room.totalInventory);
    const [discount, setDiscount] = useState(room.discountPrice || 0);
    const [loading, setLoading] = useState(false);

    const handleQuickSave = async () => {
        setLoading(true);
        try {
            await api.updateRoom(room.id, {
                pricePerNight: price,
                totalInventory: inventory,
                availableCount: Math.min(room.availableCount, inventory),
                discountPrice: discount > 0 ? discount : undefined
            });
            setQuickEditing(false);
            onUpdate();
        } catch (e: any) {
            alert("Error: " + e.message);
        }
        setLoading(false);
    };

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to remove "${room.type}" from the PMS and Landing Page?`)) return;
        setLoading(true);
        try {
            await api.deleteRoom(room.id);
            onUpdate();
        } catch (e: any) {
            alert("Error: " + e.message);
        }
        setLoading(false);
    };

    const hasDiscount = Boolean(room.discountPrice && room.discountPrice < room.pricePerNight);
    const displayPrice = hasDiscount ? room.discountPrice! : room.pricePerNight;
    const coverImage = room.images?.[0] || "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800";

    return (
        <>
            <div className="bg-white border border-slate-200/90 rounded-[28px] overflow-hidden group hover:border-indigo-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative shadow-xs">
                <div>
                    {/* Image Header with Badges & Action Buttons */}
                    <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-100">
                        <img
                            src={coverImage}
                            alt={room.type}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800";
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-black/20 to-transparent" />
                        
                        {/* Live on Homepage Indicator Pill */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-emerald-950/80 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Live on Homepage</span>
                        </div>

                        {/* Top Action Icons */}
                        <div className="absolute top-3 right-3 flex gap-1.5 z-10">
                            {/* Full Edit Modal Button */}
                            <button
                                onClick={() => setFullEditOpen(true)}
                                title="Edit Full Room Details & Photos"
                                className="w-8 h-8 bg-white/90 hover:bg-white text-slate-700 hover:text-indigo-600 rounded-xl backdrop-blur-md flex items-center justify-center transition shadow-sm active:scale-90"
                            >
                                <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            {/* Delete Room Button */}
                            <button
                                onClick={handleDelete}
                                disabled={loading}
                                title="Delete Room Category"
                                className="w-8 h-8 bg-rose-50/90 hover:bg-rose-600 text-rose-600 hover:text-white rounded-xl backdrop-blur-md flex items-center justify-center transition shadow-sm active:scale-90"
                            >
                                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                            </button>
                        </div>
                        
                        {/* Category Badge & Preview Shortcut */}
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                            <span className="bg-indigo-600/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-lg shadow-md border border-indigo-400/30">
                                {room.category || "Standard Room"}
                            </span>
                            
                            <a
                                href="/#featured-rooms"
                                target="_blank"
                                rel="noreferrer"
                                title="Preview on Landing Page"
                                className="bg-white/85 hover:bg-white backdrop-blur-md text-slate-800 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm transition hover:text-indigo-600"
                            >
                                <Eye className="w-3 h-3 text-indigo-500" />
                                <span>Preview</span>
                            </a>
                        </div>
                    </div>

                    {/* Room Details Body */}
                    <div className="p-5 sm:p-6">
                        <div className="flex justify-between items-start gap-2 mb-3">
                            <div className="flex-1 min-w-0">
                                <h4 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-tight truncate" title={room.type}>
                                    {room.type}
                                </h4>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                                    <Zap className="w-3 h-3 text-indigo-500 shrink-0" />
                                    <span>Floor {room.floorNumber || 1} • {room.capacity || `${room.maxAdults || 2} Guests`}</span>
                                </p>
                            </div>
                            <div className="text-right shrink-0">
                                <div className="text-xl font-black text-emerald-600 leading-none tabular-nums flex items-baseline justify-end gap-1">
                                    <span>৳{displayPrice.toLocaleString()}</span>
                                </div>
                                {hasDiscount && (
                                    <div className="text-[10px] text-slate-400 font-bold line-through tabular-nums mt-0.5">
                                        ৳{room.pricePerNight.toLocaleString()}
                                    </div>
                                )}
                                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">per night</p>
                            </div>
                        </div>

                        {/* Room Amenities preview chips */}
                        {room.amenities && room.amenities.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-4">
                                {room.amenities.slice(0, 3).map((amenity, idx) => (
                                    <span key={idx} className="bg-slate-100 border border-slate-200/80 text-slate-600 text-[9px] font-black uppercase px-2 py-0.5 rounded-md">
                                        {amenity}
                                    </span>
                                ))}
                                {room.amenities.length > 3 && (
                                    <span className="text-[9px] text-slate-600 font-bold px-1 py-0.5">
                                        +{room.amenities.length - 3} more
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Quick Edit Expandable Form */}
                        {quickEditing ? (
                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 animate-in slide-in-from-top-2 duration-200">
                                <div className="grid grid-cols-2 gap-2.5">
                                    <div>
                                        <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">Nightly Rate (৳)</label>
                                        <input
                                            type="number"
                                            value={price}
                                            onChange={e => setPrice(+e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-black text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">Total Inventory</label>
                                        <input
                                            type="number"
                                            value={inventory}
                                            onChange={e => setInventory(+e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-black text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">Discount/Promo Rate (৳, Optional)</label>
                                    <input
                                        type="number"
                                        value={discount || ""}
                                        placeholder="Leave blank for regular price"
                                        onChange={e => setDiscount(+e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-black text-emerald-700 focus:ring-2 focus:ring-emerald-500 outline-none placeholder:font-normal placeholder:text-slate-400"
                                    />
                                </div>
                                <div className="flex gap-2 pt-1">
                                    <button
                                        type="button"
                                        onClick={() => setQuickEditing(false)}
                                        className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-wider hover:bg-slate-100 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleQuickSave}
                                        disabled={loading}
                                        className="flex-1 py-2 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider hover:bg-indigo-700 transition shadow-sm active:scale-95 flex items-center justify-center gap-1.5"
                                    >
                                        {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />} Save Rate
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                                        <ImageIcon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Inventory</p>
                                        <p className="text-xs font-black text-slate-900">{room.totalInventory} Units</p>
                                    </div>
                                </div>
                                <button
                                    className="group/btn flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-indigo-600 hover:text-indigo-700 transition-colors"
                                    onClick={() => setQuickEditing(true)}
                                >
                                    Quick Edit <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Full Room Edit Modal */}
            {fullEditOpen && (
                <RoomModal
                    room={room}
                    onClose={() => setFullEditOpen(false)}
                    onDone={() => {
                        setFullEditOpen(false);
                        onUpdate();
                    }}
                />
            )}
        </>
    );
}
