import React, { useEffect, useState } from "react";
import { Menu, Search, Download, Bell, Activity, Clock } from "lucide-react";

interface AdminTopBarProps {
    setIsSidebarOpen: (open: boolean) => void;
    activeTabLabel?: string;
    onExport?: () => void;
    unreadCount?: number;
    onNotificationClick?: () => void;
}

export default function AdminTopBar({
    setIsSidebarOpen,
    activeTabLabel = "Dashboard",
    onExport,
    unreadCount = 0,
    onNotificationClick,
}: AdminTopBarProps) {
    const [currentTime, setCurrentTime] = useState<string>("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(
                now.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                })
            );
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-8 py-3.5 mb-6 -mx-4 md:-mx-10 transition-all">
            <div className="flex items-center justify-between gap-4">
                {/* Mobile Menu & Page Title */}
                <div className="flex items-center gap-3">
                    <button
                        className="md:hidden p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 transition"
                        onClick={() => setIsSidebarOpen(true)}
                        aria-label="Open Navigation"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-400">Admin</span>
                            <span className="text-xs text-slate-300">/</span>
                            <span className="text-sm font-bold text-slate-800">{activeTabLabel}</span>
                        </div>
                        <h1 className="text-lg md:text-xl font-extrabold text-slate-900 tracking-tight leading-tight hidden sm:block">
                            StayBD National Oversight
                        </h1>
                    </div>
                </div>

                {/* Right side controls */}
                <div className="flex items-center gap-2.5 sm:gap-4">
                    {/* Live Clock (BST) */}
                    <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-600">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>BST: {currentTime}</span>
                    </div>

                    {/* Server status */}
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-semibold">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span>API Live & Connected</span>
                    </div>

                    {/* Export Action */}
                    {onExport && (
                        <button
                            onClick={onExport}
                            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition shadow-xs"
                            title="Export current view to CSV"
                        >
                            <Download className="w-3.5 h-3.5 text-slate-500" />
                            <span>Export Data</span>
                        </button>
                    )}

                    {/* Notifications Button */}
                    <button
                        onClick={onNotificationClick}
                        className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                        title="View notifications"
                    >
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
}
