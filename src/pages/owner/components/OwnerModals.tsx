import React, { useState } from 'react';
import { X, Loader2, CheckCircle2, TrendingUp, Star, Map, ChevronDown, MonitorDot, Users, Ticket, Plus } from 'lucide-react';
import { api, HOTEL_AMENITIES, PAYMENT_OPTIONS, ROOM_AMENITIES, BED_TYPES, ROOM_CATEGORIES, VIEW_TYPES, Hotel } from "../../../services/api";
import MultiImageUploader from "../../../components/MultiImageUploader";

const BD_CITIES = [
    "Bagerhat", "Bandarban", "Barguna", "Barisal", "Bhola", "Bogra", "Brahmanbaria", "Chandpur",
    "Chapai Nawabganj", "Chattogram", "Chuadanga", "Comilla", "Cox's Bazar", "Dhaka", "Dinajpur",
    "Faridpur", "Feni", "Gaibandha", "Gazipur", "Gopalganj", "Habiganj", "Jamalpur", "Jashore",
    "Jhalokati", "Jhenaidah", "Joypurhat", "Khagrachari", "Khulna", "Kishoreganj", "Kurigram", "Kushtia",
    "Lakshmipur", "Lalmonirhat", "Madaripur", "Magura", "Manikganj", "Meherpur", "Moulvibazar",
    "Munshiganj", "Mymensingh", "Naogaon", "Narail", "Narayanganj", "Narsingdi", "Natore",
    "Netrokona", "Nilphamari", "Noakhali", "Pabna", "Panchagarh", "Patuakhali", "Pirojpur",
    "Rajbari", "Rajshahi", "Rangamati", "Rangpur", "Saidpur", "Shariatpur", "Sherpur", "Sirajganj",
    "Sunamganj", "Sylhet", "Tangail", "Thakurgaon"
].sort();

export function AddHotelModal({ ownerId, onClose, onDone }: { ownerId: string; onClose: () => void; onDone: () => void }) {
    const [loading, setLoading] = useState(false);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
    const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
    const [images, setImages] = useState<string[]>([]);
    const [mapUrl, setMapUrl] = useState("");

    const [checkInHour, setCheckInHour] = useState("02");
    const [checkInPeriod, setCheckInPeriod] = useState("PM");
    const [checkOutHour, setCheckOutHour] = useState("12");
    const [checkOutPeriod, setCheckOutPeriod] = useState("PM");

    const [citySearch, setCitySearch] = useState("");
    const [showCityDropdown, setShowCityDropdown] = useState(false);
    const filteredCities = BD_CITIES.filter(c => c.toLowerCase().includes(citySearch.toLowerCase()));

    const toggleAmenity = (id: string) => setSelectedAmenities(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
    const togglePayment = (p: string) => setSelectedPayments(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        setLoading(true);
        try {
            await api.createHotel({
                ownerId,
                name: fd.get("name") as string,
                city: fd.get("city") as string,
                address: fd.get("address") as string,
                description: fd.get("description") as string,
                checkInTime: `${checkInHour}:00 ${checkInPeriod}`,
                checkOutTime: `${checkOutHour}:00 ${checkOutPeriod}`,
                amenities: selectedAmenities,
                acceptedPayments: selectedPayments,
                images,
                mapUrl
            });
            onDone();
        } catch (e: any) { alert("Failed: " + e.message); }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs z-[150] flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white border border-slate-200 rounded-[32px] w-full max-w-2xl shadow-2xl relative my-auto text-slate-900">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white rounded-t-[32px] z-10">
                    <div>
                        <h3 className="font-black text-xl text-slate-900 uppercase tracking-tight">Register New Property</h3>
                        <p className="text-slate-500 text-xs font-semibold mt-0.5">List a hotel, resort or guest house on StayBD</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-400 hover:text-slate-700">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5 px-0.5">Hotel Name</label>
                            <input name="name" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="e.g. Grand Palace Hotel" />
                        </div>
                        <div>
                            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5 px-0.5">City / Location</label>
                            <div className="relative">
                                <input type="hidden" name="city" value={citySearch} />
                                <input
                                    required
                                    value={citySearch}
                                    onChange={(e) => { setCitySearch(e.target.value); setShowCityDropdown(true); }}
                                    onFocus={() => setShowCityDropdown(true)}
                                    onBlur={() => setTimeout(() => setShowCityDropdown(false), 200)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                    placeholder="Search e.g. Cox's Bazar"
                                />
                                {showCityDropdown && (
                                    <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-xl z-[200] shadow-xl p-1.5">
                                        {filteredCities.length > 0 ? filteredCities.map(c => (
                                            <button
                                                key={c}
                                                type="button"
                                                onClick={() => { setCitySearch(c); setShowCityDropdown(false); }}
                                                className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 hover:text-indigo-700 text-slate-800 rounded-lg text-xs font-semibold transition"
                                            >
                                                {c}
                                            </button>
                                        )) : (
                                            <div className="px-3 py-2 text-xs text-slate-500 font-medium">Saved as typed</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5 px-0.5">Property Description</label>
                        <textarea name="description" rows={3} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition resize-none" placeholder="Highlight amenities, location advantages, ocean view..." />
                    </div>
                    <div>
                        <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5 px-0.5">Full Physical Address</label>
                        <input name="address" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="Plot / Road, Area, Landmark..." />
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider px-0.5">Google Maps Link</label>
                            <a href="https://maps.google.com/" target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-wider flex items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded-md transition">
                                <Map className="w-3 h-3" /> Find on Maps
                            </a>
                        </div>
                        <input value={mapUrl} onChange={(e) => setMapUrl(e.target.value)} type="url" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="https://maps.app.goo.gl/..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5 px-0.5">Check-in Time</label>
                            <div className="flex gap-2">
                                <select
                                    value={checkInHour}
                                    onChange={(e) => setCheckInHour(e.target.value)}
                                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none"
                                >
                                    {Array.from({ length: 12 }, (_, i) => i + 1).map(h => {
                                        const val = h < 10 ? `0${h}` : `${h}`;
                                        return <option key={val} value={val}>{val}:00</option>
                                    })}
                                </select>
                                <select
                                    value={checkInPeriod}
                                    onChange={(e) => setCheckInPeriod(e.target.value)}
                                    className="w-16 bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-xs font-bold text-slate-900 outline-none"
                                >
                                    <option value="AM">AM</option>
                                    <option value="PM">PM</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5 px-0.5">Check-out Time</label>
                            <div className="flex gap-2">
                                <select
                                    value={checkOutHour}
                                    onChange={(e) => setCheckOutHour(e.target.value)}
                                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none"
                                >
                                    {Array.from({ length: 12 }, (_, i) => i + 1).map(h => {
                                        const val = h < 10 ? `0${h}` : `${h}`;
                                        return <option key={val} value={val}>{val}:00</option>
                                    })}
                                </select>
                                <select
                                    value={checkOutPeriod}
                                    onChange={(e) => setCheckOutPeriod(e.target.value)}
                                    className="w-16 bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-xs font-bold text-slate-900 outline-none"
                                >
                                    <option value="AM">AM</option>
                                    <option value="PM">PM</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-2 px-0.5">Hotel Amenities</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {HOTEL_AMENITIES.map(a => (
                                <button
                                    key={a.id}
                                    type="button"
                                    onClick={() => toggleAmenity(a.id)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition border ${selectedAmenities.includes(a.id)
                                        ? "bg-indigo-50 border-indigo-300 text-indigo-700 shadow-2xs"
                                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                                        }`}
                                >
                                    <span>{a.icon}</span>
                                    <span className="truncate">{a.label}</span>
                                    {selectedAmenities.includes(a.id) && (
                                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 ml-auto shrink-0" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-2 px-0.5">Accepted Payments</label>
                        <div className="flex flex-wrap gap-2">
                            {PAYMENT_OPTIONS.map(p => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => togglePayment(p)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition border ${selectedPayments.includes(p)
                                        ? "bg-emerald-50 border-emerald-300 text-emerald-700 shadow-2xs"
                                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                                        }`}
                                >
                                    {p}
                                    {selectedPayments.includes(p) && <span className="ml-1 text-emerald-600 font-bold">✓</span>}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-2 px-0.5">Hotel Photos</label>
                        <MultiImageUploader onChange={setImages} maxImages={5} />
                    </div>
                    <button disabled={loading} type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3.5 rounded-xl text-xs uppercase tracking-wider transition shadow-sm active:scale-95 flex justify-center items-center gap-2">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Register Property <CheckCircle2 className="w-4 h-4" /></>}
                    </button>
                </form>
            </div>
        </div>
    );
}

export function AddRoomModal({
    hotelId,
    hotelName,
    hotelCity,
    onClose,
    onDone
}: {
    hotelId: string;
    hotelName?: string;
    hotelCity?: string;
    onClose: () => void;
    onDone: () => void;
}) {
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
    const [petsAllowed, setPetsAllowed] = useState(false);
    const [category, setCategory] = useState(ROOM_CATEGORIES[4]); // Deluxe Room
    const [viewType, setViewType] = useState('City View');
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showViewTypeDropdown, setShowViewTypeDropdown] = useState(false);

    const toggleAmenity = (id: string) => setSelectedAmenities(prev =>
        prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );

    const [maxAdults, setMaxAdults] = useState(2);
    const [maxChildren, setMaxChildren] = useState(0);
    const [inventory, setInventory] = useState(1);
    const [floor, setFloor] = useState(1);
    const [beds, setBeds] = useState<Record<string, number>>({});

    const updateBedCount = (type: string, delta: number) => {
        setBeds(prev => ({ ...prev, [type]: Math.max(0, (prev[type] || 0) + delta) }));
    };

    const ROOM_PHOTO_PRESETS = [
        { label: "Ocean Cabana", url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800" },
        { label: "Luxury Suite", url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800" },
        { label: "Grand Bedroom", url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800" },
        { label: "Royal Penthouse", url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800" }
    ];

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        setLoading(true);
        try {
            const price = Number(fd.get('price'));
            const discountInput = fd.get('discountPrice');
            const discountPrice = discountInput && Number(discountInput) > 0 ? Number(discountInput) : undefined;
            const finalImages = images.length > 0
                ? images
                : ["https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800", "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800"];

            await api.addRoom({
                hotelId,
                hotelName: hotelName || "Sea Pearl Royal Beach Resort",
                hotelCity: hotelCity || "Cox's Bazar",
                type: fd.get('type') as string,
                category,
                pricePerNight: price,
                discountPrice,
                totalInventory: inventory,
                availableCount: inventory,
                floorNumber: floor,
                description: fd.get('description') as string,
                capacity: `${maxAdults + maxChildren} Guests`,
                viewType,
                sizeSqFt: Number(fd.get('sizeSqFt')) || undefined,
                maxAdults,
                maxChildren,
                petsAllowed,
                beds,
                images: finalImages,
                amenities: selectedAmenities.length > 0 ? selectedAmenities : ["Free WiFi", "Air Conditioning", "Attached Bath"]
            } as any);
            onDone();
        } catch (e: any) { alert('Failed: ' + e.message); }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs z-[150] flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-[32px] w-full max-w-xl shadow-2xl overflow-hidden relative text-slate-900">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
                    <div>
                        <h3 className="font-black text-xl text-slate-900 uppercase tracking-tight">Add New Room Category</h3>
                        <p className="text-slate-500 text-xs font-semibold mt-0.5">Configure room pricing, capacity and amenities</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl transition text-slate-500">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="relative">
                            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5 px-0.5">Room Category</label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 flex items-center justify-between hover:border-slate-300 transition"
                                >
                                    <span>{category}</span>
                                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                                </button>
                                {showCategoryDropdown && (
                                    <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-xl z-[200] shadow-xl p-1.5">
                                        {ROOM_CATEGORIES.map(c => (
                                            <button
                                                key={c}
                                                type="button"
                                                onClick={() => { setCategory(c); setShowCategoryDropdown(false); }}
                                                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition ${category === c ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                                            >
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5 px-0.5">Room Name</label>
                            <input name="type" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="e.g. Deluxe Ocean View Suite" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5 px-0.5">Floor Number</label>
                        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl p-1">
                            <button type="button" onClick={() => setFloor(Math.max(0, floor - 1))} className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 rounded-lg transition font-black text-base">−</button>
                            <span className="flex-1 text-center text-xs font-black text-slate-900">{floor}</span>
                            <button type="button" onClick={() => setFloor(floor + 1)} className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 rounded-lg transition font-black text-base">+</button>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5 px-0.5">Base Price (৳)</label>
                            <input name="price" type="number" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-emerald-700 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="4500" />
                        </div>
                        <div>
                            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5 px-0.5">Promo / Offer (৳)</label>
                            <input name="discountPrice" type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-indigo-700 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="3850" />
                        </div>
                        <div>
                            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5 px-0.5">Inventory Units</label>
                            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl p-1">
                                <button type="button" onClick={() => setInventory(Math.max(1, inventory - 1))} className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 rounded-lg transition font-black text-base">−</button>
                                <span className="flex-1 text-center text-xs font-black text-slate-900">{inventory}</span>
                                <button type="button" onClick={() => setInventory(inventory + 1)} className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 rounded-lg transition font-black text-base">+</button>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5 px-0.5">Capacity</label>
                            <div className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700">
                                {maxAdults + maxChildren} Guests
                            </div>
                        </div>
                        <div className="relative">
                            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5 px-0.5">View Type</label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowViewTypeDropdown(!showViewTypeDropdown)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 flex items-center justify-between hover:border-slate-300 transition"
                                >
                                    <span>{viewType}</span>
                                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${showViewTypeDropdown ? 'rotate-180' : ''}`} />
                                </button>
                                <input type="hidden" name="viewType" value={viewType} />
                                {showViewTypeDropdown && (
                                    <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-xl z-[200] shadow-xl p-1.5">
                                        {VIEW_TYPES.map(v => (
                                            <button
                                                key={v}
                                                type="button"
                                                onClick={() => { setViewType(v); setShowViewTypeDropdown(false); }}
                                                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition ${viewType === v ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                                            >
                                                {v}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5 px-0.5">Size (SqFt)</label>
                            <input name="sizeSqFt" type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="e.g. 320" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div>
                            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5 px-0.5">Max Adults</label>
                            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl p-1">
                                <button type="button" onClick={() => setMaxAdults(Math.max(1, maxAdults - 1))} className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 rounded-lg transition font-black text-base">−</button>
                                <span className="flex-1 text-center text-xs font-black text-slate-900">{maxAdults}</span>
                                <button type="button" onClick={() => setMaxAdults(maxAdults + 1)} className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 rounded-lg transition font-black text-base">+</button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5 px-0.5">Max Children</label>
                            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl p-1">
                                <button type="button" onClick={() => setMaxChildren(Math.max(0, maxChildren - 1))} className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 rounded-lg transition font-black text-base">−</button>
                                <span className="flex-1 text-center text-xs font-black text-slate-900">{maxChildren}</span>
                                <button type="button" onClick={() => setMaxChildren(maxChildren + 1)} className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 rounded-lg transition font-black text-base">+</button>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center">
                            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5 px-0.5">Pets Allowed</label>
                            <button
                                type="button"
                                onClick={() => setPetsAllowed(!petsAllowed)}
                                className={`w-12 h-6 rounded-full transition-colors relative ${petsAllowed ? 'bg-indigo-600' : 'bg-slate-300'}`}
                            >
                                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all shadow-xs ${petsAllowed ? 'left-6.5' : 'left-0.5'}`} />
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-2 px-1">Room Bed Configuration</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                            {BED_TYPES.map(type => (
                                <div key={type} className="flex flex-col gap-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                                    <span className="text-[10px] font-black text-slate-700 uppercase truncate">{type}</span>
                                    <div className="flex items-center gap-1 justify-between">
                                        <button type="button" onClick={() => updateBedCount(type, -1)} className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-200 rounded-md transition font-black text-sm">−</button>
                                        <span className="text-xs font-black text-slate-900">{beds[type] || 0}</span>
                                        <button type="button" onClick={() => updateBedCount(type, 1)} className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-200 rounded-md transition font-black text-sm">+</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-2 px-1">Room Amenities</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {ROOM_AMENITIES.map(a => (
                                <button
                                    key={a.id}
                                    type="button"
                                    onClick={() => toggleAmenity(a.id)}
                                    className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-bold transition border ${selectedAmenities.includes(a.id)
                                        ? "bg-indigo-50 border-indigo-300 text-indigo-700 shadow-2xs"
                                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                                        }`}
                                >
                                    <span>{a.icon}</span>
                                    <span className="truncate">{a.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5 px-1">Room Description</label>
                        <textarea name="description" rows={3} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition resize-none" placeholder="Balcony view, jacuzzi, king size bed..." />
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-2 px-1">
                            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider">Room Photos</label>
                            <span className="text-[10px] text-slate-500 font-bold">Pick presets or upload files</span>
                        </div>
                        {/* Quick preset luxury photo thumbnails */}
                        <div className="grid grid-cols-4 gap-2 mb-3">
                            {ROOM_PHOTO_PRESETS.map((preset, pIdx) => {
                                const isSelected = images.includes(preset.url);
                                return (
                                    <button
                                        key={pIdx}
                                        type="button"
                                        onClick={() => {
                                            if (isSelected) {
                                                setImages(images.filter(x => x !== preset.url));
                                            } else {
                                                setImages([...images, preset.url]);
                                            }
                                        }}
                                        className={`relative rounded-xl overflow-hidden h-14 border-2 transition group text-left ${isSelected ? 'border-indigo-600 ring-2 ring-indigo-500/30' : 'border-slate-200 hover:border-slate-400'}`}
                                    >
                                        <img src={preset.url} alt={preset.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1">
                                            <span className="text-[9px] text-white font-black truncate leading-tight">{preset.label}</span>
                                        </div>
                                        {isSelected && (
                                            <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[8px] font-black">
                                                ✓
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                        <MultiImageUploader onChange={setImages} initialImages={images} maxImages={5} />
                    </div>
                    <button disabled={loading} type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3.5 rounded-xl text-xs uppercase tracking-wider transition shadow-sm active:scale-95 flex justify-center items-center gap-2">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Save Room Category <CheckCircle2 className="w-4 h-4" /></>}
                    </button>
                </form>
            </div>
        </div>
    );
}

export function RoomModal({ room, onClose, onDone }: { room: any; onClose: () => void; onDone: () => void }) {
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState<string[]>(room?.images || []);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>(room?.amenities || []);
    const [petsAllowed, setPetsAllowed] = useState(room?.petsAllowed || false);
    const [category, setCategory] = useState(room?.category || ROOM_CATEGORIES[4]);
    const [viewType, setViewType] = useState(room?.viewType || 'City View');
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showViewTypeDropdown, setShowViewTypeDropdown] = useState(false);
    const [maxAdults, setMaxAdults] = useState(room?.maxAdults || 2);
    const [maxChildren, setMaxChildren] = useState(room?.maxChildren || 0);
    const [inventory, setInventory] = useState(room?.totalInventory || 1);
    const [floor, setFloor] = useState(room?.floorNumber || 1);
    const [beds, setBeds] = useState<Record<string, number>>(room?.beds || {});

    const updateBedCount = (type: string, delta: number) => {
        setBeds(prev => ({ ...prev, [type]: Math.max(0, (prev[type] || 0) + delta) }));
    };

    const toggleAmenity = (id: string) => setSelectedAmenities(prev =>
        prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        setLoading(true);
        try {
            await api.updateRoom(room.id, {
                type: fd.get("type") as any,
                category,
                pricePerNight: Number(fd.get("price")),
                totalInventory: inventory,
                availableCount: inventory,
                floorNumber: floor,
                description: fd.get("description") as string,
                capacity: `${maxAdults + maxChildren} Guests`,
                viewType: fd.get("viewType") as string,
                sizeSqFt: Number(fd.get("sizeSqFt")) || undefined,
                maxAdults,
                maxChildren,
                petsAllowed,
                beds,
                images,
                amenities: selectedAmenities
            });
            onDone();
        } catch (e: any) { alert("Failed: " + e.message); }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs z-[150] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white border border-slate-200 rounded-[32px] w-full max-w-xl shadow-2xl overflow-hidden relative text-slate-900">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
                    <div>
                        <h3 className="font-black text-xl text-slate-900 uppercase tracking-tight">Edit Room Details</h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Update rate, inventory, amenities and photos</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl transition text-slate-500 hover:text-slate-900">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[78vh] overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5 px-0.5">Room Category</label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-black text-slate-900 flex items-center justify-between hover:border-slate-300 transition"
                                >
                                    <span>{category}</span>
                                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${showCategoryDropdown ? "rotate-180" : ""}`} />
                                </button>
                                {showCategoryDropdown && (
                                    <div className="absolute top-full left-0 right-0 mt-2 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-2xl z-[200] shadow-xl p-2 custom-scrollbar">
                                        {ROOM_CATEGORIES.map(c => (
                                            <button
                                                key={c}
                                                type="button"
                                                onClick={() => { setCategory(c); setShowCategoryDropdown(false); }}
                                                className={`w-full text-left px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition mb-0.5 ${category === c ? "bg-indigo-600 text-white" : "text-slate-700 hover:bg-slate-100"}`}
                                            >
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5 px-0.5">Room Name / Label</label>
                            <input name="type" required defaultValue={room?.type} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-black text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5 px-0.5">Floor Number</label>
                        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-2xl p-1 max-w-[200px]">
                            <button type="button" onClick={() => setFloor(Math.max(0, floor - 1))} className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition font-black text-base">−</button>
                            <span className="flex-1 text-center text-xs font-black text-slate-900">{floor}</span>
                            <button type="button" onClick={() => setFloor(floor + 1)} className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition font-black text-base">+</button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5 px-0.5">Price / Night (৳)</label>
                            <input name="price" type="number" required defaultValue={room?.pricePerNight} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-black text-emerald-700 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition" />
                        </div>
                        <div>
                            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5 px-0.5">Total Rooms (Inventory)</label>
                            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-2xl p-1">
                                <button type="button" onClick={() => setInventory(Math.max(1, inventory - 1))} className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition font-black text-base">−</button>
                                <span className="flex-1 text-center text-xs font-black text-slate-900">{inventory}</span>
                                <button type="button" onClick={() => setInventory(inventory + 1)} className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition font-black text-base">+</button>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5 px-0.5">Capacity</label>
                            <div className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-slate-600">
                                {maxAdults + maxChildren} Guests
                            </div>
                        </div>
                        <div className="relative">
                            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5 px-0.5">View Type</label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowViewTypeDropdown(!showViewTypeDropdown)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-black text-slate-900 flex items-center justify-between hover:border-slate-300 transition"
                                >
                                    <span>{viewType}</span>
                                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${showViewTypeDropdown ? 'rotate-180' : ''}`} />
                                </button>
                                <input type="hidden" name="viewType" value={viewType} />
                                {showViewTypeDropdown && (
                                    <div className="absolute top-full left-0 right-0 mt-2 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-2xl z-[200] shadow-xl p-2 custom-scrollbar">
                                        {VIEW_TYPES.map(v => (
                                            <button
                                                key={v}
                                                type="button"
                                                onClick={() => { setViewType(v); setShowViewTypeDropdown(false); }}
                                                className={`w-full text-left px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition mb-0.5 ${viewType === v ? 'bg-indigo-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
                                            >
                                                {v}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5 px-0.5">Size (SqFt)</label>
                            <input name="sizeSqFt" type="number" defaultValue={room?.sizeSqFt} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-black text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5 px-0.5">Max Adults</label>
                            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-2xl p-1">
                                <button type="button" onClick={() => setMaxAdults(Math.max(1, maxAdults - 1))} className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition font-black text-base">−</button>
                                <span className="flex-1 text-center text-xs font-black text-slate-900">{maxAdults}</span>
                                <button type="button" onClick={() => setMaxAdults(maxAdults + 1)} className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition font-black text-base">+</button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5 px-0.5">Max Children</label>
                            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-2xl p-1">
                                <button type="button" onClick={() => setMaxChildren(Math.max(0, maxChildren - 1))} className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition font-black text-base">−</button>
                                <span className="flex-1 text-center text-xs font-black text-slate-900">{maxChildren}</span>
                                <button type="button" onClick={() => setMaxChildren(maxChildren + 1)} className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition font-black text-base">+</button>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center">
                            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5 px-0.5">Pets Allowed</label>
                            <button
                                type="button"
                                onClick={() => setPetsAllowed(!petsAllowed)}
                                className={`w-12 h-6 rounded-full transition-colors relative ${petsAllowed ? 'bg-indigo-600' : 'bg-slate-300'}`}
                            >
                                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all shadow-xs ${petsAllowed ? 'left-6.5' : 'left-0.5'}`} />
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-2 px-1">Room Bed Types</label>
                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
                            {BED_TYPES.map(type => (
                                <div key={type} className="flex flex-col gap-1 p-2.5 bg-slate-50 border border-slate-200 rounded-2xl">
                                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider truncate">{type}</span>
                                    <div className="flex items-center gap-1 justify-between">
                                        <button type="button" onClick={() => updateBedCount(type, -1)} className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition font-black text-sm">−</button>
                                        <span className="text-xs font-black text-slate-900">{beds[type] || 0}</span>
                                        <button type="button" onClick={() => updateBedCount(type, 1)} className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition font-black text-sm">+</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-2 px-1">Update Amenities</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {ROOM_AMENITIES.map(a => (
                                <button
                                    type="button"
                                    onClick={() => toggleAmenity(a.id)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-bold transition-all border ${selectedAmenities.includes(a.id)
                                        ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-2xs"
                                        : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900"
                                        }`}
                                >
                                    <span>{a.icon}</span>
                                    <span className="uppercase tracking-wider truncate">{a.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5 px-1">Description</label>
                        <textarea name="description" rows={3} required defaultValue={room?.description} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition resize-none" />
                    </div>
                    <div>
                        <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-2 px-1">Update Photos</label>
                        <MultiImageUploader initialImages={images} onChange={setImages} maxImages={5} dark={false} />
                    </div>
                    <button disabled={loading} type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-wider transition shadow-md shadow-indigo-600/20 active:scale-95 flex justify-center items-center gap-2">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Save Room Changes <CheckCircle2 className="w-4 h-4" /></>}
                    </button>
                </form>
            </div>
        </div>
    );
}

export function AddPricingModal({ hotelId, rooms, onClose, onDone }: {
    hotelId: string;
    rooms: any[];
    onClose: () => void;
    onDone: () => void;
}) {
    const [label, setLabel] = useState("");
    const [roomId, setRoomId] = useState(rooms[0]?.id || "");
    const [multiplier, setMultiplier] = useState(1.2);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async () => {
        if (!label || !startDate || !endDate) return;
        setLoading(true);
        await api.addPricingRule({ hotelId, roomId, label, multiplier, startDate, endDate, isActive: true });
        setLoading(false);
        onDone();
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 z-[150] flex justify-center items-center p-4 backdrop-blur-2xs animate-in fade-in duration-200">
            <div className="bg-white border border-slate-200 rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden text-slate-900">
                <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/80">
                    <div>
                        <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">New Pricing Rule</h2>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Automated rate multiplier for date periods</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl transition text-slate-500">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">Rule Label</label>
                        <input
                            value={label} onChange={e => setLabel(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="e.g. Weekend Surge, Eid Holiday..."
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">Target Room Category</label>
                        <select
                            value={roomId} onChange={e => setRoomId(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                        >
                            {rooms.map(r => <option key={r.id} value={r.id}>{r.type} — Floor {r.floorNumber}</option>)}
                        </select>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider">Price Multiplier</label>
                            <span className="text-xs font-black text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">{multiplier}x</span>
                        </div>
                        <input
                            type="range" min={0.5} max={3} step={0.05}
                            value={multiplier} onChange={e => setMultiplier(+e.target.value)}
                            className="w-full accent-indigo-600"
                        />
                        <div className="flex justify-between text-[9px] text-slate-500 font-bold uppercase mt-1">
                            <span>0.5x (-50%)</span><span>Standard (1x)</span><span>3.0x (+200%)</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">Start Date</label>
                            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">End Date</label>
                            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="bg-indigo-50/70 rounded-2xl p-4 border border-indigo-100">
                        <p className="text-[10px] font-black text-indigo-700 uppercase tracking-wider mb-0.5">Calculated Rate Preview</p>
                        <p className="text-slate-900 font-black text-xl tabular-nums">
                            {rooms.find(r => r.id === roomId)
                                ? <>৳{Math.round((rooms.find(r => r.id === roomId)?.pricePerNight || 0) * multiplier).toLocaleString()}<span className="text-slate-500 text-xs font-bold"> /night</span></>
                                : "—"
                            }
                        </p>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold uppercase border border-slate-200 transition">Cancel</button>
                        <button onClick={submit} disabled={loading || !label || !startDate || !endDate}
                            className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase transition shadow-sm active:scale-95 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Apply Rule"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function AddExperienceModal({
    ownerId,
    hotelId,
    hotelName,
    onClose,
    onDone,
}: {
    ownerId: string;
    hotelId?: string;
    hotelName?: string;
    onClose: () => void;
    onDone: () => void;
}) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [city, setCity] = useState("");
    const [location, setLocation] = useState("");
    const [category, setCategory] = useState<"original" | "standard">("standard");
    const [badge, setBadge] = useState("Popular");
    const [price, setPrice] = useState(25);
    const [rating, setRating] = useState(4.8);
    const [reviews, setReviews] = useState(0);
    const [duration, setDuration] = useState("2 hours");
    const [maxGuests, setMaxGuests] = useState(6);
    const [isActive, setIsActive] = useState(true);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [meetingPoint, setMeetingPoint] = useState("");
    const [hostName, setHostName] = useState("");
    const [amenitiesStr, setAmenitiesStr] = useState("");
    const [servicesStr, setServicesStr] = useState("");
    const [whatIncludesStr, setWhatIncludesStr] = useState("");
    const [tagsStr, setTagsStr] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const submit = async () => {
        setError("");
        if (!title.trim()) { setError("Title is required"); return; }
        if (!city.trim()) { setError("City is required"); return; }
        if (!location.trim()) { setError("Location is required"); return; }
        if (price <= 0) { setError("Price must be greater than 0"); return; }
        setLoading(true);
        try {
            const coverImage = uploadedImages[0] || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600";
            await api.addExperience({
                ownerId, hotelId, hotelName,
                title: title.trim(), description: description.trim(),
                city: city.trim(), location: location.trim(), category,
                badge: badge.trim() || (category === "original" ? "Original" : "Popular"),
                price, rating, reviews, duration: duration.trim() || undefined,
                maxGuests, image: coverImage,
                images: uploadedImages.length > 0 ? uploadedImages : [coverImage],
                meetingPoint: meetingPoint.trim() || undefined,
                hostName: hostName.trim() || undefined,
                amenities: amenitiesStr.split(",").map(s => s.trim()).filter(Boolean),
                services: servicesStr.split(",").map(s => s.trim()).filter(Boolean),
                whatIncludes: whatIncludesStr.split(",").map(s => s.trim()).filter(Boolean),
                tags: tagsStr.split(",").map(s => s.trim()).filter(Boolean),
                isActive,
            });
            onDone();
        } catch { setError("Failed to publish. Try again."); }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs z-[150] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white border border-slate-200 rounded-[32px] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-900">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/80 shrink-0">
                    <div>
                        <h3 className="font-black text-xl text-slate-900 uppercase tracking-tight">Publish Tour or Experience</h3>
                        <p className="text-slate-500 text-xs font-semibold mt-0.5">Card will appear live on the public Experiences showcase</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl transition text-slate-500">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
                    {error && (
                        <div className="bg-rose-50 p-3 rounded-xl border border-rose-200">
                            <p className="text-rose-600 text-xs font-bold">{error}</p>
                        </div>
                    )}
                    <div>
                        <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-2">Experience Photos</label>
                        <MultiImageUploader onChange={setUploadedImages} maxImages={5} />
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                        <div>
                            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">Experience Title *</label>
                            <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="e.g. Traditional Cox's Bazar Sunset Boat Cruise" value={title} onChange={e => setTitle(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">Description</label>
                            <textarea rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition resize-none" placeholder="Describe the itinerary and highlights..." value={description} onChange={e => setDescription(e.target.value)} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">City *</label>
                            <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="e.g. Cox's Bazar" value={city} onChange={e => setCity(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">Location *</label>
                            <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="e.g. Inani Beach, Cox's Bazar" value={location} onChange={e => setLocation(e.target.value)} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">Category</label>
                            <div className="flex gap-2">
                                {(["standard", "original"] as const).map(c => (
                                    <button key={c} type="button" onClick={() => { setCategory(c); setBadge(c === "original" ? "Original" : "Popular"); }} className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider border transition-all ${category === c ? "bg-indigo-50 border-indigo-300 text-indigo-700 shadow-2xs" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"}`}>
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">Badge Label</label>
                            <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="e.g. Popular, Best Value" value={badge} onChange={e => setBadge(e.target.value)} />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">Price (৳/guest) *</label>
                            <input type="number" min={1} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-emerald-700 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition" value={price} onChange={e => setPrice(+e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">Rating (0-5)</label>
                            <input type="number" min={0} max={5} step={0.1} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-amber-700 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition" value={rating} onChange={e => setRating(+e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">Review Count</label>
                            <input type="number" min={0} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition" value={reviews} onChange={e => setReviews(+e.target.value)} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">Duration</label>
                            <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="e.g. 2 hours" value={duration} onChange={e => setDuration(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">Max Guests</label>
                            <input type="number" min={1} max={50} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition" value={maxGuests} onChange={e => setMaxGuests(+e.target.value)} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">Meeting Point</label>
                            <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="e.g. Hotel Front Desk" value={meetingPoint} onChange={e => setMeetingPoint(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">Host Name</label>
                            <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="e.g. Capt. Zahid" value={hostName} onChange={e => setHostName(e.target.value)} />
                        </div>
                    </div>
                    <div className="bg-indigo-50/70 rounded-2xl p-4 border border-indigo-100 flex items-center justify-between">
                        <div>
                            <p className="text-[11px] font-black text-indigo-700 uppercase tracking-wider">Publish Immediately</p>
                            <p className="text-slate-500 text-xs font-semibold">Make visible to guests searching experiences</p>
                        </div>
                        <button type="button" onClick={() => setIsActive(!isActive)} className={`w-12 h-6 rounded-full transition-colors relative ${isActive ? "bg-indigo-600" : "bg-slate-300"}`}>
                            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-xs transition-all ${isActive ? "left-6.5" : "left-0.5"}`} />
                        </button>
                    </div>
                </div>
                <div className="p-6 border-t border-slate-100 bg-slate-50/80 flex gap-3 shrink-0">
                    <button onClick={onClose} className="flex-1 bg-white hover:bg-slate-100 text-slate-700 py-3 rounded-xl text-xs font-bold uppercase border border-slate-200 transition">Cancel</button>
                    <button disabled={loading} onClick={submit} className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-3 rounded-xl text-xs font-bold uppercase transition shadow-sm flex items-center justify-center gap-2">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Star className="w-4 h-4" /> Publish Experience</>}
                    </button>
                </div>
            </div>
        </div>
    );
}

export function AddOfferModal({ hotel, onClose, onDone }: { hotel: Hotel; onClose: () => void; onDone: () => void }) {
    const [title, setTitle] = useState("");
    const [discountPercent, setDiscountPercent] = useState(25);
    const [imageUrl, setImageUrl] = useState("");
    const [imageName, setImageName] = useState("");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const onPickImage: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError("");
        if (!file.type.startsWith("image/")) {
            setError("Please select an image file");
            return;
        }

        const maxBytes = 1024 * 1024;
        if (file.size > maxBytes) {
            setError("Image is too large (max 1MB)");
            return;
        }

        setImageName(file.name);
        const reader = new FileReader();
        reader.onload = () => {
            const result = typeof reader.result === "string" ? reader.result : "";
            setImageUrl(result);
        };
        reader.onerror = () => {
            setError("Failed to read image");
        };
        reader.readAsDataURL(file);
    };

    const submit = async () => {
        setError("");
        if (!title.trim()) {
            setError("Offer title is required");
            return;
        }
        if (discountPercent <= 0 || discountPercent > 100) {
            setError("Discount must be between 1 and 100");
            return;
        }
        setLoading(true);
        try {
            await api.addOffer({
                hotelId: hotel.id,
                hotelName: hotel.name,
                title: title.trim().toUpperCase(),
                discountPercent,
                imageUrl: imageUrl.trim() || undefined,
                isActive: true,
                startDate: startDate || undefined,
                endDate: endDate || undefined,
            });
            onDone();
        } catch (e: any) {
            setError(e.message || "Failed to create offer");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs z-[150] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white border border-slate-200 rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-900">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
                    <div>
                        <h3 className="font-black text-xl text-slate-900 uppercase tracking-tight">Create Offer</h3>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mt-0.5">Publish discount promotion for this property</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl transition text-slate-500 hover:text-slate-900">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
                    {error && (
                        <div className="bg-rose-50 p-3 rounded-2xl border border-rose-200">
                            <p className="text-rose-600 text-xs font-bold uppercase tracking-wider">{error}</p>
                        </div>
                    )}
                    <div>
                        <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">Offer Title</label>
                        <input
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition"
                            placeholder="e.g. EID MEGA DEAL / SUMMER RETREAT"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">Discount Percentage (%)</label>
                        <input
                            type="number"
                            min={1}
                            max={100}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-black text-emerald-700 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition"
                            value={discountPercent}
                            onChange={e => setDiscountPercent(+e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">Offer Image (Optional)</label>
                        <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4">
                            <div className="flex items-center justify-between gap-4">
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-slate-900 uppercase tracking-tight truncate">{imageName || "No image selected"}</p>
                                    <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">PNG / JPG • max 1MB</p>
                                </div>
                                <label className="px-3 py-1.5 rounded-xl bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 transition text-[10px] font-bold uppercase tracking-wider cursor-pointer shrink-0 shadow-2xs">
                                    Browse
                                    <input type="file" accept="image/*" className="hidden" onChange={onPickImage} />
                                </label>
                            </div>

                            {imageUrl && (
                                <div className="mt-3 flex items-center gap-3">
                                    <img src={imageUrl} alt="Offer" className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                                    <button
                                        type="button"
                                        onClick={() => { setImageUrl(""); setImageName(""); }}
                                        className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 transition text-[10px] font-bold uppercase tracking-wider"
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">Start Date</label>
                            <input
                                type="date"
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition"
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">End Date</label>
                            <input
                                type="date"
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition"
                                value={endDate}
                                onChange={e => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50/80 flex gap-3 sticky bottom-0">
                    <button onClick={onClose} className="flex-1 bg-white hover:bg-slate-100 text-slate-700 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition border border-slate-200">
                        Cancel
                    </button>
                    <button
                        disabled={loading}
                        onClick={submit}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition shadow-md shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} Create Offer
                    </button>
                </div>
            </div>
        </div>
    );
}

export function AddOfflineBookingModal({
    hotelId,
    rooms,
    users,
    preselectedRoomType,
    onClose,
    onDone
}: {
    hotelId: string;
    rooms: any[];
    users: any[];
    preselectedRoomType?: string;
    onClose: () => void;
    onDone: () => void;
}) {
    const defaultRoom = preselectedRoomType ? rooms.find(r => r.type === preselectedRoomType) : rooms[0];
    const [roomId, setRoomId] = useState(defaultRoom?.id ?? rooms[0]?.id ?? "");
    const [nights, setNights] = useState(1);
    const [guestName, setGuestName] = useState("");
    const [linkedUserId, setLinkedUserId] = useState<string>("");
    const [submitting, setSubmitting] = useState(false);

    const submit = async () => {
        if (!roomId) return;
        setSubmitting(true);
        try {
            await api.addOfflineBooking({ hotelId, roomId, nights, guestName: guestName.trim() || "Walk-in Guest", userId: linkedUserId || undefined });
            onDone();
            onClose();
        } catch (e: any) {
            alert("Failed: " + e.message);
        } finally {
            setSubmitting(false);
        }
    };

    const selectedRoom = rooms.find(r => r.id === roomId);
    const total = (selectedRoom?.pricePerNight ?? 0) * nights;

    return (
        <div className="fixed inset-0 bg-slate-900/60 z-[200] flex items-center justify-center p-4 backdrop-blur-2xs animate-in fade-in duration-200">
            <div className="bg-white border border-slate-200 rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-slate-100 bg-slate-50/80 flex justify-between items-center">
                    <div>
                        <h3 className="font-black text-xl text-slate-900 uppercase tracking-tight">Direct Walk-in Booking</h3>
                        <p className="text-slate-500 text-xs font-semibold mt-0.5">Manually record a front-desk reservation</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl text-slate-500 transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-4 bg-white">
                    <div>
                        <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">Guest Full Name</label>
                        <input
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
                            placeholder="Enter guest name (or leave empty for Walk-in)"
                            value={guestName}
                            onChange={e => setGuestName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">Link Guest Account (Optional)</label>
                        <select
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition cursor-pointer"
                            value={linkedUserId}
                            onChange={e => setLinkedUserId(e.target.value)}
                        >
                            <option value="">-- Anonymous / Direct Walk-in --</option>
                            {users.map(u => <option key={u.userId} value={u.userId}>{u.name} (ID: {u.userId.slice(-4)})</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">Assigned Room</label>
                            <select
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition cursor-pointer"
                                value={roomId}
                                onChange={e => setRoomId(e.target.value)}
                            >
                                <option value="">-- Select Room --</option>
                                {rooms.map(r => <option key={r.id} value={r.id}>{r.type} {r.roomNumber ? `(#${r.roomNumber})` : ''}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">Nights</label>
                            <input
                                type="number" min={1} max={30}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-black text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                value={nights}
                                onChange={e => setNights(+e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="bg-indigo-50/70 rounded-2xl p-4 flex justify-between items-center border border-indigo-100">
                        <div>
                            <p className="text-[10px] font-black text-indigo-700 uppercase tracking-wider mb-0.5">Total Charge</p>
                            <p className="text-[10px] text-slate-500 font-semibold">{nights} Night(s) × ৳{selectedRoom?.pricePerNight.toLocaleString() || 0}</p>
                        </div>
                        <span className="text-2xl font-black text-indigo-700 tabular-nums">৳{total.toLocaleString()}</span>
                    </div>
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50/80 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-white hover:bg-slate-100 text-slate-700 py-3 rounded-xl text-xs font-bold uppercase border border-slate-200 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={submit}
                        disabled={submitting || !roomId}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl text-xs font-bold uppercase transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4" /> Record Booking</>}
                    </button>
                </div>
            </div>
        </div>
    );
}

export function AddOfflineBtn({ hotelId, rooms, users, onDone }: { hotelId: string; rooms: any[]; users: any[]; onDone: () => void }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-2 md:gap-3 px-4 sm:px-6 md:px-8 py-3 md:py-4 rounded-xl sm:rounded-2xl md:rounded-3xl text-[10px] sm:text-xs font-black uppercase tracking-[0.1em] md:tracking-[0.2em] transition-all shadow-xl shadow-indigo-600/20 active:scale-95 shrink-0"
            >
                <Plus className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden sm:inline">Log Walk-in</span>
                <span className="sm:hidden">Add</span>
            </button>

            {open && (
                <AddOfflineBookingModal
                    hotelId={hotelId}
                    rooms={rooms}
                    users={users}
                    onClose={() => setOpen(false)}
                    onDone={onDone}
                />
            )}
        </>
    );
}
