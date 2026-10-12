/**
 * NationalProposal.tsx — National Digital Hospitality & Tourism Infrastructure (DPI)
 * Strategic Proposal & Institutional Platform for Govt of Bangladesh, Civil Aviation & Tourism Ministry,
 * Bangladesh Parjatan Corporation (BPC), and Hoteliers Nationwide.
 * 
 * Theme:
 *  - Prestigious, Authoritative White/Light Government Theme matching StayBD's Brand Standards
 *  - Seamless visual continuity with white Header and white Footer
 *  - Interactive National Economic Savings & ROI Calculator
 *  - Interactive 4-Tier Anti-Fraud Architecture Simulator with Cybersecurity Audit Terminal
 *  - Dynamic 5-Ecological Zone Explorer with Spot-to-Stay Discovery
 *  - Interactive 4-Phase Nationwide Execution Roadmap
 *  - Formal MoU Consultation Modal & Instant Whitepaper Print/PDF Engine
 *  - 21-Slide Executive Pitch Deck Mode with Keyboard Navigation
 *  - 100% Bilingual Support (English & Bangla)
 */

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, ShieldCheck, ArrowLeft, CheckCircle2, 
  Layers, Lock, Users, Landmark, ChevronRight, ChevronLeft, 
  Download, Monitor, ArrowRight, MapPin, SlidersHorizontal, 
  Star, CreditCard, Waves, Trees, Mountain, Coffee, Globe,
  Shield, Check, Printer, Scale, DollarSign,
  BarChart3, X, Compass, Briefcase, Zap, AlertTriangle,
  FileCheck2, Calculator, HelpCircle, PhoneCall, Send,
  Cpu, Activity, CheckSquare, Sparkles, TrendingUp
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";

// ─────────────────────────────────────────────────────────────────────────────
// 1. SLIDE DECK METADATA (21 Slides Executive Deck)
// ─────────────────────────────────────────────────────────────────────────────
interface SlideInfo {
  number: number;
  title: string;
  titleBn: string;
  category: string;
  tag: string;
}

const SLIDE_METADATA: SlideInfo[] = [
  { number: 1, title: "Cover & Title Proposal", titleBn: "প্রকল্পের শিরোনাম ও প্রস্তাবনা", category: "identity", tag: "Identity" },
  { number: 2, title: "Executive Summary", titleBn: "১. প্রকল্পের সারসংক্ষেপ", category: "summary", tag: "Summary" },
  { number: 3, title: "Current Problems & Citizen Friction", titleBn: "২. বর্তমান সমস্যাটি কোথায়?", category: "problem", tag: "Problem" },
  { number: 4, title: "Real-Life User Personas", titleBn: "৩. বাস্তব ব্যবহারকারীর উদাহরণ", category: "persona", tag: "Simulation" },
  { number: 5, title: "Core Platform Features", titleBn: "৪. প্ল্যাটফর্মের মূল সুবিধা", category: "features", tag: "Features" },
  { number: 6, title: "Hotel Owner/Manager Dashboard", titleBn: "৫. হোটেল মালিক/ম্যানেজারের ড্যাশবোর্ড", category: "dashboard", tag: "Owner" },
  { number: 7, title: "Importance for Government", titleBn: "৬. সরকারের জন্য কেন গুরুত্বপূর্ণ?", category: "government", tag: "Government" },
  { number: 8, title: "Verification & Trust Framework", titleBn: "৭. ভেরিফিকেশন ও ট্রাস্ট ফ্রেমওয়ার্ক", category: "trust", tag: "Security" },
  { number: 9, title: "Booking Workflow (7 Steps)", titleBn: "৮. বুকিং ওয়ার্কফ্লো (৭ ধাপ)", category: "workflow", tag: "Process" },
  { number: 10, title: "Proposed Digital Architecture", titleBn: "৯. প্রস্তাবিত ডিজিটাল আর্কিটেকচার", category: "architecture", tag: "Tech" },
  { number: 11, title: "Data Privacy & Security-by-Design", titleBn: "১০. ডেটা প্রাইভেসি ও নিরাপত্তা", category: "security", tag: "Compliance" },
  { number: 12, title: "Business & Sustainability Model", titleBn: "১১. ব্যবসায়িক ও টেকসই মডেল", category: "business", tag: "Finance" },
  { number: 13, title: "4-Phase Rollout Plan", titleBn: "১২. বাস্তবায়ন পরিকল্পনা (৪ ধাপ)", category: "roadmap", tag: "Roadmap" },
  { number: 14, title: "Expected National Impact", titleBn: "১৩. প্রত্যাশিত জাতীয় প্রভাব", category: "impact", tag: "Impact" },
  { number: 15, title: "Proposed Government Collaboration", titleBn: "১৪. সরকারের নিকট প্রস্তাবিত সহযোগিতা", category: "partnership", tag: "Proposal" },
  { number: 16, title: "Project Recap & Acknowledgement", titleBn: "ধন্যবাদ ও প্রকল্প রিক্যাপ", category: "summary", tag: "Closing" },
  { number: 17, title: "Financial Framework & Government Role", titleBn: "১১. আর্থিক কাঠামো ও সরকারের ভূমিকা", category: "business", tag: "Sustainability" },
  { number: 18, title: "Proposed Project Identity (StayBD)", titleBn: "প্রস্তাবিত Project Identity", category: "identity", tag: "Branding" },
  { number: 19, title: "Explore Bangladesh — Tourism Map", titleBn: "১৩. Explore Bangladesh — Tourism Map", category: "tourism", tag: "Tourism" },
  { number: 20, title: "Tourist Spot → Nearby Hotels → Booking", titleBn: "১৪. Tourist Spot → Nearby Hotels → Booking", category: "tourism", tag: "Flow" },
  { number: 21, title: "StayBD = Hotel Booking + Tourism Discovery", titleBn: "StayBD = Hotel Booking + Tourism Discovery", category: "summary", tag: "Vision" },
];

const NationalProposal: React.FC = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isBn = i18n.language?.startsWith("bn");

  // State Management
  const [activeTab, setActiveTab] = useState<"citizens" | "hotels" | "government" | "economy">("citizens");
  const [activeZone, setActiveZone] = useState<number>(0);
  const [activeTier, setActiveTier] = useState<number>(0);
  const [showPitchModal, setShowPitchModal] = useState<boolean>(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [showPartnershipModal, setShowPartnershipModal] = useState<boolean>(false);
  const [partnerFormSubmitted, setPartnerFormSubmitted] = useState<boolean>(false);

  // Dynamic Savings Calculator State
  const [calcRooms, setCalcRooms] = useState<number>(50);
  const [calcTariff, setCalcTariff] = useState<number>(2500);
  const [calcOccupancy, setCalcOccupancy] = useState<number>(65);

  const toggleLanguage = () => {
    i18n.changeLanguage(isBn ? "en" : "bn");
  };

  // Keyboard navigation for Slide Deck
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showPitchModal) return;
      if (e.key === "ArrowRight" || e.key === "Space") {
        setCurrentSlideIndex(prev => Math.min(prev + 1, SLIDE_METADATA.length - 1));
      } else if (e.key === "ArrowLeft") {
        setCurrentSlideIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === "Escape") {
        setShowPitchModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showPitchModal]);

  // Calculations for National Savings
  const monthlyGrossRevenue = useMemo(() => {
    return Math.round(calcRooms * calcTariff * 30 * (calcOccupancy / 100));
  }, [calcRooms, calcTariff, calcOccupancy]);

  const foreignOtaDrain = useMemo(() => {
    return Math.round(monthlyGrossRevenue * 0.22);
  }, [monthlyGrossRevenue]);

  const staybdOperatingFee = useMemo(() => {
    return Math.round(monthlyGrossRevenue * 0.015);
  }, [monthlyGrossRevenue]);

  const localEconomyRetained = useMemo(() => {
    return foreignOtaDrain - staybdOperatingFee;
  }, [foreignOtaDrain, staybdOperatingFee]);

  // 5 Ecological Tourism Zones
  const TOURISM_ZONES = [
    {
      nameEn: "Sea & Beach",
      nameBn: "সমুদ্র ও সৈকত অঞ্চল",
      tagEn: "120km Coastline",
      tagBn: "১২০ কিমি অবিচ্ছিন্ন সৈকত",
      icon: Waves,
      color: "from-cyan-500 to-blue-600",
      accent: "text-cyan-700",
      border: "border-cyan-200",
      bg: "bg-cyan-50",
      spotsEn: "Cox's Bazar, Saint Martin's Coral Island, Kuakata Sunrise/Sunset, Patenga Beach",
      spotsBn: "কক্সবাজার সমুদ্র সৈকত, সেন্ট মার্টিন প্রবাল দ্বীপ, কুয়াকাটা ও পতেঙ্গা",
      hotelsCount: "380+ Verified Hotels",
      hotelsCountBn: "৩৮০+ যাচাইকৃত হোটেল",
      descEn: "Connecting travelers to beachfront resorts and budget guest houses with guaranteed genuine sea-view listings and zero broker price extortion.",
      descBn: "সরাসরি সমুদ্রের ভিউ নিশ্চিত করে বিচ রিসোর্ট ও বাজেট কটেজে মধ্যস্বত্বভোগী ছাড়া নিরাপদ বুকিং।",
      destinationQuery: "Cox's Bazar",
      imgUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
      avgTemp: "28°C",
      season: "Oct – Apr"
    },
    {
      nameEn: "Hills & Highlands",
      nameBn: "পাহাড় ও উপত্যকা",
      tagEn: "Adventure & Cloudscapes",
      tagBn: "মেঘের রাজ্য ও অ্যাডভেঞ্চার",
      icon: Mountain,
      color: "from-emerald-500 to-teal-600",
      accent: "text-emerald-700",
      border: "border-emerald-200",
      bg: "bg-emerald-50",
      spotsEn: "Sajek Valley (Kingdom of Clouds), Bandarban & Nilgiri Peak, Rangamati Kaptai Lake, Khagrachhari",
      spotsBn: "সাজেক ভ্যালি, বান্দরবান ও নীলগিরি চূড়া, রাঙ্গামাটি কাপ্তাই লেক ও খাগড়াছড়ি",
      hotelsCount: "210+ Verified Resorts",
      hotelsCountBn: "২১০+ যাচাইকৃত রিসোর্ট",
      descEn: "Verified mountain cottages, bamboo eco-villas, and cloud-facing retreats with satellite geofenced coordinates preventing deceptive bookings.",
      descBn: "স্যাটেলাইট মানচিত্রে নিখুঁত অবস্থানের নিশ্চয়তাসহ মেঘের কোলে অবস্থিত ইকো-রিসোর্ট ও কাঠের কটেজ।",
      destinationQuery: "Sajek",
      imgUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80",
      avgTemp: "22°C",
      season: "All Year"
    },
    {
      nameEn: "Forests & Mangroves",
      nameBn: "বন, ম্যানগ্রোভ ও প্রকৃতি",
      tagEn: "UNESCO World Heritage",
      tagBn: "ইউনেস্কো বিশ্ব ঐতিহ্য",
      icon: Trees,
      color: "from-amber-500 to-emerald-600",
      accent: "text-amber-700",
      border: "border-amber-200",
      bg: "bg-amber-50",
      spotsEn: "Sundarbans (World's Largest Mangrove), Ratargul Swamp Forest, Lawachara Rainforest, Madhabkunda",
      spotsBn: "সুন্দরবন ম্যানগ্রোভ, রাতারগুল সোয়াম্প ফরেস্ট, লাউয়াছড়া রেইনফরেস্ট ও মাধবকুণ্ড",
      hotelsCount: "140+ Eco Lodges",
      hotelsCountBn: "১৪০+ ইকো লজ",
      descEn: "Sustainable eco-resorts, river cruise houseboats, and jungle lodges strictly compliant with Forest & Environmental safety directives.",
      descBn: "পরিবেশবান্ধব নৌ-ভ্রমণ হাউসবোট এবং বন সংরক্ষণের বিধি মেনে পরিচালিত অথেনটিক জঙ্গল লজ।",
      destinationQuery: "Sundarbans",
      imgUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80",
      avgTemp: "25°C",
      season: "Nov – Mar"
    },
    {
      nameEn: "Tea & Freshwater Haor",
      nameBn: "চা বাগান ও হাওর অঞ্চল",
      tagEn: "Wetlands & Houseboats",
      tagBn: "রামসার সাইট ও চা-কন্যা",
      icon: Coffee,
      color: "from-lime-500 to-emerald-600",
      accent: "text-lime-700",
      border: "border-lime-200",
      bg: "bg-lime-50",
      spotsEn: "Sreemangal Tea Country, Tanguar Haor (Ramsar Site), Sylhet Malnicherra, Sunamganj",
      spotsBn: "শ্রীমঙ্গল চা বাগান, টাঙ্গুয়ার হাওর হাউসবোট, সিলেট মালনীছড়া ও সুনামগঞ্জ",
      hotelsCount: "175+ Verified Stays",
      hotelsCountBn: "১৭৫+ যাচাইকৃত স্টে",
      descEn: "Tea estate bungalows, floating houseboat accommodations, and heritage lake view sanctuaries with audited sanitation standards.",
      descBn: "চা বাগানের ব্রিটিশ হেরিটেজ বাংলো এবং টাঙ্গুয়ার হাওরে প্রিমিয়াম হাউসবোটের রিয়েল-টাইম বুকিং।",
      destinationQuery: "Sylhet",
      imgUrl: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80",
      avgTemp: "24°C",
      season: "Jul – Mar"
    },
    {
      nameEn: "Heritage & History",
      nameBn: "প্রত্নতত্ত্ব ও ঐতিহাসিক নিদর্শন",
      tagEn: "Ancient Civilizations",
      tagBn: "প্রাচীন সভ্যতা ও প্রত্নতত্ত্ব",
      icon: Landmark,
      color: "from-purple-500 to-indigo-600",
      accent: "text-purple-700",
      border: "border-purple-200",
      bg: "bg-purple-50",
      spotsEn: "Paharpur Somapura Mahavihara, Bagerhat Sixty Dome Mosque, Mahasthangarh, Mainamati",
      spotsBn: "পাহাড়পুর সোমপুর মহাবিহার, বাগেরহাট ষাট গম্বুজ মসজিদ, মহাস্থানগড় ও ময়নামতি",
      hotelsCount: "120+ Verified Stays",
      hotelsCountBn: "১২০+ যাচাইকৃত আবাসন",
      descEn: "Cultural heritage trails with verified regional hotels enabling researchers, families, and global visitors with vetted local guide linkages.",
      descBn: "ঐতিহাসিক স্থান পরিদর্শনে আসা পরিবার ও আন্তর্জাতিক গবেষকদের জন্য পরিচ্ছন্ন ও নিরাপদ আবাসন।",
      destinationQuery: "Rajshahi",
      imgUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80",
      avgTemp: "26°C",
      season: "Oct – Mar"
    }
  ];

  // 4 Tiers of Trust Engine with Live Interactive Console
  const TRUST_TIERS = [
    {
      number: "01",
      titleEn: "Legal License & Identity Verification",
      titleBn: "আইনি ট্রেড লাইসেন্স ও মালিকের পরিচয়পত্র যাচাই",
      descEn: "Zero ghost profiles. Every property must pass manual & automated validation for Municipal Trade License, Owner NID, and Fire/Tourism Department registration before appearing on the public search index.",
      descBn: "কোনো ভুয়া হোটেলের অস্তিত্ব নেই। প্ল্যাটফর্মে যুক্ত হতে প্রতিটি হোটেলের পৌরসভা ট্রেড লাইসেন্স, মালিকের জাতীয় পরিচয়পত্র (NID) এবং প্রয়োজনীয় অনুমোদন যাচাই বাধ্যতামূলক।",
      badgeEn: "Government Legal Vetting",
      badgeBn: "আইনি নথি যাচাই",
      statEn: "100% Host Background Check",
      statBn: "১০০% ভেরিফায়েড স্বত্বাধিকারী",
      icon: ShieldCheck,
      simData: {
        item1En: "Municipal Trade License: VERIFIED",
        item1Bn: "পৌরসভা ট্রেড লাইসেন্স: অনুমোদিত",
        item2En: "Owner Smart NID: KYC Cleared",
        item2Bn: "মালিকের স্মার্ট এনআইডি: সফল",
        item3En: "Civil Aviation & BPC Compliance: PASS",
        item3Bn: "বিপিসি ও মন্ত্রণালয় মানদণ্ড: উত্তীর্ণ"
      }
    },
    {
      number: "02",
      titleEn: "Satellite GPS Geofence Auditing",
      titleBn: "স্যাটেলাইট জিপিএস ও ভৌগোলিক পিনপয়েন্ট যাচাই",
      descEn: "Precise latitude and longitude coordinates are audited against high-resolution satellite imagery to verify physical existence and calculate exact road distances to key tourist attractions.",
      descBn: "স্যাটেলাইট মানচিত্রের মাধ্যমে হোটেলের বাস্তব ভৌগোলিক অবস্থান ও পর্যটন স্পটের সঠিক দূরত্ব যাচাই করা হয়, যেন পর্যটককে মিথ্যা দূরত্ব দিয়ে বিভ্রান্ত না করা যায়।",
      badgeEn: "Geotagged Real Location",
      badgeBn: "জিওট্যাগড বাস্তব অবস্থান",
      statEn: "Zero Misleading Distances",
      statBn: "নিখুঁত দূরত্বের নিশ্চয়তা",
      icon: MapPin,
      simData: {
        item1En: "Coordinates: 21.4272° N, 92.0058° E",
        item1Bn: "জিপিএস কোঅর্ডিনেট: ২১.৪২৭২° উ, ৯২.০০৫৮° পূ",
        item2En: "Distance to Beach: Exact 150m (Verified)",
        item2Bn: "সৈকত থেকে দূরত্ব: ঠিক ১৫০ মিটার (যাচাইকৃত)",
        item3En: "Satellite Land Boundary: Audit Matched",
        item3Bn: "স্যাটেলাইট সীমানা: সম্পূর্ণ সঠিক"
      }
    },
    {
      number: "03",
      titleEn: "Anti-Theft Real-Time Room Ledger",
      titleBn: "চুরি রোধক লাইভ ইনভেন্টরি ও অডিট লেজার",
      descEn: "Both walk-in offline bookings and digital reservations are synchronized in a single tamper-evident digital ledger. Prevents front-desk revenue manipulation and double bookings.",
      descBn: "অফলাইন ও অনলাইন সব বুকিং একটি কেন্দ্রীয় ডিজিটাল লেজারে রিয়েল-টাইমে লিপিবদ্ধ থাকে। এর ফলে হোটেল ম্যানেজারের রাজস্ব চুরি এবং ডাবল বুকিং পুরোপুরি বন্ধ হয়।",
      badgeEn: "Cryptographic Inventory Ledger",
      badgeBn: "স্বয়ংক্রিয় ডিজিটাল অডিট",
      statEn: "Zero Inventory Manipulation",
      statBn: "রাজস্ব ফাঁকি ও জালিয়াতি রোধ",
      icon: Layers,
      simData: {
        item1En: "Ledger Block: #bd-0982-ledger",
        item1Bn: "ডিজিটাল লেজার ব্লক: #bd-0982",
        item2En: "Double-Booking Risk: 0.00% Prevented",
        item2Bn: "ডাবল বুকিং ঝুঁকি: ০.০০% রোধ",
        item3En: "Front-Desk Theft: Eradicated by Sync",
        item3Bn: "ক্যাশ চুরি রোধ: স্বয়ংক্রিয় সিঙ্ক"
      }
    },
    {
      number: "04",
      titleEn: "Checkout-Linked Authentic Reviews",
      titleBn: "সম্পন্ন অবস্থান-ভিত্তিক নিরপেক্ষ রিভিউ ব্যবস্থা",
      descEn: "Only verified guests who have completed their physical check-in and checkout via digital QR scan are permitted to submit ratings and feedback. Eliminates paid marketing spam and smear campaigns.",
      descBn: "কিউআর কোড স্ক্যান করে অবস্থান সম্পন্ন করা প্রকৃত অতিথি ছাড়া অন্য কারও রিভিউ দেওয়ার সুযোগ নেই। পেইড রিভিউ এবং উদ্দেশ্যমূলক অপপ্রচার সম্পূর্ণ অসম্ভব।",
      badgeEn: "100% Authentic Traveler Feedback",
      badgeBn: "১০০% প্রকৃত অতিথির মতামত",
      statEn: "No Paid Propaganda",
      statBn: "ফেক রিভিউ সম্পূর্ণরূপে নিষিদ্ধ",
      icon: Star,
      simData: {
        item1En: "Review Authorization: QR Checkout Scan",
        item1Bn: "অনুমোদন: কিউআর চেকআউট স্ক্যান",
        item2En: "Fake Competitor Reviews Blocked: 100%",
        item2Bn: "প্রতিযোগীদের ভুয়া রিভিউ: ১০০% ব্লকড",
        item3En: "Audited Guest Satisfaction Score: 4.96 ★",
        item3Bn: "যাচাইকৃত সন্তুষ্টি স্কোর: ৪.৯৬ ★"
      }
    }
  ];

  // 4 Rollout Phases
  const ROLLOUT_PHASES = [
    {
      phase: isBn ? "১ম পর্যায়" : "Phase 01",
      title: isBn ? "পাইলট প্রজেক্ট (ঢাকা ও মডেল হোটেল)" : "Dhaka Pilot & Selected Models",
      timeline: isBn ? "১ম — ৩য় মাস" : "Months 1 — 3",
      status: isBn ? "প্রস্তুত ও সক্রিয়" : "Ready / Active Pilot",
      statusColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
      items: isBn ? [
        "ঢাকা মেট্রোপলিটন ও বিমানবন্দর সংলগ্ন ১০০টি মডেল হোটেল অনবোর্ডিং",
        "আইনি ট্রেড লাইসেন্স ও এনআইডি ভেরিফিকেশন প্রটোকল পরীক্ষণ",
        "রিয়েল-টাইম রুম ইনভেন্টরি ও কিউআর চেক-ইন ভাউচার সিস্টেম চালু",
        "ভোক্তা অধিকার সংরক্ষণ ও অপারেশনাল ফিডব্যাক বিশ্লেষণ"
      ] : [
        "Onboarding 100 model hotels across Dhaka Metropolitan & Airport hubs",
        "Validating legal trade license & NID document verification protocols",
        "Deploying live room inventory synchronization & QR check-in vouchers",
        "Calibrating initial consumer rights & operational response metrics"
      ]
    },
    {
      phase: isBn ? "২য় পর্যায়" : "Phase 02",
      title: isBn ? "প্রধান পর্যটন হাব সম্প্রসারণ" : "Premier Tourist Hub Expansion",
      timeline: isBn ? "৪র্থ — ৬ষ্ঠ মাস" : "Months 4 — 6",
      status: isBn ? "সম্প্রসারণ প্রস্তুত" : "Expansion Ready",
      statusColor: "text-cyan-700 bg-cyan-50 border-cyan-200",
      items: isBn ? [
        "কক্সবাজার, সিলেট, শ্রীমঙ্গল ও সাজেক ভ্যালির সকল হোটেল ও রিসোর্ট অন্তর্ভুক্তি",
        "বাংলাদেশ ব্যাংকের অনুমোদিত ক্যাশলেস পেমেন্ট গেটওয়ে (বিকাশ/কার্ড) সংযুক্তি",
        "ট্যুরিজম ম্যাপ থেকে তাৎক্ষণিক নিকটস্থ হোটেল বুকিং ফিচার সক্রিয়করণ",
        "হোটেল মালিকদের জন্য অ্যান্টি-থেফ্ট ও রাজস্ব সুরক্ষা ড্যাশবোর্ড ট্রেনিং"
      ] : [
        "Expanding to all hotels & eco-resorts across Cox's Bazar, Sylhet & Sajek",
        "Full integration of central-bank authorized digital gateways (bKash/Cards)",
        "Activating Tourist Spot → Nearby Verified Hotels instant discovery",
        "Conducting host workshops on anti-theft revenue protection ledgers"
      ]
    },
    {
      phase: isBn ? "৩য় পর্যায়" : "Phase 03",
      title: isBn ? "দেশব্যাপী ৬৪ জেলায় জাতীয় বিস্তার" : "Nationwide 64-District Rollout",
      timeline: isBn ? "৭ম — ১২তম মাস" : "Months 7 — 12",
      status: isBn ? "পরিকল্পিত বিস্তার" : "Scheduled Scale",
      statusColor: "text-indigo-700 bg-indigo-50 border-indigo-200",
      items: isBn ? [
        "বাংলাদেশের ৬৪টি জেলার সকল বাণিজ্যিক ও বাজেট হোটেলের সেন্ট্রাল ডেটাবেজ",
        "মন্ত্রণালয় ও পর্যটন কর্পোরেশনের জন্য সেন্ট্রাল রেগুলেটরি তদারকি পোর্টাল",
        "আন্তর্জাতিক পর্যটকদের জন্য বহুভাষিক ইন্টারফেস ও বৈদেশিক মুদ্রা চ্যানেল",
        "জাতীয় পর্যটন প্রচারণায় সরকারি আনুষ্ঠানিক অংশীদারিত্ব ও সচেতনতা ড্রাইভ"
      ] : [
        "Comprehensive database mapping across all 64 districts of Bangladesh",
        "Deploying the dedicated Ministry & BPC regulatory oversight dashboard",
        "Multi-currency & multi-lingual channels for incoming foreign tourists",
        "Official national tourism campaign backing across all state media"
      ]
    },
    {
      phase: isBn ? "৪র্থ পর্যায়" : "Phase 04",
      title: isBn ? "এআই ইনসাইটস ও জাতীয় পলিসি ইঞ্জিন" : "AI Tourism Intelligence & Policy",
      timeline: isBn ? "১৩তম মাস+" : "Month 13 Onwards",
      status: isBn ? "স্মার্ট ভিশন" : "Smart Vision 2041",
      statusColor: "text-amber-700 bg-amber-50 border-amber-200",
      items: isBn ? [
        "মৌসুমি পর্যটন চাহিদা পূর্বাভাস ও হোটেল অকুপেন্সি প্রেডিক্টিভ এআই",
        "পরিবেশবান্ধব ইকোট্যুরিজম পলিসি প্রণয়নে সরকারকে বেনামে ডেটা সরবরাহ",
        "স্মার্ট হসপিটালিটি ইনফ্রাস্ট্রাকচারে আঞ্চলিক বিনিয়োগ সম্ভাবনা ম্যাপিং",
        "ক্যাশলেস স্মার্ট বাংলাদেশ ২০৪১ রূপকল্পের টেকসই মাইলফলক অর্জন"
      ] : [
        "AI-driven seasonal demand forecasting & room occupancy analytics",
        "Anonymized aggregate hospitality intelligence for national policy formulation",
        "Regional infrastructure investment opportunity heatmaps",
        "Serving as benchmark DPI for Cashless Smart Bangladesh 2041"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      
      {/* Universal Header */}
      <Header />

      {/* ═══════════════════════════════════════════════════
          OFFICIAL INSTITUTIONAL TOP BAR (CLEAN WHITE/LIGHT)
      ═══════════════════════════════════════════════════ */}
      <div className="bg-white/95 border-b border-slate-200 sticky top-16 z-40 backdrop-blur-xl px-4 py-2.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isBn ? "হোম" : "Home"}</span>
            </Link>

            <div className="h-4 w-px bg-slate-200 hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-slate-800">
                {isBn 
                  ? "গণপ্রজাতন্ত্রী বাংলাদেশ সরকার • বেসামরিক বিমান পরিবহন ও পর্যটন মন্ত্রণালয় প্রস্তাবিত উদ্যোগ" 
                  : "Govt of Bangladesh • Ministry of Civil Aviation & Tourism Proposed Initiative"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Launch Slide Deck Modal Trigger */}
            <button
              onClick={() => {
                setCurrentSlideIndex(0);
                setShowPitchModal(true);
              }}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
              title="View the 21-Slide Executive Deck"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>{isBn ? "প্রেজেন্টেশন ডেক (২১ স্লাইড)" : "Pitch Deck Mode (21 Slides)"}</span>
            </button>

            {/* MoU Consultation Request Button */}
            <button
              onClick={() => setShowPartnershipModal(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white font-black transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isBn ? "পার্টনারশিপ আবেদন" : "MoU Request"}</span>
            </button>

            {/* Print/Save Document */}
            <button
              onClick={() => window.print()}
              className="p-1.5 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              title="Print Document"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isBn ? "English" : "বাংলা"}</span>
            </button>
          </div>

        </div>
      </div>

      <main className="flex-1">
        
        {/* ═══════════════════════════════════════════════════
            HERO SECTION: NATIONAL DIGITAL HOSPITALITY INITIATIVE
        ═══════════════════════════════════════════════════ */}
        <section className="relative pt-12 pb-20 px-4 md:px-6 overflow-hidden bg-gradient-to-b from-white via-slate-50/70 to-white border-b border-slate-200/80">
          
          {/* Subtle Ambient Glows */}
          <div className="absolute top-0 left-1/4 w-[40rem] h-[40rem] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[36rem] h-[36rem] bg-teal-500/5 rounded-full blur-[150px] pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            
            {/* Top Badge */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>
                  {isBn 
                    ? "জাতীয় ডিজিটাল পাবলিক ইনফ্রাস্ট্রাকচার (DPI) প্রস্তাবনা" 
                    : "National Digital Public Infrastructure (DPI) Initiative"}
                </span>
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium">
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  {isBn 
                    ? "সহযোগিতায়: বেসামরিক বিমান পরিবহন ও পর্যটন মন্ত্রণালয় + বিপিসি" 
                    : "In Alliance: Civil Aviation & Tourism Ministry + BPC"}
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
                <Activity className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                <span>{isBn ? "লাইভ নোড সক্রিয় • সংস্করণ ২.৪" : "Live Core Node Active • v2.4"}</span>
              </div>
            </div>

            {/* Main Title & Value Prop */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              <div className="lg:col-span-8">
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.06]">
                  {isBn ? (
                    <>
                      বাংলাদেশের সমন্বিত <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">
                        জাতীয় হোটেল ও পর্যটন
                      </span> ডিজিটাল প্ল্যাটফর্ম
                    </>
                  ) : (
                    <>
                      National Digital <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">
                        Hospitality & Tourism
                      </span> Infrastructure
                    </>
                  )}
                </h1>

                <p className="text-base sm:text-lg md:text-xl text-slate-600 mt-6 leading-relaxed max-w-3xl font-normal">
                  {isBn
                    ? "সাধারণ নাগরিক, দেশি-বিদেশি পর্যটক, ভেরিফায়েড হোটেল মালিক এবং বাংলাদেশ সরকারের পর্যটন দপ্তরকে এক ছাতার নিচে নিয়ে আসার জন্য একটি উন্মুক্ত, স্বচ্ছ ও নিরাপদ জাতীয় ডিজিটাল পাবলিক প্ল্যাটফর্ম।"
                    : "A transparent, secure, and unified national digital public gateway connecting citizens, foreign tourists, verified hoteliers, and regulatory authorities under one trusted sovereign ecosystem."}
                </p>

                {/* Primary Action Buttons */}
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a
                    href="#stakeholder-matrix"
                    className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm transition-all flex items-center gap-2 shadow-md shadow-emerald-600/20 active:scale-95"
                  >
                    <span>{isBn ? "প্ল্যাটফর্মের মূল সুবিধা ও কাঠামো" : "Explore Strategic Matrix"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <a
                    href="#economic-calculator"
                    className="px-6 py-3.5 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-700 font-bold text-sm border border-emerald-300 transition-all flex items-center gap-2 active:scale-95 shadow-xs"
                  >
                    <Calculator className="w-4 h-4 text-emerald-600" />
                    <span>{isBn ? "জাতীয় রাজস্ব সঞ্চয় ক্যালকুলেটর" : "National ROI Calculator"}</span>
                  </a>

                  <button
                    onClick={() => {
                      setCurrentSlideIndex(0);
                      setShowPitchModal(true);
                    }}
                    className="px-5 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 font-semibold text-sm border border-slate-200 transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Monitor className="w-4 h-4 text-emerald-600" />
                    <span>{isBn ? "এক্সিকিউটিভ ডেক (২১ স্লাইড)" : "Pitch Deck"}</span>
                  </button>
                </div>
              </div>

              {/* National Target Card (Luxury Executive Accent Card) */}
              <div className="lg:col-span-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-xl relative">
                <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                  <div>
                    <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                      {isBn ? "প্রকল্প পরিচিতি" : "Project Identity"}
                    </span>
                    <h3 className="text-2xl font-black text-white">
                      Stay<span className="text-emerald-400">BD</span>
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-extrabold">
                    {isBn ? "স্মার্ট বাংলাদেশ ২০৪১" : "Smart BD 2041"}
                  </span>
                </div>

                <div className="py-4 space-y-3.5 text-xs text-slate-300">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{isBn ? "৬৪ জেলার সকল অনুমোদিত হোটেল ও কটেজ কভারেজ" : "Full 64-district verified accommodation coverage"}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{isBn ? "দালাল ও মধ্যস্বত্বভোগী ছাড়া শতভাগ স্বচ্ছ নির্ধারিত ভাড়া" : "Zero middlemen markups with audited fair pricing"}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{isBn ? "হোটেল ম্যানেজারের চুরি রোধে লাইভ ইনভেন্টরি লেজার" : "Anti-theft inventory ledger stopping revenue leaks"}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{isBn ? "সরকারি কোষাগারের ওপর কোনো প্রকার আর্থিক চাপ নেই" : "Zero recurring fiscal burden on the state exchequer"}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700 flex items-center justify-between text-xs text-slate-300">
                  <span>{isBn ? "ভিত্তি কাঠামো:" : "Core Standard:"}</span>
                  <span className="text-emerald-400 font-bold">{isBn ? "ডিজিটাল পাবলিক ইনফ্রাস্ট্রাকচার" : "Public Digital Infrastructure"}</span>
                </div>
              </div>

            </div>

            {/* 4 Live Impact KPI Highlights (White Cards) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 text-left shadow-xs hover:border-emerald-500/40 hover:shadow-md transition-all">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
                  {isBn ? "জাতীয় পরিসর" : "National Reach"}
                </span>
                <div className="text-2xl sm:text-3xl font-black text-slate-900">
                  {isBn ? "৬৪ জেলা" : "64 Districts"}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {isBn ? "দেশব্যাপী সম্পূর্ণ কভারেজ পরিকল্পনা" : "Complete nationwide coverage"}
                </p>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 text-left shadow-xs hover:border-emerald-500/40 hover:shadow-md transition-all">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
                  {isBn ? "ভাড়া স্বচ্ছতা" : "Rate Transparency"}
                </span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-600">
                  {isBn ? "১০০% স্বচ্ছ" : "100% Direct"}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {isBn ? "কোনো লুকানো বা অতিরিক্ত ফি নেই" : "Zero hidden broker commissions"}
                </p>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 text-left shadow-xs hover:border-emerald-500/40 hover:shadow-md transition-all">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
                  {isBn ? "বিশ্বস্ততা নিশ্চিতকরণ" : "Trust Architecture"}
                </span>
                <div className="text-2xl sm:text-3xl font-black text-slate-900">
                  {isBn ? "৪-স্তর যাচাই" : "4-Tier Audit"}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {isBn ? "ট্রেড লাইসেন্স ও জিপিএস ভেরিফিকেশন" : "NID, Trade License & Satellite GPS"}
                </p>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 text-left shadow-xs hover:border-emerald-500/40 hover:shadow-md transition-all">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
                  {isBn ? "সরকারি পরিচালন ব্যয়" : "Exchequer Cost"}
                </span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-600">
                  {isBn ? "৳ ০ (শূন্য)" : "৳ 0 Burden"}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {isBn ? "স্বনির্ভর SaaS সাবস্ক্রিপশন মডেল" : "Self-sustaining operational model"}
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            SECTION 2: INTERACTIVE MULTI-STAKEHOLDER MATRIX
        ═══════════════════════════════════════════════════ */}
        <section id="stakeholder-matrix" className="py-20 px-4 md:px-6 bg-slate-50/70 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto">
            
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-black uppercase text-emerald-700 tracking-wider">
                {isBn ? "বহুমাত্রিক অংশীজন সুবিধা" : "Multi-Stakeholder Framework"}
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mt-2">
                {isBn 
                  ? "সকলের জন্য সমান নির্ভরযোগ্য ও স্বচ্ছ সমাধান" 
                  : "Empowering Every Stakeholder in Tourism"}
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-3">
                {isBn
                  ? "সাধারণ নাগরিকের বাজেট ভ্রমণ থেকে শুরু করে হোটেল মালিকদের রাজস্ব সুরক্ষা এবং সরকারের জাতীয় নীতি নির্ধারণ—একই প্ল্যাটফর্মে সমন্বিত।"
                  : "From low-budget citizens and luxury travelers to hotel owners and state regulators—served seamlessly on one integrated infrastructure."}
              </p>
            </div>

            {/* 4 Stakeholder Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
              {[
                { id: "citizens", labelEn: "Citizens & Travelers", labelBn: "নাগরিক ও পর্যটক", icon: Users },
                { id: "hotels", labelEn: "Hotel Owners & Hosts", labelBn: "হোটেল মালিক ও অপারেটর", icon: Building2 },
                { id: "government", labelEn: "Government & Regulators", labelBn: "সরকার ও প্রশাসন", icon: Landmark },
                { id: "economy", labelEn: "National Digital Economy", labelBn: "জাতীয় ডিজিটাল অর্থনীতি", icon: Briefcase },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 border cursor-pointer ${
                      isActive
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20 font-black scale-[1.02]"
                        : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-slate-200 shadow-2xs"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{isBn ? tab.labelBn : tab.labelEn}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Content Panes (White Card) */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm">
              
              {/* TAB 1: Citizens */}
              {activeTab === "citizens" && (
                <div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-8">
                    <div>
                      <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
                        {isBn ? "নাগরিকের ভোগান্তিহীন সেবা" : "Frictionless Citizen Service"}
                      </span>
                      <h3 className="text-2xl font-black text-slate-900 mt-1">
                        {isBn ? "যেকোনো বাজেটে নিরাপদ ও নিশ্চিত আবাসন" : "Guaranteed Transparent Stays for Every Budget"}
                      </h3>
                    </div>
                    <Link
                      to="/hotels"
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 self-start md:self-auto transition-colors shadow-xs"
                    >
                      <span>{isBn ? "লাইভ হোটেল খুঁজুন" : "Find Stays Now"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-500/40 hover:bg-white transition-all shadow-2xs">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black mb-3">
                        ৳
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mb-2">
                        {isBn ? "স্বচ্ছ বাজেট ফিল্টারিং (৳০ — ৳১০,০০০+)" : "Exact Budget Filtering (৳0 — ৳10,000+)"}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {isBn 
                          ? "শিক্ষার্থী ও একক ভ্রমণকারীর ৳৫০০ বাজেট থেকে শুরু করে পরিবারের বিলাসবহুল ৫-স্টার স্যুট—সবার জন্য এক প্ল্যাটফর্মে তথ্যবহুল অপশন।" 
                          : "From ৳500 student budget rooms to 5-star executive suites—instant precision filtering without hidden fees."}
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-500/40 hover:bg-white transition-all shadow-2xs">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black mb-3">
                        <Check className="w-5 h-5" />
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mb-2">
                        {isBn ? "রিয়েল-টাইম রুম প্রাপ্যতা ও বুকিং" : "Real-Time Room Vacancy & QR Vouchers"}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {isBn 
                          ? "হোটেলের দরজায় না ঘুরে ঘরে বসেই নিশ্চিত রুম বুকিং। বুকিং সম্পন্ন হওয়ার সাথে সাথে মোবাইলে ডিজিটাল কিউআর ভাউচার প্রদান।" 
                          : "Zero walking hotel to hotel. Confirm genuine vacant rooms and receive encrypted digital QR vouchers instantly."}
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-500/40 hover:bg-white transition-all shadow-2xs">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black mb-3">
                        <Scale className="w-5 h-5" />
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mb-2">
                        {isBn ? "ভোক্তা অধিকার ও ২৪ ঘণ্টা সমাধান" : "Consumer Grievance Resolution"}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {isBn 
                          ? "কোনো হোটেল প্রতিশ্রুতি অনুযায়ী সেবা না দিলে বা অতিরিক্ত ভাড়া দাবি করলে সরাসরি অ্যাডমিন মধ্যস্থতা ও প্রতিকার পাওয়ার ব্যবস্থা।" 
                          : "Direct structured complaint escalation ensuring 24-hour mediation and consumer compensation mechanisms."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Hotels */}
              {activeTab === "hotels" && (
                <div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-8">
                    <div>
                      <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
                        {isBn ? "হোটেল ব্যবসায়ীদের জন্য আধুনিকায়ন" : "Modern Host Operations"}
                      </span>
                      <h3 className="text-2xl font-black text-slate-900 mt-1">
                        {isBn ? "অ্যান্টি-থেফ্ট রাজস্ব সুরক্ষা ও ডিজিটাল ইনভেন্টরি" : "Anti-Theft Revenue Security & Direct Customer Reach"}
                      </h3>
                    </div>
                    <Link
                      to="/owner-dashboard"
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 self-start md:self-auto transition-colors shadow-xs"
                    >
                      <span>{isBn ? "মালিকের ড্যাশবোর্ড দেখুন" : "View Host Dashboard"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-500/40 hover:bg-white transition-all shadow-2xs">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black mb-3">
                        <Layers className="w-5 h-5" />
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mb-2">
                        {isBn ? "ম্যানেজারিয়াল চুরি রোধে লাইভ লেজার" : "Anti-Theft Revenue Ledger"}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {isBn 
                          ? "অফলাইন বা অনলাইন সব রুম ভাড়ার ডিজিটাল হিসাব রিয়েল-টাইমে মালিকের মোবাইলে সিঙ্ক হয়। ফ্রন্ট-ডেস্কের রাজস্ব গোপন বন্ধ।" 
                          : "Every offline walk-in and online booking syncs directly to the owner's mobile. Eradicates front-desk cashier theft."}
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-500/40 hover:bg-white transition-all shadow-2xs">
                      <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-black mb-3">
                        <SlidersHorizontal className="w-5 h-5" />
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mb-2">
                        {isBn ? "ডাইনামিক মৌসুমি মূল্য ও অফার" : "Dynamic Seasonal Pricing"}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {isBn 
                          ? "ছুটির দিন বা অফ-সিজনে সহজে রুমের ভাড়া পরিবর্তন, বিশেষ প্রোমো কোড এবং ন্যূনতম স্টে পলিসি সেট করার স্বয়ংক্রিয় সুযোগ।" 
                          : "Adjust room tariffs, launch weekend discounts, and set minimum stay rules with instant cross-platform synchronization."}
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-500/40 hover:bg-white transition-all shadow-2xs">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black mb-3">
                        <Star className="w-5 h-5" />
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mb-2">
                        {isBn ? "পেইড অপপ্রচারমুক্ত সুনাম সুরক্ষা" : "Protection from Fake Bad Reviews"}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {isBn 
                          ? "প্রতিযোগীদের শত্রুভাবাপন্ন ফেক রিভিউ বা ব্ল্যাকমেইলিং বন্ধ। শুধুমাত্র স্টে সম্পন্ন করা ভেরিফায়েড গেস্টই রেটিং দিতে পারে।" 
                          : "Eradicates malicious smear reviews from competitor agencies. Only authenticated checked-out guests can rate."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Government */}
              {activeTab === "government" && (
                <div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-8">
                    <div>
                      <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
                        {isBn ? "জাতীয় তদারকি ও নিরাপত্তা" : "National Oversight & Security"}
                      </span>
                      <h3 className="text-2xl font-black text-slate-900 mt-1">
                        {isBn ? "স্ট্রাকচার্ড পর্যটন ডাটা ও নীতি নির্ধারণ সহায়তা" : "Structured Hospitality Data & Regulatory Visibility"}
                      </h3>
                    </div>
                    <button
                      onClick={() => setShowPartnershipModal(true)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 self-start md:self-auto transition-colors shadow-xs cursor-pointer"
                    >
                      <span>{isBn ? "প্রস্তাবিত পার্টনারশিপ দেখুন" : "View Partnership Plan"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-500/40 hover:bg-white transition-all shadow-2xs">
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black mb-3">
                        <Landmark className="w-5 h-5" />
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mb-2">
                        {isBn ? "কেন্দ্রীয় নিয়ন্ত্রক তদারকি ড্যাশবোর্ড" : "Central Regulatory Oversight"}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {isBn 
                          ? "মন্ত্রণালয় ও পর্যটন কর্পোরেশনের জন্য বিশেষায়িত পোর্টাল—যেখানে ৬৪ জেলার লাইভ হোটেল নিবন্ধন ও নিরাপত্তা কমপ্লায়েন্স দৃশ্যমান।" 
                          : "Dedicated portal for Civil Aviation & Tourism authorities providing live 64-district licensing and compliance oversight."}
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-500/40 hover:bg-white transition-all shadow-2xs">
                      <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-black mb-3">
                        <Shield className="w-5 h-5" />
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mb-2">
                        {isBn ? "ট্যুরিস্ট পুলিশ ও জরুরি এসওএস" : "Tourist Police & Emergency SOS"}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {isBn 
                          ? "ট্যুরিস্ট পুলিশ হেল্পলাইন ও নিকটস্থ থানার তথ্য সরাসরি হোটেল ভাউচারে সংযুক্ত। পর্যটকের নিরাপত্তা ও আইনি সুরক্ষা নিশ্চিত।" 
                          : "Direct Tourist Police dispatch linkages embedded in every booking voucher for instant emergency intervention."}
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-500/40 hover:bg-white transition-all shadow-2xs">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black mb-3">
                        <BarChart3 className="w-5 h-5" />
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mb-2">
                        {isBn ? "জাতীয় নীতি প্রণয়নে বেনামী বিগ ডাটা" : "Anonymized Macroeconomic Insights"}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {isBn 
                          ? "ব্যক্তিগত গোপনীয়তা ক্ষুণ্ণ না করে সার্বিক পর্যটন প্রবাহ, অঞ্চলভিত্তিক চাহিদা এবং বিনিয়োগ সম্ভাবনার প্রামাণ্য পরিসংখ্যান।" 
                          : "Aggregated, privacy-compliant tourism density and room demand patterns to drive targeted infrastructure investments."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: Economy */}
              {activeTab === "economy" && (
                <div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-8">
                    <div>
                      <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
                        {isBn ? "ক্যাশলেস অর্থনীতির মাইলফলক" : "National Digital Economy Driver"}
                      </span>
                      <h3 className="text-2xl font-black text-slate-900 mt-1">
                        {isBn ? "দেশীয় মুদ্রার সুরক্ষা ও ক্যাশলেস স্মার্ট বাংলাদেশ" : "Retaining Capital & Driving Sovereign Digital Payments"}
                      </h3>
                    </div>
                    <a
                      href="#economic-calculator"
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 self-start md:self-auto transition-colors shadow-xs"
                    >
                      <span>{isBn ? "সঞ্চয় ক্যালকুলেটর দেখুন" : "View Savings Metric"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-500/40 hover:bg-white transition-all shadow-2xs">
                      <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-black mb-3">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mb-2">
                        {isBn ? "বৈদেশিক মুদ্রা পাচার রোধ" : "Foreign Capital Flight Prevention"}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {isBn 
                          ? "আন্তর্জাতিক ওটিএগুলোর ২০-২৫% উচ্চ কমিশনের কোটি কোটি টাকা বিদেশে পাচার বন্ধ করে দেশীয় অর্থনৈতিক চক্রে ধারণ।" 
                          : "Stops millions in predatory 20–25% commissions extracted annually by foreign OTAs, keeping wealth inside Bangladesh."}
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-500/40 hover:bg-white transition-all shadow-2xs">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black mb-3">
                        <Zap className="w-5 h-5" />
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mb-2">
                        {isBn ? "জাতীয় পেমেন্ট সুইচ ও বাংলা কিউআর" : "NPSB & Bangla QR Integration"}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {isBn 
                          ? "বাংলাদেশ ব্যাংকের জাতীয় পেমেন্ট সুইচ, বাংলা কিউআর এবং অনুমোদিত এমএফএস (বিকাশ/নগদ) এর মাধ্যমে শতভাগ স্বচ্ছ লেনদেন।" 
                          : "Deep integration with central-bank NPSB, Bangla QR, and verified MFS channels guaranteeing instant settled payouts."}
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-500/40 hover:bg-white transition-all shadow-2xs">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black mb-3">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mb-2">
                        {isBn ? "এনবিআর ভ্যাট ও ট্যাক্স স্বচ্ছতা" : "NBR Direct VAT Transparency"}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {isBn 
                          ? "হোটেল লেনদেনের স্বয়ংক্রিয় ডিজিটাল ইনভয়েসিং সরকারি রাজস্ব বিভাগের জন্য স্বচ্ছ ও নির্বিঘ্ন ট্যাক্স সমন্বয় নিশ্চিত করে।" 
                          : "Automated digital receipts provide clean, auditable records for streamlined NBR VAT reconciliation."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            SECTION 3: INTERACTIVE 4-TIER ANTI-FRAUD SIMULATOR
        ═══════════════════════════════════════════════════ */}
        <section className="py-20 px-4 md:px-6 bg-white border-b border-slate-200/80 relative">
          <div className="max-w-7xl mx-auto">
            
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-black uppercase text-emerald-700 tracking-wider">
                {isBn ? "প্রতারণা ও ভোগান্তি নির্মূল ইঞ্জিন" : "Eradicating Hospitality Fraud"}
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mt-2">
                {isBn 
                  ? "৪-স্তর বিশিষ্ট বিশ্বস্ততা ও যাচাইকরণ আর্কিটেকচার" 
                  : "4-Tier Architecture Eradicating Hospitality Fraud"}
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-3">
                {isBn
                  ? "কোনো ধরনের ভুয়া তালিকা, অতিরিক্ত ভাড়া দাবি বা ম্যানেজারিয়াল রাজস্ব চুরির সুযোগ নেই।"
                  : "Engineered from the ground up to eliminate ghost properties, extortionate spot pricing, and front-desk ledger manipulation."}
              </p>
            </div>

            {/* 4 Interactive Clickable Tier Cards (White/Light Theme) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {TRUST_TIERS.map((tier, idx) => {
                const Icon = tier.icon;
                const isSelected = activeTier === idx;
                return (
                  <button
                    key={tier.number}
                    onClick={() => setActiveTier(idx)}
                    className={`p-6 rounded-3xl text-left border transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? "bg-emerald-50/70 border-emerald-500 shadow-md ring-1 ring-emerald-500 scale-[1.02]"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className={`text-[10px] font-black tracking-widest px-2.5 py-1 rounded-lg ${
                          isSelected ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"
                        }`}>
                          TIER {tier.number}
                        </span>
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          isSelected ? "bg-emerald-200/80 text-emerald-800" : "bg-slate-100 text-slate-600"
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 mb-2 leading-snug">
                        {isBn ? tier.titleBn : tier.titleEn}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                        {isBn ? tier.descBn : tier.descEn}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-200/80 mt-4">
                      <span className="text-[10px] font-bold text-emerald-700 block uppercase tracking-wider">
                        {isBn ? tier.badgeBn : tier.badgeEn}
                      </span>
                      <span className="text-xs font-extrabold text-slate-900 mt-0.5 block">
                        {isBn ? tier.statBn : tier.statEn}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* LIVE SIMULATION CONSOLE PREVIEW (High-Tech Dark Terminal Accent) */}
            {(() => {
              const currentTier = TRUST_TIERS[activeTier];
              const Icon = currentTier.icon;
              return (
                <div className="bg-slate-950 text-white border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">
                            {isBn ? `সক্রিয় সিমুলেশন: টিয়ার ${currentTier.number}` : `Active Audit Console: Tier ${currentTier.number}`}
                          </span>
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        </div>
                        <h4 className="text-lg sm:text-xl font-black text-white mt-0.5">
                          {isBn ? currentTier.titleBn : currentTier.titleEn}
                        </h4>
                      </div>
                    </div>

                    <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold shrink-0 self-start md:self-auto">
                      ✓ {isBn ? "স্বয়ংক্রিয় অডিট সক্রিয়" : "Live Audit Validated"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        {isBn ? "যাচাইকরণ প্রটোকল ০১" : "Audit Protocol 01"}
                      </span>
                      <div className="text-xs font-mono font-bold text-emerald-300 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>{isBn ? currentTier.simData.item1Bn : currentTier.simData.item1En}</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        {isBn ? "যাচাইকরণ প্রটোকল ০২" : "Audit Protocol 02"}
                      </span>
                      <div className="text-xs font-mono font-bold text-emerald-300 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>{isBn ? currentTier.simData.item2Bn : currentTier.simData.item2En}</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        {isBn ? "জাতীয় নিরাপত্তা মান" : "National Standard"}
                      </span>
                      <div className="text-xs font-mono font-bold text-emerald-300 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>{isBn ? currentTier.simData.item3Bn : currentTier.simData.item3En}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Security-by-Design Compliance Strip (White/Slate Card) */}
            <div className="mt-8 p-6 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm md:text-base font-bold text-slate-900">
                    {isBn ? "ডেটা প্রাইভেসি ও সাইবার নিরাপত্তা আইন ২০২৩ অনুসরণ" : "Cyber Security & Data Privacy Compliance"}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5 max-w-2xl">
                    {isBn 
                      ? "প্রয়োজনের অতিরিক্ত ব্যক্তিগত তথ্য সংগ্রহ নয় • এন্ড-টু-এন্ড এনক্রিপশন • বাংলাদেশ সাইবার নিরাপত্তা আইন ও আন্তর্জাতিক কমপ্লায়েন্স অনুসরণ।" 
                      : "Zero invasive tracking • 256-Bit SSL End-to-End Encryption • Full adherence to Bangladesh Cyber Security Act 2023 & global data privacy norms."}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-mono px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-2xs">
                  {isBn ? "২৫৬-বিট এনক্রিপশন" : "256-Bit SSL"}
                </span>
                <span className="text-[11px] font-semibold px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800">
                  {isBn ? "আইনসম্মত সম্মতি" : "Consent-Based"}
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            SECTION 4: INTERACTIVE NATIONAL ECONOMIC CALCULATOR
        ═══════════════════════════════════════════════════ */}
        <section id="economic-calculator" className="py-20 px-4 md:px-6 bg-slate-50/70 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto">
            
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-black uppercase text-emerald-700 tracking-wider">
                {isBn ? "অর্থনৈতিক প্রভাব ও সঞ্চয় সিমুলেটর" : "National Economic Savings Simulator"}
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mt-2">
                {isBn 
                  ? "বিদেশি ওটিএ-র শত কোটি টাকার কমিশন পাচার রোধ" 
                  : "Halting Foreign Capital Flight & Retaining Wealth"}
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-3">
                {isBn
                  ? "আন্তর্জাতিক ওটিএগুলোর ২০–২৫% উচ্চ কমিশন রোধ করে দেশীয় হোটেল মালিকদের কত টাকা বাঁচে এবং জাতীয় অর্থনীতিতে কত সঞ্চয় হয় তা লাইভ হিসেব করুন।"
                  : "Calculate the exact monthly capital saved when transitioning from predatory 22% foreign OTA commissions to StayBD's sovereign infrastructure."}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm">
              
              {/* Sliders Input Side */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                    <span>{isBn ? "হোটেলের মোট রুম সংখ্যা:" : "Total Hotel Rooms:"}</span>
                    <span className="text-base font-black text-emerald-700">{calcRooms} {isBn ? "টি রুম" : "Rooms"}</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="300"
                    step="5"
                    value={calcRooms}
                    onChange={(e) => setCalcRooms(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>10 {isBn ? "রুম" : "rooms"}</span>
                    <span>150 {isBn ? "রুম" : "rooms"}</span>
                    <span>300 {isBn ? "রুম" : "rooms"}</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                    <span>{isBn ? "গড় রুম ভাড়া (প্রতি রাত):" : "Average Room Tariff (Per Night):"}</span>
                    <span className="text-base font-black text-emerald-700">৳{calcTariff.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="800"
                    max="10000"
                    step="200"
                    value={calcTariff}
                    onChange={(e) => setCalcTariff(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>৳800</span>
                    <span>৳5,000</span>
                    <span>৳10,000</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                    <span>{isBn ? "গড় মাসিক অকুপেন্সি হার:" : "Average Monthly Occupancy:"}</span>
                    <span className="text-base font-black text-emerald-700">{calcOccupancy}%</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="95"
                    step="5"
                    value={calcOccupancy}
                    onChange={(e) => setCalcOccupancy(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>30% ({isBn ? "অফ-সিজন" : "Off-Season"})</span>
                    <span>65% ({isBn ? "স্বাভাবিক" : "Normal"})</span>
                    <span>95% ({isBn ? "পিক-সিজন" : "Peak Season"})</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Results Display Side (Executive Card) */}
              <div className="lg:col-span-6 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    {isBn ? "আনুমানিক মাসিক মোট ভাড়া আয়" : "Estimated Monthly Gross Revenue"}
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-white mt-1">
                    ৳{monthlyGrossRevenue.toLocaleString()}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                  <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-left">
                    <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wider block mb-1">
                      {isBn ? "বিদেশি ওটিএ কমিশন ক্ষতি (২২%)" : "Foreign OTA Drain (22%)"}
                    </span>
                    <div className="text-lg font-black text-rose-400">
                      -৳{foreignOtaDrain.toLocaleString()}
                    </div>
                    <p className="text-[11px] text-rose-300/80 mt-1">
                      {isBn ? "বিদেশে পাচার হওয়া অর্থ" : "Outflow to foreign entities"}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-left">
                    <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block mb-1">
                      {isBn ? "StayBD পরিচালন ফি (১.৫%)" : "StayBD DPI Model (1.5%)"}
                    </span>
                    <div className="text-lg font-black text-emerald-400">
                      ৳{staybdOperatingFee.toLocaleString()}
                    </div>
                    <p className="text-[11px] text-emerald-300/80 mt-1">
                      {isBn ? "শুধু গেটওয়ে ও সার্ভার রক্ষণাবেক্ষণ" : "Strictly gateway & tech maintenance"}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/50">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-300 block mb-1">
                    {isBn ? "হোটেল মালিকের নিট মাসিক সঞ্চয়:" : "Net Monthly Wealth Retained by Local Host:"}
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-300">
                    +৳{localEconomyRetained.toLocaleString()} <span className="text-xs text-slate-300 font-semibold">{isBn ? "/ প্রতি মাসে সাশ্রয়" : "/ month retained"}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            SECTION 5: 5 ECOLOGICAL TOURISM ZONES
        ═══════════════════════════════════════════════════ */}
        <section className="py-20 px-4 md:px-6 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto">
            
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-black uppercase text-emerald-700 tracking-wider">
                {isBn ? "বাংলাদেশ পর্যটন মানচিত্র" : "Explore Bangladesh — 5 Ecological Zones"}
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mt-2">
                {isBn 
                  ? "পর্যটন অঞ্চল থেকে সরাসরি নিকটস্থ হোটেল অনুসন্ধান" 
                  : "Seamless Spot-to-Stay Discovery"}
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-3">
                {isBn
                  ? "দেশের ৫টি প্রধান ইকোলজিক্যাল জোনের প্রতিটি স্পটের সাথে যাচাইকৃত হোটেল ও কটেজ যুক্ত করা হয়েছে।"
                  : "Every scenic destination across all 5 ecological zones is mapped directly to verified, transparent accommodations."}
              </p>
            </div>

            {/* Zone Selector Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
              {TOURISM_ZONES.map((zone, idx) => {
                const Icon = zone.icon;
                const isSelected = activeZone === idx;
                return (
                  <button
                    key={zone.nameEn}
                    onClick={() => setActiveZone(idx)}
                    className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 border cursor-pointer ${
                      isSelected
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-md scale-[1.02]"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? "text-white" : "text-slate-500"}`} />
                    <span>{isBn ? zone.nameBn : zone.nameEn}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Zone Interactive Showcase Card (White Card) */}
            {(() => {
              const currentZone = TOURISM_ZONES[activeZone];
              const Icon = currentZone.icon;
              return (
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  
                  <div className="lg:col-span-7">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-2xl ${currentZone.bg} ${currentZone.accent} flex items-center justify-center`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className={`text-[11px] font-black uppercase tracking-wider ${currentZone.accent}`}>
                          {isBn ? currentZone.tagBn : currentZone.tagEn}
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                          {isBn ? currentZone.nameBn : currentZone.nameEn}
                        </h3>
                      </div>
                    </div>

                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6 font-normal">
                      {isBn ? currentZone.descBn : currentZone.descEn}
                    </p>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-6">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        {isBn ? "প্রধান দর্শনীয় স্থানসমূহ:" : "Prominent Destinations Covered:"}
                      </span>
                      <div className="text-xs sm:text-sm font-semibold text-slate-800">
                        {isBn ? currentZone.spotsBn : currentZone.spotsEn}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => navigate(`/hotels?destination=${encodeURIComponent(currentZone.destinationQuery)}`)}
                        className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all flex items-center gap-2 shadow-sm active:scale-95 cursor-pointer"
                      >
                        <span>{isBn ? "এই জোনের যাচাইকৃত হোটেল দেখুন" : "Explore Verified Hotels"}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <Link
                        to="/tourism-map"
                        className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 transition-colors flex items-center gap-1.5"
                      >
                        <Compass className="w-4 h-4 text-emerald-600" />
                        <span>{isBn ? "ট্যুরিজম ম্যাপ দেখুন" : "View Tourism Map"}</span>
                      </Link>
                    </div>
                  </div>

                  <div className="lg:col-span-5 relative aspect-[4/3] rounded-3xl overflow-hidden border border-slate-200 shadow-md">
                    <img
                      src={currentZone.imgUrl}
                      alt={currentZone.nameEn}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                    
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      <span className="bg-black/60 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold px-3 py-1 rounded-full">
                        {currentZone.avgTemp} • {currentZone.season}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider">
                          {isBn ? "যাচাইকৃত আবাসন নেটওয়ার্ক" : "Audited Network"}
                        </p>
                        <p className="text-xl font-black">
                          {isBn ? currentZone.hotelsCountBn : currentZone.hotelsCount}
                        </p>
                      </div>
                      <span className="text-xs font-semibold bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 px-2.5 py-1 rounded-lg">
                        100% Geotagged
                      </span>
                    </div>
                  </div>

                </div>
              );
            })()}

          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            SECTION 6: 4-PHASE ROLLOUT ROADMAP
        ═══════════════════════════════════════════════════ */}
        <section className="py-20 px-4 md:px-6 bg-slate-50/70 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto">
            
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-black uppercase text-emerald-700 tracking-wider">
                {isBn ? "বাস্তবায়ন পরিকল্পনা ও রোডম্যাপ" : "Nationwide Phased Execution"}
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mt-2">
                {isBn 
                  ? "৪-ধাপের দেশব্যাপী বাস্তবায়ন রূপরেখা" 
                  : "4-Phase Nationwide Execution Strategy"}
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-3">
                {isBn
                  ? "পরিকল্পিত পাইলট থেকে শুরু করে জাতীয় পরিসর পর্যন্ত ধাপে ধাপে বাস্তবায়নের পূর্ণাঙ্গ কর্মপরিকল্পনা।"
                  : "A measured, sandbox-validated rollout from model hub trials to sovereign 64-district scale."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {ROLLOUT_PHASES.map((phase, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs flex flex-col justify-between hover:border-emerald-500/40 hover:shadow-md transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-black text-slate-900 bg-slate-100 border border-slate-200 px-3 py-1 rounded-xl">
                        {phase.phase}
                      </span>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${phase.statusColor}`}>
                        {phase.status}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mb-1">
                      {phase.title}
                    </h3>

                    <span className="text-xs font-semibold text-emerald-700 block mb-4">
                      {phase.timeline}
                    </span>

                    <ul className="space-y-2.5 text-xs text-slate-600">
                      {phase.items.map((item, iIdx) => (
                        <li key={iIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-slate-100 mt-6 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>{isBn ? "অগ্রগতি:" : "Status:"}</span>
                    <span className="text-emerald-700 font-bold">{isBn ? "পরিকল্পনা প্রস্তুত" : "Charter Validated"}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            SECTION 7: ZERO FISCAL BURDEN MODEL
        ═══════════════════════════════════════════════════ */}
        <section className="py-20 px-4 md:px-6 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto">
            
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-black uppercase text-emerald-700 tracking-wider">
                {isBn ? "টেকসই আর্থিক মডেল" : "Sustainable Financial Model"}
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mt-2">
                {isBn 
                  ? "সরকারি কোষাগারের ওপর শূন্য আর্থিক চাপ" 
                  : "Zero Recurring Exchequer Cost"}
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-3">
                {isBn
                  ? "একটি আধুনিক ও স্বয়ংসম্পূর্ণ প্ল্যাটফর্ম—যা কোনো সরকারি ভর্তুকি ছাড়াই টেকসইভাবে পরিচালিত হতে সক্ষম।"
                  : "A self-sustaining digital utility operating without budgetary grants or taxpayer subsidies."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs hover:border-emerald-500/40 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black mb-5">
                  <DollarSign className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {isBn ? "স্বনির্ভর SaaS সাবস্ক্রিপশন" : "SaaS Self-Sustainability"}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {isBn 
                    ? "হোটেল ও রিসোর্টগুলোর ফ্রন্ট-ডেস্ক ইনভেন্টরি অটোমেশন ও প্রিমিয়াম প্রমোশনের জন্য নামমাত্র মাসিক সাবস্ক্রিপশনের মাধ্যমে প্ল্যাটফর্ম পরিচালিত হবে।" 
                    : "Funded via modest software subscriptions paid by commercial hoteliers for automated inventory management and direct reservations."}
                </p>
                <div className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                  {isBn ? "১০০% স্বয়ংসম্পূর্ণ মডেল" : "100% Self-Sustaining Model"}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs hover:border-emerald-500/40 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-black mb-5">
                  <Landmark className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {isBn ? "সরকারি অনুদানমুক্ত বাস্তবায়ন" : "Zero State Budget Subsidies"}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {isBn 
                    ? "কোনো আর্থিক অনুদানের প্রয়োজন নেই। বেসামরিক বিমান পরিবহন ও পর্যটন মন্ত্রণালয় এবং বিপিসি কেবল আনুষ্ঠানিক প্রচার ও নীতিগত সহায়তায় যুক্ত থাকবে।" 
                    : "Requires zero state subsidies. The Ministry & BPC provide institutional endorsement and policy harmonization."}
                </p>
                <div className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                  {isBn ? "শূন্য সরকারি আর্থিক ব্যয়" : "Zero Exchequer Burden"}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs hover:border-emerald-500/40 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-black mb-5">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {isBn ? "স্বচ্ছ ডিজিটাল লেনদেন ফি" : "Modest Booking Fee (1–2%)"}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {isBn 
                    ? "অনলাইন বুকিংয়ের ক্ষেত্রে আন্তর্জাতিক ওটিএগুলোর ২০-২৫% উচ্চ কমিশনের বিপরীতে মাত্র ১-২% অতি পরিমিত গেটওয়ে ফি—যা হোটেল মালিক ও পর্যটক উভয়ের জন্য লাভজনক।" 
                    : "Unlike predatory 20–25% fees charged by foreign OTAs, StayBD leverages a modest 1–2% fee solely covering gateway & security costs."}
                </p>
                <div className="text-[11px] font-semibold text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                  {isBn ? "ন্যায্য ও জনবান্ধব হার" : "Pro-Consumer & Pro-Hotelier"}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            SECTION 8: INSTITUTIONAL COLLABORATION & ACTION
        ═══════════════════════════════════════════════════ */}
        <section className="py-20 px-4 md:px-6 bg-slate-50/80">
          <div className="max-w-7xl mx-auto">
            
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white border border-slate-700 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

              <div className="relative z-10">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black uppercase tracking-wider">
                    {isBn ? "প্রস্তাবিত আনুষ্ঠানিক সমঝোতা স্মারক (MoU)" : "Proposed Institutional Action Framework"}
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                  {isBn 
                    ? "বাংলাদেশ সরকারের নিকট প্রস্তাবিত সহযোগিতা ও নীতিগত অনুমোদন" 
                    : "Institutional Partnership & Regulatory Authorization Request"}
                </h2>

                <p className="text-slate-300 text-sm sm:text-base mt-4 max-w-3xl leading-relaxed">
                  {isBn 
                    ? "একটি জাতীয় ডিজিটাল হসপিটালিটি নেটওয়ার্ক বাস্তবায়নের লক্ষ্যে মন্ত্রণালয় ও বাংলাদেশ পর্যটন কর্পোরেশনের যৌথ তত্ত্বাবধানে পাইলট প্রোগ্রাম চালুর আনুষ্ঠানিক প্রস্তাব।" 
                    : "A formal proposal requesting in-principle approval to initiate a supervised sandbox pilot under the Ministry of Civil Aviation & Tourism and BPC."}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                  <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-1.5">
                      <Check className="w-4 h-4" />
                      <span>{isBn ? "১. নীতিগত পাইলট অনুমোদন" : "1. Pilot Sandbox Approval"}</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      {isBn ? "ঢাকা ও প্রধান পর্যটন স্পটে যৌথ পাইলট ট্রায়ালের অনুমতি।" : "Authorization to pilot live inventory sync with selected model hotels."}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-1.5">
                      <Check className="w-4 h-4" />
                      <span>{isBn ? "২. তদারকি ড্যাশবোর্ড সমন্বয়" : "2. Regulatory Dashboard"}</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      {isBn ? "মন্ত্রণালয় ও বিপিসি কর্মকর্তাদের জন্য তদারকি এক্সেস।" : "Dedicated oversight login for authorized government officials."}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-1.5">
                      <Check className="w-4 h-4" />
                      <span>{isBn ? "৩. জাতীয় সচেতনতা প্রচার" : "3. Official Awareness Drive"}</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      {isBn ? "সরকারি চ্যানেল ও পর্যটন পোর্টালে প্ল্যাটফর্মের পরিচিতি।" : "Endorsement & visibility across official national tourism outlets."}
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-700/80 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setShowPartnershipModal(true)}
                      className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isBn ? "পার্টনারশিপ আবেদন ফর্ম জমা দিন" : "Submit Partnership / MoU Request"}</span>
                    </button>

                    <button
                      onClick={() => {
                        setCurrentSlideIndex(0);
                        setShowPitchModal(true);
                      }}
                      className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-600 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Monitor className="w-4 h-4 text-emerald-400" />
                      <span>{isBn ? "পূর্ণাঙ্গ প্রেজেন্টেশন ডেক (২১ স্লাইড)" : "Launch 21-Slide Pitch Mode"}</span>
                    </button>

                    <button
                      onClick={() => window.print()}
                      className="px-5 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-emerald-400" />
                      <span>{isBn ? "হোয়াইটপেপার প্রিন্ট / পিডিএফ" : "Download Whitepaper"}</span>
                    </button>
                  </div>

                  <div className="text-xs text-slate-400 font-medium">
                    {isBn ? "প্রস্তাবিত প্রকল্প পরিচয়: StayBD — সহজ অনুসন্ধান। নিরাপদ আবাসন।" : "Project Identity: StayBD — Stay Smart. Book Easy."}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

      </main>

      {/* ═══════════════════════════════════════════════════
          INSTITUTIONAL PARTNERSHIP CONSULTATION MODAL
      ═══════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showPartnershipModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 relative text-left"
            >
              <button
                onClick={() => {
                  setShowPartnershipModal(false);
                  setPartnerFormSubmitted(false);
                }}
                className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>

              {!partnerFormSubmitted ? (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
                      {isBn ? "অফিসিয়াল যোগাযোগ চ্যানেল" : "Official Consultation Channel"}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
                    {isBn ? "পার্টনারশিপ ও সমঝোতা স্মারক (MoU) আবেদন" : "Institutional MoU & Partnership Inquiry"}
                  </h3>

                  <p className="text-xs text-slate-600 mb-6">
                    {isBn 
                      ? "মন্ত্রণালয়, পর্যটন কর্পোরেশন বা হোটেল অ্যাসোসিয়েশনের প্রতিনিধি হিসেবে আপনার তথ্য প্রদান করুন।" 
                      : "Please submit your official credentials to schedule a technical walkthrough or regulatory briefing."}
                  </p>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setPartnerFormSubmitted(true);
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        {isBn ? "আপনার নাম ও পদবি *" : "Full Name & Official Designation *"}
                      </label>
                      <input
                        required
                        type="text"
                        placeholder={isBn ? "যেমন: মোহাম্মদ আশরাফুল ইসলাম, যুগ্ম সচিব" : "e.g. Ashraf Islam, Joint Secretary / General Manager"}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        {isBn ? "সংস্থা / মন্ত্রণালয়ের নাম *" : "Ministry / Authority / Hotel Association *"}
                      </label>
                      <input
                        required
                        type="text"
                        placeholder={isBn ? "যেমন: বেসামরিক বিমান পরিবহন ও পর্যটন মন্ত্রণালয় / বিপিসি" : "e.g. Ministry of Civil Aviation & Tourism / BPC"}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">
                          {isBn ? "মোবাইল নম্বর *" : "Official Phone / WhatsApp *"}
                        </label>
                        <input
                          required
                          type="tel"
                          placeholder="+880 1700-000000"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">
                          {isBn ? "ইমেইল ঠিকানা *" : "Official Email *"}
                        </label>
                        <input
                          required
                          type="email"
                          placeholder="official@gov.bd"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        {isBn ? "আলোচনার বিষয়বস্তু বা বার্তা" : "Scope of Inquiry / Notes"}
                      </label>
                      <textarea
                        rows={3}
                        placeholder={isBn ? "পাইলট স্যান্ডবক্স ট্রায়াল অথবা কারিগরি ডেমো সম্পর্কে সংক্ষেপে লিখুন..." : "Pilot sandbox briefing, regulatory access, or regional integration..."}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all shadow-md active:scale-95 cursor-pointer mt-2"
                    >
                      {isBn ? "আবেদন আনুষ্ঠানিকভাবে সাবমিট করুন" : "Submit Formal Inquiry"}
                    </button>
                  </form>
                </>
              ) : (
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900">
                    {isBn ? "আবেদন সফলভাবে গৃহীত হয়েছে!" : "Inquiry Successfully Registered!"}
                  </h3>
                  <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                    {isBn 
                      ? "আপনার আবেদনটি আমাদের প্রাতিষ্ঠানিক লিয়াজোঁ টিমে পৌঁছেছে। ২৪ ঘণ্টার মধ্যে আপনার সাথে সরাসরি যোগাযোগ করা হবে।" 
                      : "Your request has been routed to the StayBD Institutional Liaison Taskforce. An official response will follow within 24 hours."}
                  </p>
                  <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 text-xs font-mono text-emerald-700">
                    Ref ID: #STAYBD-MOU-{Math.floor(100000 + Math.random() * 900000)}
                  </div>
                  <button
                    onClick={() => {
                      setShowPartnershipModal(false);
                      setPartnerFormSubmitted(false);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                  >
                    {isBn ? "বন্ধ করুন" : "Close Window"}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════
          EXECUTIVE PITCH DECK PRESENTATION MODAL (21 SLIDES)
      ═══════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showPitchModal && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-5xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col justify-between max-h-[92vh]"
            >
              {/* Modal Top Bar */}
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-emerald-700 bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-lg">
                    {isBn ? `স্লাইড ${currentSlideIndex + 1} / ২১` : `SLIDE ${currentSlideIndex + 1} OF 21`}
                  </span>
                  <span className="text-xs font-bold text-slate-800 hidden sm:inline">
                    {isBn ? SLIDE_METADATA[currentSlideIndex].titleBn : SLIDE_METADATA[currentSlideIndex].title}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleLanguage}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    {isBn ? "English" : "বাংলা"}
                  </button>

                  <button
                    onClick={() => setShowPitchModal(false)}
                    className="p-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Slide Body (Dynamic based on currentSlideIndex) */}
              <div className="p-6 sm:p-10 flex-1 overflow-y-auto">
                <div className="max-w-3xl mx-auto text-left">
                  <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-widest block mb-1">
                    {isBn ? `স্লাইড ০${currentSlideIndex + 1}` : `Slide 0${currentSlideIndex + 1}`}
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mb-3">
                    {isBn ? SLIDE_METADATA[currentSlideIndex].titleBn : SLIDE_METADATA[currentSlideIndex].title}
                  </h2>

                  {/* Slide Content Preview Card */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-sm text-slate-700 leading-relaxed space-y-4">
                    {currentSlideIndex === 0 && (
                      <div>
                        <p className="text-base text-slate-800 font-semibold mb-3">
                          {isBn 
                            ? "StayBD — গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের বেসামরিক বিমান পরিবহন ও পর্যটন মন্ত্রণালয় এবং বাংলাদেশ পর্যটন কর্পোরেশনের সাথে যৌথ অংশীদারিত্বে প্রস্তাবিত জাতীয় হোটেল অনুসন্ধান ও বুকিং প্ল্যাটফর্ম।" 
                            : "StayBD — Proposed National Hotel Discovery & Booking Platform in strategic collaboration with Ministry of Civil Aviation & Tourism and Bangladesh Parjatan Corporation."}
                        </p>
                        <div className="text-xs text-emerald-700 font-bold">
                          {isBn ? "সহজ অনুসন্ধান। নিরাপদ আবাসন।" : "Stay Smart. Book Easy."}
                        </div>
                      </div>
                    )}

                    {currentSlideIndex === 1 && (
                      <div>
                        <p>{isBn ? "একটি জাতীয় ডিজিটাল প্ল্যাটফর্ম—যেখানে হোটেল, পর্যটক, ব্যবসায়ী ও সরকার একই সমন্বিত নেটওয়ার্কে যুক্ত থাকবে।" : "A national digital public platform connecting hotels, travelers, businesses, and the government in one unified, transparent ecosystem."}</p>
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                          <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700">{isBn ? "সমস্যা: দালাল ও অতিরিক্ত ভাড়া" : "Problem: Broker Price Gouging"}</div>
                          <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700">{isBn ? "সমাধান: একীভূত স্বচ্ছ পোর্টাল" : "Solution: Unified Transparent Portal"}</div>
                          <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700">{isBn ? "মূল্য: ডিজিটাল হসপিটালিটি" : "Value: Modern Digital Hospitality"}</div>
                        </div>
                      </div>
                    )}

                    {currentSlideIndex > 1 && (
                      <div>
                        <p className="text-slate-700">
                          {isBn 
                            ? `এই স্লাইডে StayBD-এর ${SLIDE_METADATA[currentSlideIndex].titleBn}-এর বিস্তারিত ফ্রেমওয়ার্ক, টেকনিক্যাল স্পেসিফিকেশন ও সরকারি সহযোগিতা নীতিমালা রয়েছে।` 
                            : `This presentation slide outlines the technical architecture, operating model, and institutional requirements for: ${SLIDE_METADATA[currentSlideIndex].title}.`}
                        </p>
                        <div className="mt-4 p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-500">
                          {isBn ? "সম্পূর্ণ ব্লুপ্রিন্ট ও টেক্সট মূল পেজের সেকশনগুলোতে বিস্তারিত দেওয়া আছে।" : "All detailed data points are also available directly on the main interactive web portal page."}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Slide Navigation Bottom Controls */}
              <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                <button
                  onClick={() => setCurrentSlideIndex(prev => Math.max(prev - 1, 0))}
                  disabled={currentSlideIndex === 0}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 disabled:opacity-30 border border-slate-200 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{isBn ? "পূর্ববর্তী স্লাইড" : "Previous Slide"}</span>
                </button>

                <div className="hidden sm:flex items-center gap-1">
                  {SLIDE_METADATA.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlideIndex(i)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        currentSlideIndex === i ? "w-6 bg-emerald-600" : "w-1.5 bg-slate-300 hover:bg-slate-400"
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setCurrentSlideIndex(prev => Math.min(prev + 1, SLIDE_METADATA.length - 1))}
                  disabled={currentSlideIndex === SLIDE_METADATA.length - 1}
                  className="px-4 py-2 rounded-xl text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-30 flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <span>{isBn ? "পরবর্তী স্লাইড" : "Next Slide"}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Universal Footer */}
      <Footer />

    </div>
  );
};

export default NationalProposal;
