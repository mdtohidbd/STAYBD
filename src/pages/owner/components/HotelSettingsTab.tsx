import React, { useState } from 'react';
import { Loader2, WrenchIcon, CheckCircle2 } from 'lucide-react';
import { api, HOTEL_AMENITIES, PAYMENT_OPTIONS, Hotel } from '../../../services/api';
import MultiImageUploader from '../../../components/MultiImageUploader';

export function HotelSettingsTab({ hotel, onDone }: { hotel: Hotel; onDone: () => void }) {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(hotel.name);
    const [description, setDescription] = useState(hotel.description);
    const [city, setCity] = useState(hotel.city);
    const [address, setAddress] = useState(hotel.address);
    const [lat, setLat] = useState(hotel.locationLat || 23.7);
    const [lng, setLng] = useState(hotel.locationLng || 90.4);
    const [mapUrl, setMapUrl] = useState("");
    const [checkInTime, setCheckInTime] = useState(hotel.checkInTime || "02:00 PM");
    const [checkOutTime, setCheckOutTime] = useState(hotel.checkOutTime || "12:00 PM");
    const [images, setImages] = useState<string[]>(hotel.images || []);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>(hotel.amenities || []);
    const [selectedPayments, setSelectedPayments] = useState<string[]>(hotel.acceptedPayments || []);

    const toggleAmenity = (id: string) => {
        setSelectedAmenities(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
    };

    const togglePayment = (id: string) => {
        setSelectedPayments(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.updateHotel(hotel.id, {
                name,
                description,
                city,
                address,
                mapUrl: mapUrl,
                locationLat: lat,
                locationLng: lng,
                images,
                amenities: selectedAmenities,
                checkInTime,
                checkOutTime,
                acceptedPayments: selectedPayments,
            });
            alert("Hotel settings saved successfully!");
            onDone();
        } catch (e: any) {
            alert("Failed to save: " + e.message);
        }
        setLoading(false);
    };

    return (
        <div className="bg-white rounded-[32px] border border-slate-200/90 overflow-hidden shadow-sm p-8 md:p-12 mb-10 transition-all">
            <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-6">
                <div>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-3">
                        <WrenchIcon className="w-7 h-7 text-indigo-600" /> Settings & Configuration
                    </h2>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1.5">
                        Manage details and policy for {hotel.name}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-2 px-1">Hotel Name</label>
                        <input
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition shadow-2xs"
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-2 px-1">City / Region</label>
                        <input
                            value={city}
                            onChange={e => setCity(e.target.value)}
                            required
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition shadow-2xs"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-2 px-1">Property Description</label>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        rows={4}
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none shadow-2xs"
                    />
                </div>

                <div>
                    <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-2 px-1">Full Physical Address</label>
                    <input
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition shadow-2xs"
                    />
                </div>

                <div className="bg-indigo-50/60 p-6 rounded-2xl border border-indigo-100">
                    <label className="block text-[11px] font-black text-indigo-900 uppercase tracking-wider mb-1.5 px-1">Update Map Location</label>
                    <p className="text-xs text-slate-600 mb-3 px-1 font-medium">
                        Current Coordinates: Lat {lat?.toFixed(5)} / Lng {lng?.toFixed(5)}. Paste a new Google Maps Link to update coordinates.
                    </p>
                    <input
                        value={mapUrl}
                        onChange={e => setMapUrl(e.target.value)}
                        type="url"
                        placeholder="https://maps.app.goo.gl/..."
                        className="w-full bg-white border border-indigo-200 rounded-2xl px-5 py-3 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-2 px-1">Check-in Time</label>
                        <input
                            value={checkInTime}
                            onChange={e => setCheckInTime(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition shadow-2xs"
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-2 px-1">Check-out Time</label>
                        <input
                            value={checkOutTime}
                            onChange={e => setCheckOutTime(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition shadow-2xs"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-3 px-1">Hotel Amenities</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {HOTEL_AMENITIES.map(a => {
                            const isSelected = selectedAmenities.includes(a.id);
                            return (
                                <button
                                    key={a.id}
                                    type="button"
                                    onClick={() => toggleAmenity(a.id)}
                                    className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-bold transition-all border ${isSelected
                                        ? "bg-indigo-50 border-indigo-300 text-indigo-700 shadow-xs"
                                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                                        }`}
                                >
                                    <span className="text-base">{a.icon}</span>
                                    <span className="uppercase tracking-wider truncate">{a.label}</span>
                                    {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600 ml-auto shrink-0" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div>
                    <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-3 px-1">Accepted Payments</label>
                    <div className="flex flex-wrap gap-3">
                        {PAYMENT_OPTIONS.map(p => {
                            const isSelected = selectedPayments.includes(p);
                            return (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => togglePayment(p)}
                                    className={`px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all border ${isSelected
                                        ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs flex items-center gap-2"
                                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                                        }`}
                                >
                                    {p}
                                    {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div>
                    <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-3 px-1">Hotel Photos</label>
                    <MultiImageUploader initialImages={images} onChange={setImages} maxImages={6} />
                </div>

                <button
                    disabled={loading}
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest transition-all shadow-md shadow-indigo-600/20 active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CheckCircle2 className="w-5 h-5" /> Save Changes</>}
                </button>
            </form>
        </div>
    );
}
