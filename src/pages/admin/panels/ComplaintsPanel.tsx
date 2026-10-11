import React, { useState } from "react";
import {
    ShieldAlert,
    AlertCircle,
    CheckCircle2,
    Clock,
    Building2,
    Calendar,
    ExternalLink,
    Filter
} from "lucide-react";
import { api, Complaint } from "../../../services/api";
import { Badge } from "../components/AdminUIElements";

interface ComplaintsPanelProps {
    complaints: Complaint[];
    reload: () => void;
}

export default function ComplaintsPanel({ complaints, reload }: ComplaintsPanelProps) {
    const [statusFilter, setStatusFilter] = useState<string>("ALL");

    const filtered = complaints.filter(c => {
        if (statusFilter === "ALL") return true;
        return c.status === statusFilter;
    });

    const pendingCount = complaints.filter(c => c.status === "Pending").length;
    const inProgressCount = complaints.filter(c => c.status === "In Progress").length;
    const resolvedCount = complaints.filter(c => c.status === "Resolved").length;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Top Stat Row & Filters */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center">
                        <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-sm font-extrabold text-slate-900">Guest Support & Dispute Resolution</h3>
                        <p className="text-xs text-slate-500">Supervise customer feedback, hotel disputes, and service issues</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
                    {[
                        { id: "ALL", label: `All (${complaints.length})` },
                        { id: "Pending", label: `Pending (${pendingCount})` },
                        { id: "In Progress", label: `In Progress (${inProgressCount})` },
                        { id: "Resolved", label: `Resolved (${resolvedCount})` },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setStatusFilter(tab.id)}
                            className={`px-3 py-1.5 rounded-lg transition ${
                                statusFilter === tab.id
                                    ? "bg-indigo-600 text-white shadow-xs"
                                    : "text-slate-600 hover:text-slate-900"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Complaints Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filtered.map(c => (
                    <div
                        key={c.id}
                        className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                    >
                        <div>
                            {/* Card Header */}
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-sm">
                                        {c.userName ? c.userName.charAt(0).toUpperCase() : "G"}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-extrabold text-slate-900">{c.userName || "Anonymous Guest"}</h4>
                                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                            <Building2 className="w-3 h-3 text-slate-400" />
                                            <span>{c.hotelName}</span>
                                        </p>
                                    </div>
                                </div>

                                <Badge
                                    color={
                                        c.status === "Pending"
                                            ? "amber"
                                            : c.status === "In Progress"
                                            ? "blue"
                                            : "green"
                                    }
                                >
                                    {c.status}
                                </Badge>
                            </div>

                            {/* Date */}
                            <p className="text-[11px] text-slate-400 flex items-center gap-1 mb-3">
                                <Calendar className="w-3 h-3" />
                                <span>Filed: {new Date(c.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </p>

                            {/* Description */}
                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-4">
                                <p className="text-xs text-slate-700 font-medium leading-relaxed italic">
                                    "{c.description}"
                                </p>
                            </div>

                            {/* Attached Image Evidence */}
                            {c.imageUrl && (
                                <div className="mb-4 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider p-2">Evidence Photo</p>
                                    <img src={c.imageUrl} alt="Complaint Evidence" className="w-full h-44 object-cover" />
                                </div>
                            )}
                        </div>

                        {/* Card Actions Footer */}
                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[11px] font-mono text-slate-400">
                                Ticket #{c.id.slice(-6)}
                            </span>

                            <div className="flex items-center gap-2">
                                {c.status !== "Resolved" ? (
                                    <>
                                        {c.status === "Pending" && (
                                            <button
                                                onClick={async () => {
                                                    await api.updateComplaintStatus(c.id, "In Progress");
                                                    reload();
                                                }}
                                                className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold transition border border-indigo-200"
                                            >
                                                Investigate
                                            </button>
                                        )}
                                        <button
                                            onClick={async () => {
                                                await api.updateComplaintStatus(c.id, "Resolved");
                                                reload();
                                            }}
                                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
                                        >
                                            Mark Resolved
                                        </button>
                                    </>
                                ) : (
                                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                                        <CheckCircle2 className="w-4 h-4" /> Issue Closed
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-slate-200/90">
                        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                        <h4 className="text-base font-extrabold text-slate-900">All Clear! No Active Tickets</h4>
                        <p className="text-xs text-slate-500 mt-1">
                            No complaints currently match the selected filter.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
