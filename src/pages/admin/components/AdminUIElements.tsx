import React from "react";
import { Loader2 } from "lucide-react";

export function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
            <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 flex items-center justify-center shadow-inner">
                    <Loader2 className="w-7 h-7 animate-spin text-indigo-600" />
                </div>
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-700 tracking-wide">
                Loading Super Admin Portal...
            </p>
            <p className="text-xs text-slate-400 mt-1">Connecting to live cloud services</p>
        </div>
    );
}

export function StatCard({ label, value, color, icon, subLabel, alert }: {
    label: string;
    value: string | number;
    color: string;
    icon: React.ReactNode;
    subLabel?: string;
    alert?: boolean
}) {
    const iconColors: Record<string, { bg: string; text: string; border: string; ring: string }> = {
        indigo: { bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-100", ring: "ring-indigo-500/10" },
        purple: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-100", ring: "ring-purple-500/10" },
        emerald: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100", ring: "ring-emerald-500/10" },
        green: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100", ring: "ring-emerald-500/10" },
        amber: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100", ring: "ring-amber-500/10" },
        blue: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100", ring: "ring-blue-500/10" },
        red: { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-100", ring: "ring-rose-500/10" },
        slate: { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200", ring: "ring-slate-500/10" },
    };

    const scheme = iconColors[color] ?? iconColors.slate;

    return (
        <div className={`relative group bg-white rounded-2xl p-6 border border-slate-200/90 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] hover:shadow-lg hover:border-slate-300 transition-all duration-300 hover:-translate-y-0.5 ${alert ? 'ring-2 ring-rose-400/30' : ''}`}>
            <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl ${scheme.bg} ${scheme.border} border flex items-center justify-center ${scheme.text} shadow-sm group-hover:scale-105 transition-transform`}>
                    {icon}
                </div>
                <div className="text-right">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
                    <h4 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">{value}</h4>
                </div>
            </div>

            {subLabel && (
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${color === 'red' ? 'bg-rose-500' : color === 'amber' ? 'bg-amber-500' : 'bg-emerald-500'} ${alert ? 'animate-ping' : ''}`} />
                        <span className="font-medium text-slate-600">{subLabel}</span>
                    </div>
                    {alert && (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                            Action Needed
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}

export function Badge({ children, color }: { children: React.ReactNode; color: string }) {
    const colors: Record<string, string> = {
        green: "bg-emerald-50 text-emerald-700 border-emerald-200/90 font-semibold",
        emerald: "bg-emerald-50 text-emerald-700 border-emerald-200/90 font-semibold",
        red: "bg-rose-50 text-rose-700 border-rose-200/90 font-semibold",
        amber: "bg-amber-50 text-amber-700 border-amber-200/90 font-semibold",
        blue: "bg-blue-50 text-blue-700 border-blue-200/90 font-semibold",
        indigo: "bg-indigo-50 text-indigo-700 border-indigo-200/90 font-semibold",
        purple: "bg-purple-50 text-purple-700 border-purple-200/90 font-semibold",
        slate: "bg-slate-100 text-slate-700 border-slate-200 font-semibold",
    };
    return (
        <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-md border text-[11px] font-semibold tracking-wide transition-colors ${colors[color] ?? colors.slate}`}>
            {children}
        </span>
    );
}

export function ActionBtn({ onClick, color, icon, label }: { onClick: () => void; color: string; icon: React.ReactNode; label: string }) {
    const colors: Record<string, string> = {
        green: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20 active:bg-emerald-800",
        emerald: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20 active:bg-emerald-800",
        red: "bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-600/20 active:bg-rose-800",
        amber: "bg-amber-600 hover:bg-amber-700 text-white shadow-sm shadow-amber-600/20 active:bg-amber-800",
        blue: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/20 active:bg-indigo-800",
        slate: "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 active:bg-slate-300",
    };
    return (
        <button
            onClick={onClick}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-150 hover:shadow active:scale-95 ${colors[color] ?? colors.slate}`}
        >
            {icon} <span>{label}</span>
        </button>
    );
}
