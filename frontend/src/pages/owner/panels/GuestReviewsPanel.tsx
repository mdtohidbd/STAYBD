import React, { useState, useMemo } from "react";
import {
  Star, MessageSquare, ThumbsUp, CheckCircle2, Search,
  Filter, ShieldCheck, Send, Sparkles, User, Award, CornerDownRight
} from "lucide-react";
import { Hotel } from "../../../services/api";
import { Badge } from "../components/Shared";

interface ReviewItem {
  id: string;
  guestName: string;
  guestLocation: string;
  roomType: string;
  stayDate: string;
  rating: number;
  title: string;
  comment: string;
  tags: string[];
  isVerified: boolean;
  managementReply?: string;
  replyDate?: string;
}

interface GuestReviewsPanelProps {
  hotel: Hotel;
}

export default function GuestReviewsPanel({ hotel }: GuestReviewsPanelProps) {
  const [filterRating, setFilterRating] = useState<number | "ALL">("ALL");
  const [onlyUnreplied, setOnlyUnreplied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyInputText, setReplyInputText] = useState("");

  const storageKey = `sb_hotel_reviews_${hotel.id}`;

  // Default initial reviews with realistic guest reviews for Bangladesh hotels
  const defaultReviews: ReviewItem[] = useMemo(() => [
    {
      id: "rev-1",
      guestName: "Mahmudur Rahman",
      guestLocation: "Dhaka, Bangladesh",
      roomType: "Executive Deluxe Ocean Suite",
      stayDate: "October 2026",
      rating: 5,
      title: "Unmatched sunrise view and exceptional hospitality!",
      comment: "The direct panoramic ocean balcony was mesmerizing. Housekeeping visited twice daily and kept the suite spotless. The breakfast buffet with fresh parathas and seafood was world class.",
      tags: ["Ocean View", "Spotless Clean", "Buffet Breakfast"],
      isVerified: true,
      managementReply: "Thank you Mahmudur! It was an absolute delight hosting you. We are thrilled that you loved the sunrise view from the suite. Looking forward to welcoming you again!",
      replyDate: "2 days ago"
    },
    {
      id: "rev-2",
      guestName: "Sadia Afrin",
      guestLocation: "Chittagong",
      roomType: "Deluxe King Room",
      stayDate: "October 2026",
      rating: 5,
      title: "Super smooth check-in & comfortable mattress",
      comment: "Front desk staff was extremely courteous and accommodated our early arrival request without fuss. The room temperature control was great and Wi-Fi speed was blazing fast for remote work.",
      tags: ["Fast Check-in", "High Speed Wi-Fi", "Quiet"],
      isVerified: true
    },
    {
      id: "rev-3",
      guestName: "Engr. Kamal Hossain",
      guestLocation: "Sylhet",
      roomType: "Presidential Family Suite",
      stayDate: "September 2026",
      rating: 4,
      title: "Spacious suite for family, loved the beach shuttle",
      comment: "The rooms are expansive and very clean. My kids enjoyed the private pool and garden lawn. Room service took around 25 minutes for dinner, but the grilled pomfret made up for it.",
      tags: ["Family Friendly", "Swimming Pool", "Seafood Grill"],
      isVerified: true,
      managementReply: "Warm regards Kamal! Thank you for the thoughtful feedback. We have since added dedicated kitchen runners during peak dinner hours to reduce service time.",
      replyDate: "1 week ago"
    },
    {
      id: "rev-4",
      guestName: "Dr. Farhana Islam",
      guestLocation: "Dhaka",
      roomType: "Ocean Deluxe Double",
      stayDate: "September 2026",
      rating: 5,
      title: "A true sanctuary by the beach",
      comment: "Anticipated a crowded resort but found tranquility. The bed linen smelled crisp and fresh. Security and front desk assistance 24/7 made me feel completely safe throughout the solo stay.",
      tags: ["High Security", "Peaceful", "Linen Quality"],
      isVerified: true
    }
  ], []);

  // State with localStorage support for owner replies
  const [reviews, setReviews] = useState<ReviewItem[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) { }
    return defaultReviews;
  });

  const handleSendReply = (reviewId: string) => {
    if (!replyInputText.trim()) return;

    const updated = reviews.map(r => {
      if (r.id === reviewId) {
        return {
          ...r,
          managementReply: replyInputText.trim(),
          replyDate: "Just now"
        };
      }
      return r;
    });

    setReviews(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    setReplyInputText("");
    setActiveReplyId(null);
  };

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter(r => {
      if (filterRating !== "ALL" && r.rating !== filterRating) return false;
      if (onlyUnreplied && r.managementReply) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = r.guestName.toLowerCase().includes(q);
        const matchesComment = r.comment.toLowerCase().includes(q);
        const matchesRoom = r.roomType.toLowerCase().includes(q);
        if (!matchesName && !matchesComment && !matchesRoom) return false;
      }
      return true;
    });
  }, [reviews, filterRating, onlyUnreplied, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* ───── REPUTATION OVERVIEW BANNER ───── */}
      <div className="bg-white rounded-[32px] p-6 md:p-8 border border-slate-200/90 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
                <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight uppercase">
                    Guest Reviews & Reputation Radar
                  </h2>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Guest Feedback
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Monitor public guest ratings, sentiment analysis, and publish verified owner replies
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 px-5 py-3 rounded-2xl">
            <div className="text-center">
              <p className="text-3xl font-black text-slate-900 tabular-nums leading-none">
                4.9<span className="text-sm text-slate-400 font-bold">/5</span>
              </p>
              <div className="flex items-center gap-0.5 justify-center mt-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Overall Rating</p>
              <p className="text-xs font-black text-emerald-700 uppercase">Superb Hospitality</p>
              <p className="text-[9px] text-slate-400 font-semibold mt-0.5">{reviews.length} Verified Reviews</p>
            </div>
          </div>
        </div>

        {/* ───── SCORE RADAR METRICS ───── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-6">
          {[
            { label: "Cleanliness", score: "4.9", percent: 98, color: "emerald" },
            { label: "Staff Hospitality", score: "4.9", percent: 98, color: "indigo" },
            { label: "Room Comfort", score: "4.8", percent: 96, color: "purple" },
            { label: "Location & Views", score: "5.0", percent: 100, color: "blue" },
            { label: "Value for Money", score: "4.7", percent: 94, color: "amber" },
          ].map((cat, i) => (
            <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">{cat.label}</span>
                <span className="text-xs font-black text-slate-900 tabular-nums">{cat.score}</span>
              </div>
              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full"
                  style={{ width: `${cat.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ───── FILTER BAR ───── */}
      <div className="bg-white rounded-[28px] p-4 border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setFilterRating("ALL")}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition ${filterRating === "ALL" && !onlyUnreplied
              ? "bg-white text-indigo-700 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
              }`}
          >
            All Reviews
          </button>
          {[5, 4, 3].map(stars => (
            <button
              key={stars}
              onClick={() => { setFilterRating(stars); setOnlyUnreplied(false); }}
              className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center gap-1 ${filterRating === stars && !onlyUnreplied
                ? "bg-white text-indigo-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
                }`}
            >
              <span>{stars}</span>
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            </button>
          ))}
          <button
            onClick={() => setOnlyUnreplied(!onlyUnreplied)}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition ${onlyUnreplied
              ? "bg-amber-600 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900"
              }`}
          >
            Needs Reply ({reviews.filter(r => !r.managementReply).length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search review content or guest..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-bold text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      {/* ───── REVIEWS LIST ───── */}
      <div className="space-y-4">
        {filteredReviews.map(r => (
          <div
            key={r.id}
            className="bg-white rounded-[28px] border border-slate-200/90 p-6 md:p-8 shadow-sm hover:shadow-md transition space-y-4"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm uppercase shadow-sm">
                  {r.guestName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-black text-slate-900 text-sm">{r.guestName}</p>
                    {r.isVerified && (
                      <span className="text-[9px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Stay
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                    {r.guestLocation} · Stayed in <span className="font-bold text-slate-800">{r.roomType}</span> ({r.stayDate})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 self-start sm:self-center">
                <div className="flex items-center gap-0.5 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-xs font-black text-amber-800 ml-1">{r.rating}.0</span>
                </div>
              </div>
            </div>

            {/* Title & Comment */}
            <div>
              <h4 className="text-sm font-black text-slate-900 tracking-tight mb-1">{r.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">{r.comment}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-1">
              {r.tags.map((t, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200/80 px-2.5 py-1 rounded-lg"
                >
                  #{t}
                </span>
              ))}
            </div>

            {/* Management Reply Section */}
            {r.managementReply ? (
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 mt-4 flex items-start gap-3">
                <CornerDownRight className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[11px] font-black text-indigo-900 uppercase tracking-wider">
                      Response from Property Management ({hotel.name})
                    </p>
                    <span className="text-[10px] text-indigo-400 font-bold">{r.replyDate || "Verified"}</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {r.managementReply}
                  </p>
                </div>
              </div>
            ) : (
              <div className="pt-2">
                {activeReplyId === r.id ? (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in">
                    <p className="text-[10px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                      Publish Management Response
                    </p>
                    <textarea
                      rows={3}
                      value={replyInputText}
                      onChange={e => setReplyInputText(e.target.value)}
                      placeholder={`Dear ${r.guestName.split(" ")[0]}, thank you for your kind words...`}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => { setActiveReplyId(null); setReplyInputText(""); }}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSendReply(r.id)}
                        className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider transition shadow-sm active:scale-95 flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" /> Submit Response
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => { setActiveReplyId(r.id); setReplyInputText(""); }}
                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-600 hover:text-indigo-800 transition py-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Reply as Property Manager
                  </button>
                )}
              </div>
            )}
          </div>
        ))}

        {filteredReviews.length === 0 && (
          <div className="bg-white rounded-[32px] p-16 text-center border border-slate-200/90 text-slate-400">
            <Star className="w-12 h-12 mx-auto mb-3 opacity-30 text-amber-400" />
            <p className="text-xs font-black uppercase tracking-wider text-slate-700">No reviews match filter criteria</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting the star rating or search query.</p>
          </div>
        )}
      </div>

    </div>
  );
}
