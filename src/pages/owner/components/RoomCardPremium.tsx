import React, { useState } from 'react';
import { Loader2, Trash2, Edit3, Image as ImageIcon, Zap, ChevronRight, CheckCircle2 } from 'lucide-react';
import { api, Room } from '../../../services/api';

export function RoomCardPremium({ room, onUpdate }: { room: Room; onUpdate: () => void }) {
    const [editing, setEditing] = useState(false);
    const [price, setPrice] = useState(room.pricePerNight);
    const [inventory, setInventory] = useState(room.totalInventory);
    const [discount, setDiscount] = useState(room.discountPrice || 0);
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        setLoading(true);
        try {
            await api.updateRoom(room.id, {
                pricePerNight: price,
                totalInventory: inventory,
                discountPrice: discount || undefined
            });
            setEditing(false);
            onUpdate();
        } catch (e: any) {
            alert("Error: " + e.message);
        }
        setLoading(false);
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this room category?")) return;
        setLoading(true);
        try {
            await api.deleteRoom(room.id);
            onUpdate();
        } catch (e: any) {
            alert("Error: " + e.message);
        }
        setLoading(false);
    };

    return (
        <div className="bg-white border border-slate-200/90 rounded-[28px] overflow-hidden group hover:border-indigo-300 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between">
            <div>
                <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-100">
                    <img
                        src={room.images?.[0] || "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800"}
                        alt={room.type}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800";
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
                    
                    <div className="absolute top-3 right-3 flex gap-2">
                        <button
                            onClick={() => setEditing(!editing)}
                            title="Edit room"
                            className="p-2 bg-white/90 hover:bg-white backdrop-blur-md rounded-xl text-slate-700 hover:text-indigo-600 transition shadow-sm active:scale-95"
                        >
                            <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleDelete}
                            title="Delete room"
                            className="p-2 bg-rose-50/90 hover:bg-rose-600 backdrop-blur-md rounded-xl text-rose-600 hover:text-white transition shadow-sm active:scale-95"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                    
                    <div className="absolute bottom-3 left-4">
                        <span className="bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-lg shadow-md shadow-indigo-600/30">
                            {room.category || "Standard"}
                        </span>
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight line-clamp-1">{room.type}</h4>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                                <Zap className="w-3 h-3 text-indigo-500" /> Floor {room.floorNumber || 1} • {room.capacity} Guests
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-xl font-black text-emerald-600 leading-none tabular-nums">৳{room.pricePerNight.toLocaleString()}</div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">per night</p>
                        </div>
                    </div>

                    {editing ? (
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 animate-in slide-in-from-top-2 duration-200">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">Daily Rate (৳)</label>
                                    <input
                                        type="number"
                                        value={price}
                                        onChange={e => setPrice(+e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-black text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">Inventory</label>
                                    <input
                                        type="number"
                                        value={inventory}
                                        onChange={e => setInventory(+e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-black text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2 pt-1">
                                <button
                                    onClick={() => setEditing(false)}
                                    className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-wider hover:bg-slate-100 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    disabled={loading}
                                    className="flex-1 py-2 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider hover:bg-indigo-700 transition shadow-sm active:scale-95 flex items-center justify-center gap-1.5"
                                >
                                    {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />} Save
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
                                onClick={() => setEditing(true)}
                            >
                                Quick Edit <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
