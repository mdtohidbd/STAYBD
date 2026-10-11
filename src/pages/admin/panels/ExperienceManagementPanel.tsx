import React, { useState } from "react";
import { Star, Trash2, Ban, Search, MapPin, Clock, Compass } from "lucide-react";
import { api, ExperienceCard, UserProfile, HotelOwner } from "../../../services/api";
import { Badge, ActionBtn } from "../components/AdminUIElements";

interface ExperienceManagementPanelProps {
    experiences: ExperienceCard[];
    userList: (UserProfile | HotelOwner)[];
    reload: () => void;
}

export default function ExperienceManagementPanel({ experiences, userList, reload }: ExperienceManagementPanelProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const owners = userList.filter(u => u.role === "OWNER") as HotelOwner[];
    const activeExp = experiences.filter(e => e.isActive).length;

    const filtered = experiences.filter(e => {
        if (!searchTerm) return true;
        return (
            e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.city.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Top Stat Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Experiences & Tours</p>
                        <p className="text-3xl font-black text-slate-900">{experiences.length}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
                        <Compass className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Active Offerings</p>
                        <p className="text-3xl font-black text-emerald-600">
                            {activeExp} <span className="text-xs font-bold text-slate-400">/ {experiences.length} live</span>
                        </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
                        <Star className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Search experiences by title, city..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs md:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                    />
                </div>
                <span className="text-xs font-bold text-slate-500">
                    Showing {filtered.length} of {experiences.length}
                </span>
            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[900px]">
                        <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
                            <tr>
                                <th className="py-4 px-6 text-left">Experience Item</th>
                                <th className="py-4 px-6 text-left">Location & Duration</th>
                                <th className="py-4 px-6 text-center">Status</th>
                                <th className="py-4 px-6 text-right">Price</th>
                                <th className="py-4 px-6 text-right">Moderation Controls</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filtered.map(exp => {
                                const ownerName = owners.find(o => o.id === exp.ownerId)?.name || "StayBD Operator";
                                return (
                                    <tr key={exp.id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs shrink-0">
                                                    <img src={exp.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 text-xs tracking-tight">{exp.title}</p>
                                                    <p className="text-[11px] text-slate-500 mt-0.5">Operator: {ownerName} · ⭐ {exp.rating}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-1 text-slate-800 font-semibold text-xs mb-0.5">
                                                <MapPin className="w-3 h-3 text-indigo-600" />
                                                <span>{exp.city}</span>
                                            </div>
                                            <p className="text-[11px] text-slate-400 flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {exp.duration}
                                            </p>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <Badge color={exp.isActive ? "green" : "red"}>{exp.isActive ? "Active" : "Paused"}</Badge>
                                        </td>
                                        <td className="py-4 px-6 text-right font-black text-slate-900 text-sm">
                                            ৳{exp.price?.toLocaleString()}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex justify-end items-center gap-1.5">
                                                <ActionBtn
                                                    color={exp.isActive ? "slate" : "green"}
                                                    icon={<Ban className="w-3.5 h-3.5" />}
                                                    label={exp.isActive ? "Pause" : "Resume"}
                                                    onClick={async () => { await api.toggleExperienceActive(exp.id); reload(); }}
                                                />
                                                <button
                                                    onClick={async () => {
                                                        if (window.confirm(`Delete experience "${exp.title}"?`)) {
                                                            await api.deleteExperience(exp.id);
                                                            reload();
                                                        }
                                                    }}
                                                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 border border-rose-200 transition"
                                                    title="Delete experience"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-16 text-center">
                                        <Compass className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                                        <p className="text-slate-700 font-bold text-sm">No experiences found</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
