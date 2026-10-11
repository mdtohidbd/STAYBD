import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, MapPin, Clock, Sparkles, ChevronRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { api, ExperienceCard } from "../services/api";
import { useTranslation } from "react-i18next";

const FALLBACK_EXPERIENCE_IMAGES = [
  "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600",
  "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600",
];

const ExperiencesAISection = () => {
    const { t, i18n } = useTranslation();
    const isBn = i18n.language?.startsWith("bn");
    const navigate = useNavigate();
    const [experiences, setExperiences] = useState<ExperienceCard[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getExperiences({ isActive: true }).then(data => {
            setExperiences(data.slice(0, 4)); // Show only 4 recommendations
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
    );

    if (experiences.length === 0) return null;

    return (
        <section className="py-16 container mx-auto px-4 max-w-[1400px]">
            <div className="flex items-end justify-between mb-8">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                        <span className="text-[11px] font-black text-emerald-700 uppercase tracking-widest">
                            {isBn ? "এআই ট্রাভেল এক্সপেরিয়েন্স" : "AI Recommended Experiences"}
                        </span>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                        {isBn ? "ভ্রমণের সাথে যুক্ত করুন রোমাঞ্চকর অভিজ্ঞতা" : "Perfect Activities for Your Stay"}
                    </h2>
                    <p className="text-slate-500 text-sm font-medium">
                        {isBn 
                            ? "আপনার অবস্থান ও পছন্দের ওপর ভিত্তি করে স্থানীয় সেরা গাইড ও স্পট এক্সপ্লোরেশন।"
                            : "Hand-picked local experiences & guided tours tailored to your destination."}
                    </p>
                </div>
                <button 
                    onClick={() => navigate('/experiences')}
                    className="group flex items-center gap-2 text-xs md:text-sm font-black text-slate-900 hover:text-emerald-600 transition-colors bg-white border border-slate-200 px-5 py-2.5 rounded-2xl shadow-xs hover:shadow-md"
                >
                    <span>{isBn ? "সকল অভিজ্ঞতা দেখুন" : "Explore all"}</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {experiences.map((exp, idx) => (
                    <motion.div
                        key={exp.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="group cursor-pointer bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-2xl hover:border-emerald-500/40 transition-all duration-500 overflow-hidden"
                        onClick={() => navigate(`/experiences/${exp.id}`)}
                    >
                        {/* Image */}
                        <div className="relative aspect-[4/5] overflow-hidden bg-slate-900">
                            <img
                                src={exp.images?.[0] || exp.image || FALLBACK_EXPERIENCE_IMAGES[idx % FALLBACK_EXPERIENCE_IMAGES.length]}
                                alt={exp.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = FALLBACK_EXPERIENCE_IMAGES[idx % FALLBACK_EXPERIENCE_IMAGES.length];
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />
                            
                            {/* Badge */}
                            <div className="absolute top-4 left-4">
                                <span className="bg-white/95 backdrop-blur-md text-slate-900 text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider border border-white/50">
                                    {exp.category === "original" ? (isBn ? "অরিজিনাল" : "Bespoke") : (isBn ? "লোকাল গাইড" : "Local Expert")}
                                </span>
                            </div>

                            {/* Price chip */}
                            <div className="absolute bottom-4 left-4">
                                <div className="bg-black/40 backdrop-blur-md border border-white/20 p-2 px-3 rounded-xl text-white">
                                    <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest leading-none mb-0.5">
                                        {isBn ? "শুরু" : "From"}
                                    </p>
                                    <p className="text-base font-black leading-none text-amber-300">
                                        ৳{(exp.price < 500 ? exp.price * 110 : exp.price).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                            <div className="flex items-center gap-1.5 mb-2">
                                <div className="flex items-center gap-1 text-amber-500">
                                    <Star className="w-3.5 h-3.5 fill-current" />
                                    <span className="text-xs font-black text-slate-900">{exp.rating}</span>
                                </div>
                                <span className="text-slate-300">•</span>
                                <span className="text-[11px] font-bold text-slate-500 uppercase">{exp.city}</span>
                            </div>

                            <h3 className="font-black text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-tight mb-3 text-sm">
                                {exp.title}
                            </h3>

                            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                                <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-bold">
                                    <Clock className="w-3.5 h-3.5 text-emerald-600" /> {exp.duration || "2-3 hours"}
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-bold truncate">
                                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> {exp.location.split(',')[0]}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default ExperiencesAISection;
