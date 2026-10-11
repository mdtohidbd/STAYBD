import React, { isValidElement, cloneElement } from 'react';
import { Loader2 } from 'lucide-react';

export function StatCard({ title, label, value, icon, trend, subLabel, color = "indigo" }: any) {
    const cardTitle = label || title || "";
    const cardSub = subLabel || trend || "";

    const colorConfig: Record<string, { bg: string; border: string; iconBg: string; valueText: string; badge: string }> = {
        indigo: {
            bg: "bg-white",
            border: "border-slate-200/90 hover:border-indigo-300",
            iconBg: "bg-indigo-50 text-indigo-600",
            valueText: "text-slate-900",
            badge: "bg-indigo-50 text-indigo-700 border-indigo-100"
        },
        purple: {
            bg: "bg-white",
            border: "border-slate-200/90 hover:border-purple-300",
            iconBg: "bg-purple-50 text-purple-600",
            valueText: "text-slate-900",
            badge: "bg-purple-50 text-purple-700 border-purple-100"
        },
        blue: {
            bg: "bg-white",
            border: "border-slate-200/90 hover:border-blue-300",
            iconBg: "bg-blue-50 text-blue-600",
            valueText: "text-slate-900",
            badge: "bg-blue-50 text-blue-700 border-blue-100"
        },
        emerald: {
            bg: "bg-white",
            border: "border-slate-200/90 hover:border-emerald-300",
            iconBg: "bg-emerald-50 text-emerald-600",
            valueText: "text-emerald-700",
            badge: "bg-emerald-50 text-emerald-700 border-emerald-100"
        },
        green: {
            bg: "bg-white",
            border: "border-slate-200/90 hover:border-emerald-300",
            iconBg: "bg-emerald-50 text-emerald-600",
            valueText: "text-emerald-700",
            badge: "bg-emerald-50 text-emerald-700 border-emerald-100"
        },
        amber: {
            bg: "bg-white",
            border: "border-slate-200/90 hover:border-amber-300",
            iconBg: "bg-amber-50 text-amber-600",
            valueText: "text-slate-900",
            badge: "bg-amber-50 text-amber-700 border-amber-100"
        },
        rose: {
            bg: "bg-white",
            border: "border-slate-200/90 hover:border-rose-300",
            iconBg: "bg-rose-50 text-rose-600",
            valueText: "text-slate-900",
            badge: "bg-rose-50 text-rose-700 border-rose-100"
        },
    };

    const cfg = colorConfig[color] || colorConfig.indigo;

    const renderIcon = () => {
        if (!icon) return null;
        if (isValidElement(icon)) {
            return cloneElement(icon as React.ReactElement<any>, {
                className: ((icon as any).props?.className) || "w-5 h-5"
            });
        }
        if (typeof icon === 'function') {
            const IconComponent = icon;
            return <IconComponent className="w-5 h-5" />;
        }
        return null;
    };

    return (
        <div className={`${cfg.bg} border ${cfg.border} rounded-[28px] p-6 relative overflow-hidden group hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 shadow-sm`}>
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 rounded-2xl ${cfg.iconBg} flex items-center justify-center transition-transform group-hover:scale-110 shadow-xs`}>
                        {renderIcon()}
                    </div>
                    {cardSub && (
                        <span className={`text-[10px] font-black ${cfg.badge} border px-3 py-1 rounded-full uppercase tracking-wider`}>
                            {cardSub}
                        </span>
                    )}
                </div>
                <p className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5">{cardTitle}</p>
                <h3 className={`text-2xl lg:text-3xl font-black ${cfg.valueText} tracking-tight tabular-nums`}>{value}</h3>
            </div>
            <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-full pointer-events-none" />
        </div>
    );
}

export function Badge({ children, color = "indigo" }: { children: React.ReactNode; color?: string }) {
    const colors: Record<string, string> = {
        indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
        blue: "bg-blue-50 text-blue-700 border-blue-200",
        emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
        green: "bg-emerald-50 text-emerald-700 border-emerald-200",
        amber: "bg-amber-50 text-amber-700 border-amber-200",
        rose: "bg-rose-50 text-rose-700 border-rose-200",
        slate: "bg-slate-100 text-slate-700 border-slate-200",
    };

    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${colors[color] || colors.indigo} inline-flex items-center gap-1 shadow-2xs`}>
            {children}
        </span>
    );
}

export function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 animate-in fade-in zoom-in duration-500">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center shadow-md shadow-indigo-100">
                <Loader2 className="w-7 h-7 text-indigo-600 animate-spin" />
            </div>
            <div className="text-center">
                <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">Syncing Terminal</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Connecting to property server...</p>
            </div>
        </div>
    );
}
