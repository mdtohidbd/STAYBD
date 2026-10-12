import React, { isValidElement, cloneElement, useMemo } from 'react';
import { Loader2, TrendingUp, TrendingDown, Minus } from 'lucide-react';

/* ────── Mini Sparkline SVG (auto-generated from value) ────── */
function MiniSparkline({ value, color }: { value: number | string; color: string }) {
    const numVal = typeof value === 'string' ? parseInt(value.replace(/[^\d]/g, '')) || 0 : value;
    const points = useMemo(() => {
        const seed = numVal % 100;
        const pts = [];
        for (let i = 0; i < 7; i++) {
            const y = 20 + Math.sin((seed + i * 37) * 0.1) * 12 + Math.cos((seed + i * 23) * 0.15) * 8;
            pts.push(`${i * 12},${Math.max(4, Math.min(36, y))}`);
        }
        return pts.join(' ');
    }, [numVal]);

    const sparkColors: Record<string, string> = {
        indigo: '#6366f1',
        purple: '#a855f7',
        blue: '#3b82f6',
        emerald: '#10b981',
        green: '#10b981',
        amber: '#f59e0b',
        rose: '#f43f5e',
    };
    const strokeColor = sparkColors[color] || sparkColors.indigo;

    return (
        <svg width="72" height="40" viewBox="0 0 72 40" className="opacity-40 group-hover:opacity-70 transition-opacity duration-500">
            <defs>
                <linearGradient id={`spark-${color}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
                </linearGradient>
            </defs>
            <polyline
                fill="none"
                stroke={strokeColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
            />
            <polyline
                fill={`url(#spark-${color})`}
                stroke="none"
                points={`0,40 ${points} 72,40`}
            />
        </svg>
    );
}

/* ────── Premium StatCard ────── */
export function StatCard({ title, label, value, icon, trend, subLabel, color = "indigo", trendValue }: any) {
    const cardTitle = label || title || "";
    const cardSub = subLabel || trend || "";

    const colorConfig: Record<string, { bg: string; border: string; iconBg: string; valueText: string; badge: string; glow: string }> = {
        indigo: {
            bg: "bg-white",
            border: "border-slate-200/90 hover:border-indigo-300/80",
            iconBg: "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/25",
            valueText: "text-slate-900",
            badge: "bg-indigo-50 text-indigo-700 border-indigo-100",
            glow: "from-indigo-500/5"
        },
        purple: {
            bg: "bg-white",
            border: "border-slate-200/90 hover:border-purple-300/80",
            iconBg: "bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25",
            valueText: "text-slate-900",
            badge: "bg-purple-50 text-purple-700 border-purple-100",
            glow: "from-purple-500/5"
        },
        blue: {
            bg: "bg-white",
            border: "border-slate-200/90 hover:border-blue-300/80",
            iconBg: "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25",
            valueText: "text-slate-900",
            badge: "bg-blue-50 text-blue-700 border-blue-100",
            glow: "from-blue-500/5"
        },
        emerald: {
            bg: "bg-white",
            border: "border-slate-200/90 hover:border-emerald-300/80",
            iconBg: "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25",
            valueText: "text-emerald-700",
            badge: "bg-emerald-50 text-emerald-700 border-emerald-100",
            glow: "from-emerald-500/5"
        },
        green: {
            bg: "bg-white",
            border: "border-slate-200/90 hover:border-emerald-300/80",
            iconBg: "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25",
            valueText: "text-emerald-700",
            badge: "bg-emerald-50 text-emerald-700 border-emerald-100",
            glow: "from-emerald-500/5"
        },
        amber: {
            bg: "bg-white",
            border: "border-slate-200/90 hover:border-amber-300/80",
            iconBg: "bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/25",
            valueText: "text-slate-900",
            badge: "bg-amber-50 text-amber-700 border-amber-100",
            glow: "from-amber-500/5"
        },
        rose: {
            bg: "bg-white",
            border: "border-slate-200/90 hover:border-rose-300/80",
            iconBg: "bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/25",
            valueText: "text-slate-900",
            badge: "bg-rose-50 text-rose-700 border-rose-100",
            glow: "from-rose-500/5"
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
        <div className={`${cfg.bg} border ${cfg.border} rounded-[24px] p-5 relative overflow-hidden group hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-500 shadow-[0_1px_3px_rgba(0,0,0,0.04)]`}>
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-3.5">
                    <div className={`w-11 h-11 rounded-xl ${cfg.iconBg} flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                        {renderIcon()}
                    </div>
                    {cardSub && (
                        <span className={`text-[9px] font-black ${cfg.badge} border px-2.5 py-0.5 rounded-full uppercase tracking-wider`}>
                            {cardSub}
                        </span>
                    )}
                </div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{cardTitle}</p>
                <div className="flex items-end justify-between gap-2">
                    <h3 className={`text-2xl lg:text-[28px] font-black ${cfg.valueText} tracking-tight tabular-nums leading-none`}>{value}</h3>
                    <MiniSparkline value={value} color={color} />
                </div>
            </div>
            {/* Premium glow effect */}
            <div className={`absolute -top-8 -right-8 w-28 h-28 bg-gradient-to-br ${cfg.glow} to-transparent rounded-full pointer-events-none blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-10 transition-opacity" />
        </div>
    );
}

/* ────── Premium Badge ────── */
export function Badge({ children, color = "indigo", dot = false }: { children: React.ReactNode; color?: string; dot?: boolean }) {
    const colors: Record<string, string> = {
        indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
        blue: "bg-blue-50 text-blue-700 border-blue-200",
        emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
        green: "bg-emerald-50 text-emerald-700 border-emerald-200",
        amber: "bg-amber-50 text-amber-700 border-amber-200",
        rose: "bg-rose-50 text-rose-700 border-rose-200",
        slate: "bg-slate-100 text-slate-700 border-slate-200",
    };

    const dotColors: Record<string, string> = {
        indigo: "bg-indigo-500",
        blue: "bg-blue-500",
        emerald: "bg-emerald-500",
        green: "bg-emerald-500",
        amber: "bg-amber-500",
        rose: "bg-rose-500",
        slate: "bg-slate-500",
    };

    return (
        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${colors[color] || colors.indigo} inline-flex items-center gap-1.5`}>
            {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[color] || dotColors.indigo} animate-pulse`} />}
            {children}
        </span>
    );
}

/* ────── Premium Loading State ────── */
export function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[500px] gap-5 animate-in fade-in zoom-in duration-700">
            <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-indigo-500/30">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
                {/* Pulse rings */}
                <div className="absolute inset-0 rounded-2xl border-2 border-indigo-400/30 animate-ping" />
                <div className="absolute -inset-3 rounded-3xl border border-indigo-300/10 animate-pulse" />
            </div>
            <div className="text-center">
                <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">Loading Dashboard</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1.5">Connecting to property management server...</p>
            </div>
        </div>
    );
}
