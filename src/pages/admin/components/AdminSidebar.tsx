import React from "react";
import { Shield, Plus, RefreshCw, ExternalLink, LogOut, Sparkles } from "lucide-react";

type Tab = "stats" | "users" | "hotels" | "bookings" | "complaints" | "notifications" | "experiences" | "spots";

interface TabNavItem {
    id: Tab;
    label: string;
    icon: React.ReactNode;
    badge?: number;
}

interface AdminSidebarProps {
    tab: Tab;
    setTab: (tab: Tab) => void;
    isSidebarOpen: boolean;
    setIsSidebarOpen: (open: boolean) => void;
    tabNav: TabNavItem[];
    setShowAddOwner: (show: boolean) => void;
    reload: () => void;
    currentUser?: any;
}

export default function AdminSidebar({
    tab,
    setTab,
    isSidebarOpen,
    setIsSidebarOpen,
    tabNav,
    setShowAddOwner,
    reload,
    currentUser
}: AdminSidebarProps) {
    const handleLogout = () => {
        if (window.confirm("Are you sure you want to log out of the admin panel?")) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            window.location.href = '/admin/login';
        }
    };

    return (
        <aside
            className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200/90 z-50 flex flex-col transition-transform duration-300 ${
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } md:translate-x-0 shadow-lg md:shadow-sm`}
        >
            {/* Brand Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-700 flex items-center justify-center shadow-md shadow-indigo-600/20 text-white">
                        <Shield className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-slate-900 text-base tracking-tight">StayBD</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                                Pro
                            </span>
                        </div>
                        <p className="text-[11px] font-medium text-slate-500">Super Admin Portal</p>
                    </div>
                </div>
            </div>

            {/* Navigation items */}
            <div className="px-4 py-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-2">
                    Management Core
                </p>
            </div>
            <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
                {tabNav.map((item) => {
                    const isActive = tab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => {
                                setTab(item.id);
                                setIsSidebarOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                                isActive
                                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                            }`}
                        >
                            <span className={isActive ? "text-white" : "text-slate-500"}>
                                {item.icon}
                            </span>
                            <span className="flex-1 text-left">{item.label}</span>
                            {Boolean(item.badge && item.badge > 0) && (
                                <span
                                    className={`px-2 py-0.5 text-[11px] font-bold rounded-full ${
                                        isActive
                                            ? "bg-white text-indigo-700"
                                            : item.id === "complaints"
                                            ? "bg-rose-100 text-rose-700"
                                            : "bg-indigo-100 text-indigo-700"
                                    }`}
                                >
                                    {item.badge}
                                </span>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Quick Actions & Footer */}
            <div className="p-4 border-t border-slate-100 space-y-2 bg-slate-50/50">
                <button
                    onClick={() => {
                        setTab("users");
                        setShowAddOwner(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-sm shadow-indigo-600/20 active:scale-98"
                >
                    <Plus className="w-4 h-4" /> Register New Owner
                </button>

                <div className="flex items-center gap-1.5 pt-1">
                    <a
                        href="/"
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 text-slate-600 hover:text-indigo-600 hover:bg-white text-xs font-semibold py-2 px-2 rounded-lg border border-slate-200 transition bg-white/60 shadow-xs"
                    >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Public Site</span>
                    </a>

                    <button
                        onClick={reload}
                        title="Reload live data"
                        className="flex items-center justify-center p-2 text-slate-600 hover:text-indigo-600 hover:bg-white rounded-lg border border-slate-200 transition bg-white/60 shadow-xs"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Admin Profile Pill */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-200/60 mt-2">
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "A"}
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">
                                {currentUser?.name || "Super Admin"}
                            </p>
                            <p className="text-[10px] text-slate-500 truncate">
                                {currentUser?.email || "admin@staybuddy.com"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        title="Log out"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </aside>
    );
}
