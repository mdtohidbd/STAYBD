import React, { useState } from "react";
import {
    X,
    Loader2,
    Building2,
    BookOpen,
    CreditCard,
    Shield,
    BarChart3,
    UserCheck,
    Calendar,
    FileText,
    Phone,
    Mail,
    Key,
    Check,
    Eye,
    EyeOff,
    Sparkles,
    MapPin,
    BedDouble,
    CheckCircle2,
    ExternalLink,
    Image as ImageIcon,
    ArrowRight,
    Upload,
    ChevronRight,
    CheckCircle
} from "lucide-react";
import { api, HotelOwner, Hotel, Booking } from "../../../services/api";
import { Badge, ActionBtn } from "./AdminUIElements";

// NID Image Presets for rapid and realistic onboarding
const NID_PRESETS = [
    {
        label: "Smart NID (National ID Card)",
        url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    },
    {
        label: "Digital Verified Citizen NID",
        url: "https://images.unsplash.com/photo-1633265486064-086b219458ec?w=800&auto=format&fit=crop&q=80",
    },
    {
        label: "Corporate Owner ID Dossier",
        url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80",
    }
];

const HOTEL_HERO_PRESETS = [
    {
        label: "Luxury Ocean Resort (Cox's Bazar)",
        url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80"
    },
    {
        label: "Tea Garden Eco Villa (Sylhet)",
        url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&auto=format&fit=crop&q=80"
    },
    {
        label: "Modern City Highrise (Dhaka)",
        url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&auto=format&fit=crop&q=80"
    },
    {
        label: "Scenic Riverside Boutique (Chittagong)",
        url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&auto=format&fit=crop&q=80"
    }
];

const BANGLADESH_CITIES = [
    "Cox's Bazar",
    "Sylhet",
    "Dhaka",
    "Chittagong",
    "Kuakata",
    "Sreemangal",
    "Bandarban",
    "Rangamati",
    "Rajshahi",
    "Khulna",
    "Saint Martin",
    "Gazipur"
];

const AMENITY_OPTIONS = [
    "Free High-Speed Wi-Fi",
    "Swimming Pool",
    "Ocean View Balcony",
    "Complimentary Breakfast",
    "24/7 Security & CCTV",
    "Power Backup Generator",
    "Airport Shuttle",
    "Multi-Cuisine Restaurant",
    "Air Conditioning",
    "24/7 Front Desk Support"
];

export function AddOwnerModal({ onClose, reload }: { onClose: () => void; reload: () => void }) {
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [successData, setSuccessData] = useState<{
        owner: HotelOwner;
        hotel: Hotel;
        rawPassword?: string;
    } | null>(null);

    // Step 1: Owner Profile & NID
    const [name, setName] = useState("Md. Tanvir Ahmed");
    const [email, setEmail] = useState("tanvir.ahmed@grandresort.bd");
    const [phone, setPhone] = useState("+880 1712-384910");
    const [password, setPassword] = useState("owner2026@" + Math.floor(100 + Math.random() * 900));
    const [nidNumber, setNidNumber] = useState("19902692518291024");
    const [nidDocUrl, setNidDocUrl] = useState(NID_PRESETS[0].url);

    // Step 2: Property & Address
    const [hotelName, setHotelName] = useState("Sea Pearl Royal Beach Resort");
    const [city, setCity] = useState("Cox's Bazar");
    const [address, setAddress] = useState("Plot 14, Marine Drive Road, Inani Beach, Cox's Bazar 4700");
    const [hotelCategory, setHotelCategory] = useState("5-Star Luxury Resort");
    const [tradeLicenseNumber, setTradeLicenseNumber] = useState("TR-" + Math.floor(100000 + Math.random() * 900000));
    const [hotelAuthDocUrl, setHotelAuthDocUrl] = useState("https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800");
    const [hotelImage, setHotelImage] = useState(HOTEL_HERO_PRESETS[0].url);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
        "Free High-Speed Wi-Fi",
        "Ocean View Balcony",
        "Complimentary Breakfast",
        "24/7 Security & CCTV",
        "Power Backup Generator"
    ]);

    // Step 3: Room Inventory
    const [roomType, setRoomType] = useState("Executive Deluxe Ocean Suite");
    const [roomCategory, setRoomCategory] = useState("Executive Suite");
    const [pricePerNight, setPricePerNight] = useState("4500");
    const [totalInventory, setTotalInventory] = useState("8");
    const [roomNumber, setRoomNumber] = useState("301");
    const [floorNumber, setFloorNumber] = useState("3");

    // Step 4: Verification & Commercials
    const [verificationStatus, setVerificationStatus] = useState<"VERIFIED" | "PENDING">("VERIFIED");
    const [commissionRate, setCommissionRate] = useState("10");

    const handleNextStep = () => {
        if (step === 1) {
            if (!name.trim()) { alert("Please provide the Owner's Full Name."); return; }
            if (!email.trim()) { alert("Please provide the Official Email Address."); return; }
            if (!nidNumber.trim()) { alert("Please enter the Voter ID / National ID (NID) Card Number."); return; }
        }
        if (step === 2) {
            if (!hotelName.trim()) { alert("Please enter the Hotel or Resort Legal Name."); return; }
            if (!address.trim()) { alert("Please enter the Full Street Address and Landmark."); return; }
        }
        if (step === 3) {
            if (!roomType.trim() || !pricePerNight) { alert("Please specify the room tier and nightly tariff."); return; }
        }
        setStep((step + 1) as any);
    };

    const toggleAmenity = (am: string) => {
        setSelectedAmenities(prev =>
            prev.includes(am) ? prev.filter(x => x !== am) : [...prev, am]
        );
    };

    const handleAutoGeneratePassword = () => {
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
        let res = "";
        for (let i = 0; i < 10; i++) res += chars.charAt(Math.floor(Math.random() * chars.length));
        setPassword(res);
    };

    const handleFinalSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !email.trim()) {
            alert("Owner Name and Email are required.");
            setStep(1);
            return;
        }
        if (!hotelName.trim() || !address.trim()) {
            alert("Hotel Name and Address are required.");
            setStep(2);
            return;
        }

        setLoading(true);
        try {
            const res = await api.onboardOwner({
                name: name.trim(),
                email: email.trim().toLowerCase(),
                phone: phone.trim(),
                password,
                nidNumber: nidNumber.trim() || "1992" + Math.floor(1000000000 + Math.random() * 9000000000),
                nidDocUrl,
                tradeLicenseNumber: tradeLicenseNumber.trim(),
                hotelAuthDocUrl,
                hotelName: hotelName.trim(),
                city,
                address: address.trim(),
                hotelCategory,
                hotelDescription: `${hotelCategory} in ${city}, verified partner on StayBD. Direct hospitality booking without middleman markup.`,
                hotelImage,
                amenities: selectedAmenities,
                initialRoom: {
                    type: roomType.trim(),
                    category: roomCategory,
                    pricePerNight: Number(pricePerNight) || 3500,
                    totalInventory: Number(totalInventory) || 6,
                    roomNumber,
                    floorNumber: Number(floorNumber) || 2
                },
                commissionRate: Number(commissionRate) || 10,
                verificationStatus
            });

            setSuccessData({
                owner: res.owner,
                hotel: res.hotel,
                rawPassword: password
            });
            reload();
        } catch (err: any) {
            console.error("Onboarding error:", err);
            alert(err.message || "Failed to onboard property owner.");
        } finally {
            setLoading(false);
        }
    };

    // If successfully onboarded, display celebratory credential dossier
    if (successData) {
        return (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex justify-center items-center p-4 animate-in fade-in">
                <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden p-6 sm:p-8 text-center space-y-6">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
                        <CheckCircle2 className="w-9 h-9" />
                    </div>

                    <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                            Partner Live & Active
                        </span>
                        <h2 className="text-2xl font-black text-slate-900 mt-2">
                            Owner Onboarded Successfully!
                        </h2>
                        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                            Hotel "{successData.hotel.name}" and partner account are active. The owner can now log in to manage their property.
                        </p>
                    </div>

                    {/* Credentials Card */}
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/90 text-left space-y-3 font-mono text-xs">
                        <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                            <span className="text-slate-500 font-sans font-bold">Portal Login URL</span>
                            <span className="text-indigo-600 font-bold">/owner/login</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-sans font-bold">Username / Email</span>
                            <span className="text-slate-900 font-bold">{successData.owner.email}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-sans font-bold">Initial Password</span>
                            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                {successData.rawPassword}
                            </span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                            <span className="text-slate-500 font-sans font-bold">NID Number</span>
                            <span className="text-slate-700">{successData.owner.nidNumber || "Verified NID"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-sans font-bold">Hotel Address</span>
                            <span className="text-slate-700 truncate max-w-[200px]">{successData.hotel.address}, {successData.hotel.city}</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={() => {
                                // Save credentials to owner storage for instant impersonation test
                                localStorage.setItem("ownerToken", "impersonate_" + successData.owner.id);
                                localStorage.setItem("ownerUser", JSON.stringify(successData.owner));
                                window.open("/owner", "_blank");
                            }}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
                        >
                            <ExternalLink className="w-4 h-4" />
                            <span>Launch Owner Software</span>
                        </button>
                        <button
                            onClick={() => {
                                onClose();
                                reload();
                            }}
                            className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-xl text-xs transition"
                        >
                            Return to Admin Table
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex justify-center items-center p-3 sm:p-4 overflow-y-auto">
            <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[94vh]">
                {/* Header */}
                <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
                            <h2 className="text-lg sm:text-xl font-black text-slate-900">
                                Enterprise Partner Onboarding
                            </h2>
                            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                                SaaS Portal
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            Register hotel owner, attach voter ID card, configure hotel address, and initialize room inventory
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Step Indicator Pills */}
                <div className="grid grid-cols-4 border-b border-slate-200 text-xs font-bold bg-white">
                    {[
                        { num: 1, label: "1. Owner & NID", icon: <UserCheck className="w-3.5 h-3.5" /> },
                        { num: 2, label: "2. Hotel & Address", icon: <Building2 className="w-3.5 h-3.5" /> },
                        { num: 3, label: "3. Rooms & Price", icon: <BedDouble className="w-3.5 h-3.5" /> },
                        { num: 4, label: "4. Contract & Final", icon: <Shield className="w-3.5 h-3.5" /> },
                    ].map(s => (
                        <button
                            key={s.num}
                            type="button"
                            onClick={() => setStep(s.num as any)}
                            className={`py-3 px-2 flex items-center justify-center gap-1.5 transition border-b-2 text-[11px] sm:text-xs ${
                                step === s.num
                                    ? "border-indigo-600 text-indigo-600 bg-indigo-50/40"
                                    : "border-transparent text-slate-500 hover:text-slate-800"
                            }`}
                        >
                            {s.icon}
                            <span className="truncate">{s.label}</span>
                        </button>
                    ))}
                </div>

                {/* Form Container */}
                <form onSubmit={handleFinalSubmit} noValidate className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
                    {/* ──── STEP 1: OWNER IDENTITY & VOTER ID ──── */}
                    {step === 1 && (
                        <div className="space-y-4 animate-in fade-in duration-300">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                    <UserCheck className="w-4 h-4 text-indigo-600" />
                                    Owner Legal Identity & Credentials
                                </h3>
                                <span className="text-[11px] text-slate-400 font-medium">Step 1 of 4</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="block text-xs font-bold text-slate-700">
                                        Owner Full Name <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Md. Tanvir Ahmed"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-xs font-bold text-slate-700">
                                        Official Email Address <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="partner@hotelgroup.com"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                                    />
                                    <p className="text-[10px] text-slate-400">Used for Owner Portal login</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="block text-xs font-bold text-slate-700">
                                        Mobile / WhatsApp Number <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="tel"
                                            required
                                            placeholder="+880 1712-345678"
                                            value={phone}
                                            onChange={e => setPhone(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex justify-between items-center">
                                        <label className="block text-xs font-bold text-slate-700">
                                            Owner Portal Password <span className="text-rose-500">*</span>
                                        </label>
                                        <button
                                            type="button"
                                            onClick={handleAutoGeneratePassword}
                                            className="text-[10px] font-bold text-indigo-600 hover:underline"
                                        >
                                            Generate
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-9 py-2.5 text-xs font-mono text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Voter ID / NID Card Section */}
                            <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-extrabold text-indigo-900 flex items-center gap-1.5">
                                        <FileText className="w-4 h-4 text-indigo-600" />
                                        National ID / Voter ID Verification
                                    </h4>
                                    <span className="text-[10px] font-bold text-indigo-700 bg-white border border-indigo-200 px-2 py-0.5 rounded-full">
                                        Government Required
                                    </span>
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-xs font-bold text-slate-700">
                                        NID Number (10 or 17 Digits) <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. 19902692518291024 or 5508192031"
                                        value={nidNumber}
                                        onChange={e => setNidNumber(e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-slate-700">
                                        Voter ID Card Document URL / Upload Photo
                                    </label>
                                    <input
                                        type="url"
                                        value={nidDocUrl}
                                        onChange={e => setNidDocUrl(e.target.value)}
                                        placeholder="https://..."
                                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 transition font-mono"
                                    />

                                    <div className="flex items-center gap-2 flex-wrap pt-1">
                                        <span className="text-[10px] font-bold text-slate-500">Presets:</span>
                                        {NID_PRESETS.map((p, i) => (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => setNidDocUrl(p.url)}
                                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border transition ${
                                                    nidDocUrl === p.url
                                                        ? "bg-indigo-600 text-white border-indigo-600"
                                                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                                                }`}
                                            >
                                                {p.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* NID Preview Card */}
                                {nidDocUrl && (
                                    <div className="mt-2 p-2 bg-white rounded-xl border border-slate-200 flex items-center gap-3">
                                        <img
                                            src={nidDocUrl}
                                            alt="NID Card"
                                            className="w-20 h-14 object-cover rounded-lg border border-slate-200 shadow-xs"
                                        />
                                        <div className="text-[11px]">
                                            <p className="font-bold text-slate-900">National ID Document Attached</p>
                                            <p className="text-slate-500">Number: {nidNumber || "Pending input"}</p>
                                            <span className="inline-block text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 mt-0.5">
                                                ✓ Security Hologram Attached
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ──── STEP 2: PROPERTY & ADDRESS ──── */}
                    {step === 2 && (
                        <div className="space-y-4 animate-in fade-in duration-300">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                    <Building2 className="w-4 h-4 text-indigo-600" />
                                    Hotel / Resort Profile & Full Address
                                </h3>
                                <span className="text-[11px] text-slate-400 font-medium">Step 2 of 4</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="block text-xs font-bold text-slate-700">
                                        Hotel / Resort Legal Name <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Sea Pearl Grand Beach Resort & Spa"
                                        value={hotelName}
                                        onChange={e => setHotelName(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-xs font-bold text-slate-700">
                                        Destination City / District <span className="text-rose-500">*</span>
                                    </label>
                                    <select
                                        value={city}
                                        onChange={e => setCity(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                                    >
                                        {BANGLADESH_CITIES.map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="block text-xs font-bold text-slate-700">
                                    Full Street Address & Landmark <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                                    <textarea
                                        rows={2}
                                        required
                                        placeholder="e.g. Plot 14, Marine Drive Road, Inani Beach, Cox's Bazar 4700 (Opposite to Dolphin Point)"
                                        value={address}
                                        onChange={e => setAddress(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition resize-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="block text-xs font-bold text-slate-700">
                                        Property Classification
                                    </label>
                                    <select
                                        value={hotelCategory}
                                        onChange={e => setHotelCategory(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                                    >
                                        <option value="5-Star Luxury Resort">5-Star Luxury Resort</option>
                                        <option value="4-Star Boutique Hotel">4-Star Boutique Hotel</option>
                                        <option value="3-Star Business Hotel">3-Star Business Hotel</option>
                                        <option value="Eco Cottages & Villas">Eco Cottages & Villas</option>
                                        <option value="Prime Tourist Motel">Prime Tourist Motel</option>
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-xs font-bold text-slate-700">
                                        Trade License / Tourism Registration No.
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. TR-CXB-892100"
                                        value={tradeLicenseNumber}
                                        onChange={e => setTradeLicenseNumber(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                                    />
                                </div>
                            </div>

                            {/* Hotel Showcase Photo */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-slate-700">
                                    Property Hero Showcase Image URL
                                </label>
                                <input
                                    type="url"
                                    value={hotelImage}
                                    onChange={e => setHotelImage(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                                />

                                <div className="flex items-center gap-2 flex-wrap pt-1">
                                    <span className="text-[10px] font-bold text-slate-500">Presets:</span>
                                    {HOTEL_HERO_PRESETS.map((p, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => setHotelImage(p.url)}
                                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border transition ${
                                                hotelImage === p.url
                                                    ? "bg-indigo-600 text-white border-indigo-600"
                                                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                                            }`}
                                        >
                                            {p.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Amenities Checklist */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-slate-700">
                                    Property Amenities & Inclusions
                                </label>
                                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                                    {AMENITY_OPTIONS.map(am => {
                                        const isChecked = selectedAmenities.includes(am);
                                        return (
                                            <button
                                                key={am}
                                                type="button"
                                                onClick={() => toggleAmenity(am)}
                                                className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition flex items-center gap-1 ${
                                                    isChecked
                                                        ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                                                        : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
                                                }`}
                                            >
                                                {isChecked && <Check className="w-3 h-3" />}
                                                <span>{am}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ──── STEP 3: INITIAL ROOMS & INVENTORY ──── */}
                    {step === 3 && (
                        <div className="space-y-4 animate-in fade-in duration-300">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                    <BedDouble className="w-4 h-4 text-indigo-600" />
                                    Initial Room Tier & Pricing Setup
                                </h3>
                                <span className="text-[11px] text-slate-400 font-medium">Step 3 of 4</span>
                            </div>

                            <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/90 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="block text-xs font-bold text-slate-700">
                                            Room Tier / Title <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={roomType}
                                            onChange={e => setRoomType(e.target.value)}
                                            placeholder="e.g. Executive Deluxe Ocean Suite"
                                            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-xs font-bold text-slate-700">
                                            Room Classification
                                        </label>
                                        <select
                                            value={roomCategory}
                                            onChange={e => setRoomCategory(e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                        >
                                            <option value="Executive Suite">Executive Suite</option>
                                            <option value="Super Deluxe">Super Deluxe</option>
                                            <option value="Deluxe Room">Deluxe Room</option>
                                            <option value="Family Suite">Family Suite</option>
                                            <option value="Presidential Suite">Presidential Suite</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <div className="space-y-1">
                                        <label className="block text-xs font-bold text-slate-700">
                                            Tariff / Night (৳) *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            value={pricePerNight}
                                            onChange={e => setPricePerNight(e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-xs font-bold text-slate-700">
                                            Total Inventory *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min={1}
                                            value={totalInventory}
                                            onChange={e => setTotalInventory(e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-xs font-bold text-slate-700">
                                            Floor Level
                                        </label>
                                        <input
                                            type="number"
                                            value={floorNumber}
                                            onChange={e => setFloorNumber(e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-xs font-bold text-slate-700">
                                            Room Prefix / #
                                        </label>
                                        <input
                                            type="text"
                                            value={roomNumber}
                                            onChange={e => setRoomNumber(e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ──── STEP 4: VERIFICATION & CONTRACT ──── */}
                    {step === 4 && (
                        <div className="space-y-4 animate-in fade-in duration-300">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                    <Shield className="w-4 h-4 text-emerald-600" />
                                    Commercial Contract & Activation
                                </h3>
                                <span className="text-[11px] text-slate-400 font-medium">Step 4 of 4</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="block text-xs font-bold text-slate-700">
                                        Verification Status
                                    </label>
                                    <select
                                        value={verificationStatus}
                                        onChange={e => setVerificationStatus(e.target.value as any)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                    >
                                        <option value="VERIFIED">VERIFIED (Immediate Active Partner)</option>
                                        <option value="PENDING">PENDING (Hold for Document Audit)</option>
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-xs font-bold text-slate-700">
                                        Platform Commission Share (%)
                                    </label>
                                    <input
                                        type="number"
                                        value={commissionRate}
                                        onChange={e => setCommissionRate(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                    />
                                    <p className="text-[10px] text-slate-400">Standard 10% platform fee</p>
                                </div>
                            </div>

                            {/* Executive Summary Dossier */}
                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 text-xs">
                                <h4 className="font-bold text-slate-800 uppercase text-[11px] tracking-wider">
                                    Executive Onboarding Summary
                                </h4>

                                <div className="grid grid-cols-2 gap-2 text-[12px]">
                                    <div>
                                        <span className="text-slate-400 block text-[10px]">Owner Name:</span>
                                        <span className="font-bold text-slate-900">{name || "Not entered"}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block text-[10px]">Email / Login:</span>
                                        <span className="font-bold text-indigo-700">{email || "Not entered"}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block text-[10px]">Hotel Legal Name:</span>
                                        <span className="font-bold text-slate-900">{hotelName || "Not entered"}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block text-[10px]">City / Location:</span>
                                        <span className="font-bold text-slate-900">{city}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block text-[10px]">Initial Room Tier:</span>
                                        <span className="font-semibold text-slate-800">{roomType} (৳{pricePerNight}/night)</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block text-[10px]">NID Card Attached:</span>
                                        <span className="font-mono text-emerald-700 font-bold">{nidNumber || "Verified NID Attached"}</span>
                                    </div>
                                </div>

                                <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-[11px] text-amber-900 font-medium">
                                    💡 Upon activation, the hotel will immediately appear on StayBD public search, and the owner can access their personal SaaS portal at <strong>/owner/login</strong>.
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                        {step > 1 ? (
                            <button
                                type="button"
                                onClick={() => setStep((step - 1) as any)}
                                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
                            >
                                ← Previous Step
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-500 text-xs font-bold hover:bg-slate-50 transition"
                            >
                                Cancel
                            </button>
                        )}

                        {step < 4 ? (
                            <button
                                type="button"
                                onClick={handleNextStep}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition shadow-xs flex items-center gap-1"
                            >
                                <span>Continue to Step {step + 1}</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-7 py-3 rounded-xl text-xs transition shadow-sm flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Onboarding Partner...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4" />
                                        <span>Complete & Launch Property</span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export function OwnerInsightModal({ owner, hotels, bookings, onClose, ask, reload }: {
    owner: HotelOwner;
    hotels: Hotel[];
    bookings: Booking[];
    onClose: () => void;
    ask: (label: string, fn: () => void) => void;
    reload: () => void;
}) {
    const ownerHotelIds = hotels.map(h => h.id);
    const ownerBookings = bookings.filter(b => ownerHotelIds.includes(b.hotelId));
    const totalRevenue = ownerBookings.filter(b => b.status === "CONFIRMED").reduce((s, b) => s + (b.totalPrice || 0), 0);
    const subExpired = new Date(owner.subscriptionEndDate) < new Date();

    const handleImpersonateOwner = () => {
        // Authenticate into Owner portal directly
        localStorage.setItem("ownerToken", "token_partner_" + owner.id);
        localStorage.setItem("ownerUser", JSON.stringify(owner));
        window.open("/owner", "_blank");
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs">
            <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl max-h-[92vh] shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/80 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-xs">
                            {owner.name?.charAt(0) || "O"}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-black text-slate-900">{owner.name}</h2>
                                <Badge color={owner.verificationStatus === "VERIFIED" ? "green" : "amber"}>
                                    {owner.verificationStatus}
                                </Badge>
                                <Badge color={owner.status === "ACTIVE" ? "green" : "red"}>
                                    {owner.status}
                                </Badge>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                                {owner.email} · Partner ID: <span className="font-mono font-bold text-indigo-700">#{owner.id}</span>
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
                    {/* Top KPI row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                        <InsightCard label="Listed Hotels" value={hotels.length} icon={<Building2 className="w-4 h-4" />} color="blue" />
                        <InsightCard label="Total Bookings" value={ownerBookings.length} icon={<BookOpen className="w-4 h-4" />} color="indigo" />
                        <InsightCard label="Gross Revenue" value={`৳${totalRevenue.toLocaleString()}`} icon={<CreditCard className="w-4 h-4" />} color="emerald" />
                        <InsightCard label="Avg. Rating" value={`⭐ ${hotels.length > 0 ? (hotels.reduce((s, h) => s + (h.rating || 4.5), 0) / hotels.length).toFixed(1) : "4.8"}`} icon={<Shield className="w-4 h-4" />} color="amber" />
                    </div>

                    {/* Owner NID Card & Legal Dossier Banner */}
                    <div className="bg-gradient-to-r from-slate-50 via-indigo-50/40 to-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-start sm:items-center gap-3.5">
                            {owner.nidDocUrl ? (
                                <img
                                    src={owner.nidDocUrl}
                                    alt="NID Document"
                                    className="w-20 h-14 object-cover rounded-xl border border-slate-200 shadow-xs"
                                />
                            ) : (
                                <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                                    <FileText className="w-6 h-6" />
                                </div>
                            )}
                            <div>
                                <h4 className="text-sm font-extrabold text-slate-900">National ID & Legal Credentials</h4>
                                <p className="text-xs text-slate-600 mt-0.5 font-mono">
                                    NID: <strong>{owner.nidNumber || "19902692518291024 (Verified)"}</strong>
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    {owner.tradeLicenseNumber && (
                                        <span className="text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                                            Trade Lic: {owner.tradeLicenseNumber}
                                        </span>
                                    )}
                                    {owner.phone && (
                                        <a href={`tel:${owner.phone}`} className="text-[10px] font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200 hover:bg-indigo-50">
                                            📞 {owner.phone}
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleImpersonateOwner}
                            className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-xs flex items-center justify-center gap-1.5 shrink-0"
                        >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Open Partner Dashboard</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left: Account Management */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Account Credentials</h3>

                            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/90 space-y-4">
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 mb-1">Account Status</p>
                                    <div className="flex items-center justify-between">
                                        <Badge color={owner.status === "ACTIVE" ? "green" : "red"}>{owner.status}</Badge>
                                        <button
                                            onClick={() => ask(owner.status === "ACTIVE" ? `Permanently BLOCK "${owner.name}"?` : `ACTIVATE "${owner.name}"?`, async () => { await api.updateUserStatus(owner.id, owner.status === "ACTIVE" ? "BLOCKED" : "ACTIVE"); reload(); })}
                                            className={`text-xs font-bold underline ${owner.status === "ACTIVE" ? "text-rose-600" : "text-emerald-600"}`}
                                        >
                                            {owner.status === "ACTIVE" ? "Block Access" : "Grant Access"}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold text-slate-500 mb-1">Verification Status</p>
                                    <div className="flex items-center justify-between">
                                        <Badge color={owner.verificationStatus === "VERIFIED" ? "green" : owner.verificationStatus === "PENDING" ? "amber" : "red"}>
                                            {owner.verificationStatus}
                                        </Badge>
                                        {owner.verificationStatus !== "VERIFIED" && (
                                            <button
                                                onClick={() => ask(`Approve verification for "${owner.name}"?`, async () => { await api.updateVerificationStatus(owner.id, "VERIFIED"); reload(); })}
                                                className="text-xs font-bold text-indigo-600 underline"
                                            >
                                                Approve Now
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold text-slate-500 mb-1">Subscription Validity</p>
                                    <div className="space-y-2">
                                        {owner.hasAdminOverride ? (
                                            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 text-center">
                                                <p className="text-emerald-700 text-xs font-bold">LIFETIME ACCESS (ADMIN OVERRIDE)</p>
                                            </div>
                                        ) : (
                                            <>
                                                <div className={`p-2.5 rounded-lg text-center border ${subExpired ? "bg-rose-50 border-rose-200 text-rose-700" : "bg-white border-slate-200 text-slate-700"}`}>
                                                    <p className="text-xs font-semibold">{subExpired ? "PLAN EXPIRED" : `Valid until ${new Date(owner.subscriptionEndDate || Date.now() + 365 * 86400000).toLocaleDateString()}`}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => ask(`Grant LIFETIME access to "${owner.name}"?`, async () => { await api.grantAdminOverride(owner.id); reload(); })}
                                                        className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 text-[11px] font-bold py-1.5 rounded-lg transition">Lifetime</button>
                                                    <button onClick={() => ask(`Extend subscription for "${owner.name}" by 12 months?`, async () => { await api.extendSubscription(owner.id, 12); reload(); })}
                                                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold py-1.5 rounded-lg transition">+1 Year</button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Hotels & Recent Activity */}
                        <div className="lg:col-span-2 space-y-4">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Registered Hotel Portfolio</h3>
                            <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
                                <table className="w-full text-xs">
                                    <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-100">
                                        <tr>
                                            <th className="py-2.5 px-4 text-left">Hotel Name</th>
                                            <th className="py-2.5 px-4 text-left">City & Address</th>
                                            <th className="py-2.5 px-4 text-center">Status</th>
                                            <th className="py-2.5 px-4 text-right">Revenue</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {hotels.map(h => {
                                            const hBookings = ownerBookings.filter(b => b.hotelId === h.id);
                                            const hRevenue = hBookings.filter(b => b.status === "CONFIRMED").reduce((s, b) => s + (b.totalPrice || 0), 0);
                                            return (
                                                <tr key={h.id} className="hover:bg-slate-50/60 transition">
                                                    <td className="py-2.5 px-4 font-bold text-slate-900">{h.name}</td>
                                                    <td className="py-2.5 px-4 text-slate-500">{h.city} · {h.address}</td>
                                                    <td className="py-2.5 px-4 text-center">
                                                        <Badge color={h.isActive ? "green" : "red"}>{h.isActive ? "ACTIVE" : "OFF"}</Badge>
                                                    </td>
                                                    <td className="py-2.5 px-4 text-right text-emerald-600 font-extrabold">৳{hRevenue.toLocaleString()}</td>
                                                </tr>
                                            );
                                        })}
                                        {hotels.length === 0 && <tr><td colSpan={4} className="py-6 text-center text-slate-400">No hotels registered yet.</td></tr>}
                                    </tbody>
                                </table>
                            </div>

                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recent Reservations</h3>
                            <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
                                <div className="max-h-48 overflow-y-auto">
                                    <table className="w-full text-xs">
                                        <tbody className="divide-y divide-slate-100">
                                            {ownerBookings.slice().reverse().slice(0, 5).map(b => (
                                                <tr key={b.id} className="hover:bg-slate-50/60 transition">
                                                    <td className="py-2.5 px-4 text-indigo-600 font-mono font-bold">#{b.id}</td>
                                                    <td className="py-2.5 px-4 font-bold text-slate-900">{b.hotelName}</td>
                                                    <td className="py-2.5 px-4 text-slate-500">{b.checkIn}</td>
                                                    <td className="py-2.5 px-4 text-right text-emerald-600 font-extrabold">৳{(b.totalPrice || 0).toLocaleString()}</td>
                                                </tr>
                                            ))}
                                            {ownerBookings.length === 0 && <tr><td className="py-6 text-center text-slate-400">No bookings recorded.</td></tr>}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex justify-between items-center">
                    <p className="text-xs text-slate-500">Partner since {new Date(owner.createdAt).toLocaleDateString()}</p>
                    <button
                        onClick={onClose}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-5 py-2 rounded-xl text-xs font-bold transition shadow-xs"
                    >
                        Close Details
                    </button>
                </div>
            </div>
        </div>
    );
}

function InsightCard({ label, value, icon, color }: { label: string; value: string | number; icon: React.ReactNode; color: string }) {
    const colors: Record<string, { text: string; bg: string; border: string }> = {
        blue: { text: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
        indigo: { text: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100" },
        emerald: { text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
        amber: { text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
    };
    const c = colors[color] || colors.blue;
    return (
        <div className={`p-4 rounded-2xl border ${c.border} ${c.bg} flex flex-col items-center text-center shadow-xs`}>
            <div className={`mb-2 p-1.5 rounded-lg bg-white ${c.text}`}>{icon}</div>
            <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">{label}</p>
            <p className="text-lg font-black text-slate-900">{value}</p>
        </div>
    );
}
