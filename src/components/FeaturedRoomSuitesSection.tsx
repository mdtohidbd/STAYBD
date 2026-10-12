import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    BedDouble, MapPin, Zap, Sparkles, CheckCircle2, ChevronRight,
    Wifi, Snowflake, ShieldCheck, Tag, ArrowRight, Eye, Flame,
    Layers, Users, Calendar
} from 'lucide-react';
import { Room, Hotel, api, getLocalRooms } from '../services/api';

interface Props {
    rooms?: (Room & { hotelName?: string; hotelCity?: string; hotelImage?: string })[];
    hotels?: Hotel[];
}

export default function FeaturedRoomSuitesSection({ rooms: initialRooms = [], hotels = [] }: Props) {
    const { t, i18n } = useTranslation();
    const isBn = i18n.language?.startsWith("bn");
    const navigate = useNavigate();

    const [liveRooms, setLiveRooms] = useState<Room[]>(() => {
        if (initialRooms && initialRooms.length > 0) return initialRooms;
        return getLocalRooms();
    });

    const [activeCategory, setActiveCategory] = useState<string>("ALL");

    // Real-time listener for room uploads/edits from Owner Dashboard
    useEffect(() => {
        let isMounted = true;
        const handleRoomsUpdate = () => {
            api.getAllRooms().then(updated => {
                if (!isMounted) return;
                if (Array.isArray(updated) && updated.length > 0) {
                    setLiveRooms(updated);
                } else {
                    setLiveRooms(getLocalRooms());
                }
            }).catch(() => {
                if (isMounted) setLiveRooms(getLocalRooms());
            });
        };

        window.addEventListener('sb_rooms_updated', handleRoomsUpdate);
        window.addEventListener('storage', handleRoomsUpdate);

        let bc: BroadcastChannel | null = null;
        try {
            bc = new BroadcastChannel('sb_rooms_channel');
            bc.onmessage = () => handleRoomsUpdate();
        } catch {}

        // Fetch once on mount to ensure fresh state
        handleRoomsUpdate();

        return () => {
            isMounted = false;
            window.removeEventListener('sb_rooms_updated', handleRoomsUpdate);
            window.removeEventListener('storage', handleRoomsUpdate);
            if (bc) {
                try { bc.close(); } catch {}
            }
        };
    }, []);

    // Also update if initialRooms prop changes
    useEffect(() => {
        if (initialRooms && initialRooms.length > 0) {
            setLiveRooms(initialRooms);
        }
    }, [initialRooms]);

    // Categories filter
    const categories = [
        { id: "ALL", label: isBn ? "সবগুলো ক্যাটাগরি" : "All Categories" },
        { id: "SUITE", label: isBn ? "লাক্সারি সুইটস ও ভিলা" : "Luxury Suites & Villas" },
        { id: "DELUXE", label: isBn ? "ডিলাক্স রুম" : "Deluxe Rooms" },
        { id: "DOUBLE", label: isBn ? "ডাবল ও ফ্যামিলি" : "Double & Family" },
        { id: "OCEAN", label: isBn ? "ভিউ ও স্পেশাল" : "Scenic & View" },
    ];

    const filteredRooms = useMemo(() => {
        // Strictly sort by newest first so newly uploaded cards appear right at the front!
        const sorted = [...liveRooms].sort((a, b) => {
            const timeA = new Date(a.updatedAt || a.createdAt || 0).getTime();
            const timeB = new Date(b.updatedAt || b.createdAt || 0).getTime();
            return timeB - timeA;
        });

        if (activeCategory === "ALL") return sorted;
        return sorted.filter(r => {
            const cat = (r.category || "").toLowerCase();
            const type = (r.type || "").toLowerCase();
            const view = (r.viewType || "").toLowerCase();

            if (activeCategory === "SUITE") return cat.includes("suite") || cat.includes("villa") || type.includes("suite") || type.includes("villa") || type.includes("penthouse");
            if (activeCategory === "DELUXE") return cat.includes("deluxe") || type.includes("deluxe");
            if (activeCategory === "DOUBLE") return cat.includes("double") || cat.includes("family") || type.includes("family") || type.includes("cottage");
            if (activeCategory === "OCEAN") return view.includes("sea") || view.includes("ocean") || view.includes("view") || type.includes("view") || type.includes("ocean");
            return true;
        });
    }, [liveRooms, activeCategory]);

    if (!liveRooms || liveRooms.length === 0) return null;

    return (
        <section id="featured-rooms" className="py-12 md:py-16 bg-gradient-to-b from-white via-slate-50/50 to-white relative overflow-hidden border-t border-slate-200/80">
            {/* Subtle background ambient glow */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto px-4 md:px-6">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-indigo-50 border border-indigo-200 text-indigo-700 shadow-2xs">
                                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                                {isBn ? "লাইভ পার্টনার ইনভেন্টরি" : "PMS Live Direct Inventory"}
                            </span>
                            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 border border-emerald-200 text-emerald-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                {isBn ? "সরাসরি হোটেল রেট" : "Direct Hotel Rates"}
                            </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                            {isBn ? "হোটেল পার্টনারদের এক্সক্লুসিভ রুম ও সুইটস" : "Featured Rooms & Luxury Suites Showcase"}
                        </h2>
                        <p className="text-slate-500 text-xs sm:text-sm font-semibold mt-1.5 max-w-2xl">
                            {isBn
                                ? "বাংলাদেশের শীর্ষ ভেরিফাইড হোটেল পার্টনারদের দ্বারা সরাসরি আপলোড ও ম্যানেজ করা প্রিমিয়াম রুম ও সুইটস। ইনস্ট্যান্ট কনফার্মেশন ও জিরো হিডেন চার্জ।"
                                : "Handpicked suites and premium rooms published directly by verified hotel partners across Bangladesh with guaranteed best rates and instant booking."}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            to="/hotels"
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 text-slate-800 text-xs font-black uppercase tracking-wider transition shadow-2xs hover:shadow-sm group"
                        >
                            <span>{isBn ? "সকল রুম দেখুন" : "View All Stays"}</span>
                            <ChevronRight className="w-4 h-4 text-indigo-600 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 custom-scrollbar">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition whitespace-nowrap border ${activeCategory === cat.id
                                ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20"
                                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                            }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Rooms Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredRooms.map(room => {
                        const matchedHotel = hotels.find(h => h.id === room.hotelId);
                        const hotelName = room.hotelName || matchedHotel?.name || "Sea Pearl Royal Beach Resort";
                        const hotelCity = room.hotelCity || matchedHotel?.city || "Cox's Bazar";
                        const hasDiscount = Boolean(room.discountPrice && room.discountPrice < room.pricePerNight);
                        const effectivePrice = hasDiscount ? room.discountPrice! : room.pricePerNight;
                        const coverImg = room.images?.[0] || "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800";

                        const bookingUrl = `/checkout/${room.hotelId || matchedHotel?.id || 'sea-pearl-cox'}?roomId=${room.id}&step=details`;
                        const hotelUrl = `/hotel/${room.hotelId || matchedHotel?.id || 'sea-pearl-cox'}`;

                        return (
                            <div
                                key={room.id}
                                className="bg-white rounded-[28px] border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-indigo-400 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
                            >
                                <div>
                                    {/* Cover Image with Badges */}
                                    <div className="relative h-52 sm:h-56 overflow-hidden bg-slate-100">
                                        <img
                                            src={coverImg}
                                            alt={room.type}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800";
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-black/20 to-transparent" />

                                        {/* Top Left: Category Pill */}
                                        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                                            <span className="bg-indigo-600/95 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-lg shadow-md border border-indigo-400/30">
                                                {room.category || "Deluxe Suite"}
                                            </span>
                                            {Boolean(room.updatedAt && (new Date().getTime() - new Date(room.updatedAt).getTime()) < 48 * 3600 * 1000) && (
                                                <span className="bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1 border border-amber-300">
                                                    <Sparkles className="w-2.5 h-2.5 fill-slate-950" />
                                                    {isBn ? "নতুন লিস্টিং" : "New Direct Listing"}
                                                </span>
                                            )}
                                            {hasDiscount && (
                                                <span className="bg-emerald-600 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                                                    <Flame className="w-3 h-3" />
                                                    {isBn ? "স্পেশাল অফার" : "Special Rate"}
                                                </span>
                                            )}
                                        </div>

                                        {/* Top Right: Inventory Counter */}
                                        <div className="absolute top-3 right-3">
                                            <span className="bg-black/60 backdrop-blur-md text-emerald-300 border border-emerald-400/40 text-[10px] font-black px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                {room.availableCount > 0 ? `${room.availableCount} Available` : "Instant Book"}
                                            </span>
                                        </div>

                                        {/* Bottom Overlay: Hotel Name & Location */}
                                        <div className="absolute bottom-3 left-3 right-3 text-white">
                                            <p className="text-[11px] font-black uppercase tracking-wider flex items-center gap-1 text-slate-200 truncate drop-shadow-sm">
                                                <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                                                <span className="truncate">{hotelName} • {hotelCity}</span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Card Content Body */}
                                    <div className="p-5">
                                        {/* Room Name */}
                                        <h3 className="text-[15px] sm:text-base font-black text-slate-900 uppercase tracking-tight line-clamp-2 min-h-[2.6rem] leading-snug mb-2" title={room.type}>
                                            {room.type}
                                        </h3>

                                        {/* Floor & Capacity */}
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-3">
                                            <span className="flex items-center gap-1">
                                                <Layers className="w-3.5 h-3.5 text-indigo-500" />
                                                Floor {room.floorNumber || 1}
                                            </span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <Users className="w-3.5 h-3.5 text-indigo-500" />
                                                {room.capacity || `${room.maxAdults || 2} Guests`}
                                            </span>
                                            {room.viewType && (
                                                <>
                                                    <span>•</span>
                                                    <span className="truncate text-slate-600">{room.viewType}</span>
                                                </>
                                            )}
                                        </div>

                                        {/* Amenities Preview */}
                                        {room.amenities && room.amenities.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mb-4">
                                                {room.amenities.slice(0, 3).map((amenity, idx) => (
                                                    <span key={idx} className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-200/70">
                                                        {amenity}
                                                    </span>
                                                ))}
                                                {room.amenities.length > 3 && (
                                                    <span className="text-[10px] text-slate-500 font-bold px-1 py-0.5">
                                                        +{room.amenities.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Pricing & Direct Book CTA Footer */}
                                <div className="p-5 pt-0">
                                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                                        <div>
                                            <div className="flex items-baseline gap-1.5">
                                                <span className="text-lg sm:text-xl font-black text-emerald-600 tabular-nums">
                                                    ৳{effectivePrice.toLocaleString()}
                                                </span>
                                                {hasDiscount && (
                                                    <span className="text-xs text-slate-400 font-bold line-through tabular-nums">
                                                        ৳{room.pricePerNight.toLocaleString()}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">
                                                {isBn ? "প্রতি রাত (ট্যাক্স সহ)" : "per night · all incl."}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => navigate(bookingUrl)}
                                            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-wider shadow-sm active:scale-95 transition-all flex items-center gap-1 group/btn"
                                        >
                                            <span>{isBn ? "বুক করুন" : "Book Room"}</span>
                                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
