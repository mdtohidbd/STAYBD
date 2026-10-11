import React, { useState } from "react";
import {
    X,
    Ticket,
    LogIn,
    LogOut,
    Ban,
    User,
    Mail,
    Phone,
    Building2,
    Calendar,
    CreditCard,
    Printer,
    Sparkles,
    Briefcase,
    Clock,
    CheckCircle2,
    Check
} from "lucide-react";
import { Booking, api } from "../../../services/api";
import { Badge, ActionBtn } from "./AdminUIElements";

interface BookingDetailModalProps {
    booking: Booking;
    onClose: () => void;
    reload: () => void;
    onInspectGuest?: (guestEmailOrName: string) => void;
}

export default function BookingDetailModal({
    booking,
    onClose,
    reload,
    onInspectGuest
}: BookingDetailModalProps) {
    const [actionLoading, setActionLoading] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(booking.status);

    const handleCheckIn = async () => {
        setActionLoading(true);
        try {
            await api.processCheckIn(booking.id);
            setCurrentStatus("CONFIRMED");
            reload();
        } catch (err: any) {
            alert(err.message || "Failed to process check-in");
        } finally {
            setActionLoading(false);
        }
    };

    const handleCheckOut = async () => {
        setActionLoading(true);
        try {
            await api.processCheckOut(booking.id);
            reload();
        } catch (err: any) {
            alert(err.message || "Failed to process check-out");
        } finally {
            setActionLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!window.confirm(`Are you sure you want to CANCEL booking ${booking.id}? This will restore room inventory.`)) return;

        setActionLoading(true);
        try {
            await api.cancelBooking(booking.id);
            setCurrentStatus("CANCELLED");
            reload();
        } catch (err: any) {
            alert(err.message || "Failed to cancel booking");
        } finally {
            setActionLoading(false);
        }
    };

    const handlePrintVoucher = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs animate-in fade-in duration-200 print:p-0 print:bg-white">
            <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl max-h-[92vh] shadow-2xl overflow-hidden flex flex-col print:border-none print:shadow-none print:max-w-full print:rounded-none">
                {/* Header */}
                <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between gap-4 print:bg-white print:border-b-2">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
                            <Ticket className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-black text-slate-900">
                                    Reservation Voucher
                                </h2>
                                <Badge color={currentStatus === "CONFIRMED" ? "green" : currentStatus === "PENDING" ? "amber" : "red"}>
                                    {currentStatus}
                                </Badge>
                                <Badge color={booking.type === "ONLINE" ? "blue" : "amber"}>
                                    {booking.type}
                                </Badge>
                            </div>
                            <p className="font-mono text-xs font-bold text-indigo-700 mt-0.5">
                                #{booking.id}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 print:hidden">
                        <button
                            onClick={handlePrintVoucher}
                            title="Print Voucher"
                            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition"
                        >
                            <Printer className="w-4 h-4" />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Hotel & Property Banner */}
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-slate-50 border border-indigo-100 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white border border-indigo-100 text-indigo-600 flex items-center justify-center shadow-xs">
                                <Building2 className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-extrabold text-slate-900">{booking.hotelName}</h3>
                                <p className="text-xs font-semibold text-indigo-700">{booking.roomType} {booking.roomNumber ? `· Room #${booking.roomNumber}` : ''}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Duration</span>
                            <span className="text-sm font-black text-slate-800">{booking.nights} Night(s)</span>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* Guest Profile Card */}
                        <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200/90 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                    Guest Identity & Contact
                                </span>
                                {onInspectGuest && (booking.guestEmail || booking.guestName) && (
                                    <button
                                        onClick={() => onInspectGuest(booking.guestEmail || booking.guestName || '')}
                                        className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 underline print:hidden"
                                    >
                                        Inspect User Profile →
                                    </button>
                                )}
                            </div>

                            <div className="space-y-2 text-xs">
                                <div>
                                    <p className="font-extrabold text-slate-900 text-sm">{booking.guestName || "Walk-In Guest"}</p>
                                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                        <span className="text-[10px] font-bold bg-slate-200/80 text-slate-700 px-2 py-0.5 rounded">
                                            {booking.country || "Bangladesh"}
                                        </span>
                                        {booking.bookingFor === "someone" ? (
                                            <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                                                Booking for someone else
                                            </span>
                                        ) : (
                                            <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
                                                Main Guest
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <p className="text-slate-600 flex items-center gap-1.5 pt-1">
                                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                                    <a href={`mailto:${booking.guestEmail}`} className="hover:text-indigo-600 hover:underline">
                                        {booking.guestEmail || "No email on record"}
                                    </a>
                                </p>

                                {booking.guestPhone ? (
                                    <p className="text-slate-800 font-bold flex items-center gap-1.5">
                                        <Phone className="w-3.5 h-3.5 text-indigo-600" />
                                        <a href={`tel:${booking.guestPhone}`} className="hover:text-indigo-600 hover:underline">
                                            {booking.guestPhone}
                                        </a>
                                    </p>
                                ) : (
                                    <p className="text-slate-400 italic">No telephone provided</p>
                                )}
                            </div>
                        </div>

                        {/* Stay Dates Card */}
                        <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200/90 space-y-3">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                                Stay Schedule
                            </span>
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                                    <span className="text-slate-500">Check-In Date</span>
                                    <span className="font-bold text-slate-900">{booking.checkIn}</span>
                                </div>
                                <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                                    <span className="text-slate-500">Check-Out Date</span>
                                    <span className="font-bold text-slate-900">{booking.checkOut}</span>
                                </div>
                                <div className="flex justify-between items-center py-1">
                                    <span className="text-slate-500">Estimated Arrival</span>
                                    <span className="font-medium text-slate-800">{booking.arrivalTime || "Standard Check-In (14:00)"}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3 shadow-xs">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                            Billing & Payment Details
                        </span>

                        <div className="space-y-2 text-xs">
                            <div className="flex justify-between py-1 border-b border-slate-100">
                                <span className="text-slate-500">Payment Channel</span>
                                <span className="font-bold uppercase text-slate-800">{booking.paymentMethod || "CASH AT COUNTER"}</span>
                            </div>

                            {booking.paymentPhone && (
                                <div className="flex justify-between py-1 border-b border-slate-100">
                                    <span className="text-slate-500">Account / Mobile Number</span>
                                    <span className="font-mono font-bold text-slate-800">{booking.paymentPhone}</span>
                                </div>
                            )}

                            {booking.transactionId && (
                                <div className="flex justify-between py-1 border-b border-slate-100">
                                    <span className="text-slate-500">Transaction ID (TrxID)</span>
                                    <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                                        {booking.transactionId}
                                    </span>
                                </div>
                            )}

                            <div className="flex justify-between py-1 border-b border-slate-100">
                                <span className="text-slate-500">Nights Calculated</span>
                                <span className="font-semibold text-slate-700">{booking.nights} night(s)</span>
                            </div>
                            <div className="flex justify-between py-2 text-sm">
                                <span className="font-bold text-slate-800">Total Price Charged</span>
                                <span className="font-black text-emerald-600 text-lg">
                                    ৳{(booking.totalPrice || 0).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Special Requests & Preferences */}
                    {(booking.specialRequests || booking.travelingForWork) && (
                        <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-200/80 space-y-2">
                            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                                <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Guest Preferences & Special Requests
                            </span>
                            {booking.travelingForWork && (
                                <p className="text-xs font-semibold text-purple-900 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200 inline-flex items-center gap-1.5">
                                    <Briefcase className="w-3.5 h-3.5 text-purple-700" /> Business / Work Trip Stay
                                </p>
                            )}
                            {booking.specialRequests && (
                                <div className="p-2.5 bg-white/80 rounded-xl border border-amber-200 mt-1">
                                    <p className="text-xs text-amber-950 font-medium italic">
                                        "{booking.specialRequests}"
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Front-Desk Interactive Action Footer */}
                <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between gap-3 print:hidden">
                    <div>
                        {currentStatus === "CONFIRMED" && (
                            <button
                                onClick={handleCancel}
                                disabled={actionLoading}
                                className="px-3.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 transition"
                            >
                                Cancel Reservation
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {currentStatus === "CONFIRMED" && (
                            <>
                                <button
                                    onClick={handleCheckIn}
                                    disabled={actionLoading}
                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
                                >
                                    <LogIn className="w-3.5 h-3.5" />
                                    <span>Check-In</span>
                                </button>
                                <button
                                    onClick={handleCheckOut}
                                    disabled={actionLoading}
                                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
                                >
                                    <LogOut className="w-3.5 h-3.5" />
                                    <span>Check-Out</span>
                                </button>
                            </>
                        )}
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
