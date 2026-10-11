import React from "react";
import { Bell, Ticket, Wallet, ShieldAlert, CheckCheck, Clock } from "lucide-react";
import { api, Notification, UserProfile, HotelOwner } from "../../../services/api";

interface NotificationsPanelProps {
    notifications: Notification[];
    currentUser: UserProfile | HotelOwner | null;
    reload: () => void;
}

export default function NotificationsPanel({ notifications, currentUser, reload }: NotificationsPanelProps) {
    const unreadNotif = (Array.isArray(notifications) ? notifications : []).filter(n => !n.isRead).length;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-extrabold text-slate-900">Platform Notifications & System Feed</h3>
                    <p className="text-xs text-slate-500">Live operational alerts, booking confirmations, and host actions</p>
                </div>
                {unreadNotif > 0 && currentUser && (
                    <button
                        onClick={async () => {
                            await api.markAllNotificationsRead(currentUser.id);
                            reload();
                        }}
                        className="text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition px-3.5 py-2 rounded-xl border border-indigo-200 flex items-center gap-1.5 shadow-xs"
                    >
                        <CheckCheck className="w-4 h-4" />
                        <span>Mark All as Read ({unreadNotif})</span>
                    </button>
                )}
            </div>

            {/* Notification List */}
            <div className="grid grid-cols-1 gap-3">
                {notifications.map(n => (
                    <div
                        key={n.id}
                        className={`group flex items-start gap-4 p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                            n.isRead
                                ? "bg-white border-slate-200/80 hover:bg-slate-50/70"
                                : "bg-indigo-50/40 border-indigo-200/80 shadow-xs hover:bg-indigo-50/70"
                        }`}
                        onClick={async () => {
                            if (!n.isRead) {
                                await api.markNotificationRead(n.id);
                                reload();
                            }
                        }}
                    >
                        <div
                            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                                n.isRead
                                    ? "bg-slate-100 text-slate-600 border-slate-200"
                                    : "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                            }`}
                        >
                            {n.type === "BOOKING" ? (
                                <Ticket className="w-5 h-5" />
                            ) : n.type === "PAYMENT" ? (
                                <Wallet className="w-5 h-5" />
                            ) : n.type === "COMPLAINT" ? (
                                <ShieldAlert className="w-5 h-5" />
                            ) : (
                                <Bell className="w-5 h-5" />
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                                <h4
                                    className={`text-xs md:text-sm font-bold truncate ${
                                        n.isRead ? "text-slate-800" : "text-indigo-950 font-extrabold"
                                    }`}
                                >
                                    {n.title}
                                </h4>
                                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1 shrink-0">
                                    <Clock className="w-3 h-3" />
                                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <p className="text-xs text-slate-600 font-medium leading-relaxed">
                                {n.message}
                            </p>
                        </div>

                        {!n.isRead && (
                            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 shrink-0 self-center" />
                        )}
                    </div>
                ))}

                {notifications.length === 0 && (
                    <div className="py-24 text-center bg-white rounded-3xl border border-slate-200/90">
                        <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <h4 className="text-sm font-extrabold text-slate-900">No New Notifications</h4>
                        <p className="text-xs text-slate-400 mt-0.5">Platform feeds and alerts will show up here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
