import React, { useState, useMemo } from "react";
import {
  BedDouble, CheckCircle2, Brush, AlertCircle, Search, Filter,
  Users, Calendar, Clock, Sparkles, ShieldAlert, Plus, LogIn,
  RefreshCw, Wrench, Eye, ArrowRight, Check, X
} from "lucide-react";
import { Room, Booking, Hotel } from "../../../services/api";
import { Badge } from "../components/Shared";

export type PhysicalRoomStatus = "VACANT_CLEAN" | "OCCUPIED" | "DIRTY" | "MAINTENANCE";

export interface PhysicalRoom {
  id: string;
  roomNumber: string;
  floor: number;
  category: string;
  roomType: string;
  pricePerNight: number;
  status: PhysicalRoomStatus;
  currentBooking?: Booking;
  maintenanceReason?: string;
  assignedCleaner?: string;
  parentRoomId: string;
}

interface RoomMatrixPanelProps {
  hotel: Hotel;
  rooms: Room[];
  bookings: Booking[];
  onOpenWalkIn: (roomType?: string) => void;
  onInspectBooking: (booking: Booking) => void;
  onAddRoom?: () => void;
  reload: () => void;
}

export default function RoomMatrixPanel({
  hotel,
  rooms,
  bookings,
  onOpenWalkIn,
  onInspectBooking,
  onAddRoom,
  reload
}: RoomMatrixPanelProps) {
  const [selectedFloor, setSelectedFloor] = useState<number | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<PhysicalRoomStatus | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<PhysicalRoom | null>(null);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockTargetRoom, setBlockTargetRoom] = useState<PhysicalRoom | null>(null);
  const [blockReason, setBlockReason] = useState("AC Service & Deep Sanitization");

  // Local overrides for dynamic interaction (persisted in localStorage)
  const storageKey = `sb_room_matrix_overrides_${hotel.id}`;
  const [statusOverrides, setStatusOverrides] = useState<Record<string, { status: PhysicalRoomStatus; reason?: string }>>(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || "{}");
    } catch {
      return {};
    }
  });

  const saveOverride = (roomNumber: string, status: PhysicalRoomStatus, reason?: string) => {
    const updated = { ...statusOverrides, [roomNumber]: { status, reason } };
    setStatusOverrides(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const clearOverride = (roomNumber: string) => {
    const updated = { ...statusOverrides };
    delete updated[roomNumber];
    setStatusOverrides(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Build physical rooms list dynamically
  const physicalRooms: PhysicalRoom[] = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    const confirmedBookings = bookings.filter(b => b.status === "CONFIRMED" || b.status === "PENDING");

    const list: PhysicalRoom[] = [];

    rooms.forEach((r, roomIdx) => {
      const invCount = Math.max(1, Math.min(r.totalInventory || 3, 8));
      const baseFloor = r.floorNumber || (roomIdx + 1);

      for (let i = 0; i < invCount; i++) {
        const roomNum = r.roomNumber && i === 0 ? r.roomNumber : `${baseFloor}0${i + 1}`;
        const uniqueId = `${r.id}_${roomNum}`;

        // Match with an active booking
        const assignedBooking = confirmedBookings.find(b => {
          // Check if booking matches this room category and dates
          const matchesCategory = b.roomType === r.type || b.roomId === r.id;
          const isOngoing = b.checkIn <= todayStr && b.checkOut >= todayStr;
          return matchesCategory && isOngoing;
        });

        // Determine default status
        let defaultStatus: PhysicalRoomStatus = "VACANT_CLEAN";
        if (assignedBooking) {
          defaultStatus = "OCCUPIED";
        } else if ((roomIdx + i) % 7 === 2) {
          defaultStatus = "DIRTY";
        } else if ((roomIdx + i) % 11 === 5) {
          defaultStatus = "MAINTENANCE";
        }

        // Apply local overrides if any
        const override = statusOverrides[roomNum];
        const finalStatus = override ? override.status : defaultStatus;
        const maintenanceReason = override?.reason || (finalStatus === "MAINTENANCE" ? "Quarterly AC overhaul & linen upgrade" : undefined);

        list.push({
          id: uniqueId,
          roomNumber: roomNum,
          floor: baseFloor,
          category: r.category || "Standard",
          roomType: r.type,
          pricePerNight: r.pricePerNight,
          status: finalStatus,
          currentBooking: finalStatus === "OCCUPIED" ? assignedBooking : undefined,
          maintenanceReason,
          assignedCleaner: finalStatus === "DIRTY" ? (i % 2 === 0 ? "Rafiq Clean Squad" : "Fatema Housekeeping") : undefined,
          parentRoomId: r.id
        });
      }
    });

    return list.sort((a, b) => parseInt(a.roomNumber) - parseInt(b.roomNumber));
  }, [rooms, bookings, statusOverrides, hotel.id]);

  // Unique floors
  const floors = useMemo(() => {
    const fSet = new Set(physicalRooms.map(r => r.floor));
    return Array.from(fSet).sort((a, b) => a - b);
  }, [physicalRooms]);

  // Filtered rooms
  const filteredRooms = useMemo(() => {
    return physicalRooms.filter(r => {
      if (selectedFloor !== "ALL" && r.floor !== selectedFloor) return false;
      if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesNum = r.roomNumber.toLowerCase().includes(q);
        const matchesType = r.roomType.toLowerCase().includes(q);
        const matchesGuest = r.currentBooking?.guestName?.toLowerCase().includes(q);
        if (!matchesNum && !matchesType && !matchesGuest) return false;
      }
      return true;
    });
  }, [physicalRooms, selectedFloor, statusFilter, searchQuery]);

  // Counts
  const totalUnits = physicalRooms.length;
  const occupiedCount = physicalRooms.filter(r => r.status === "OCCUPIED").length;
  const vacantCleanCount = physicalRooms.filter(r => r.status === "VACANT_CLEAN").length;
  const dirtyCount = physicalRooms.filter(r => r.status === "DIRTY").length;
  const maintenanceCount = physicalRooms.filter(r => r.status === "MAINTENANCE").length;
  const occupancyPercent = totalUnits > 0 ? Math.round((occupiedCount / totalUnits) * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* ───── TOP CONTROLS & HEADER ───── */}
      <div className="bg-white rounded-[32px] p-6 md:p-8 border border-slate-200/90 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                <BedDouble className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight uppercase">
                  Live Room Matrix & Rack
                </h2>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Visual floor-by-floor physical room grid with real-time occupancy and status control
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {onAddRoom && (
              <button
                onClick={onAddRoom}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider px-5 py-3 rounded-2xl transition shadow-md shadow-indigo-600/20 active:scale-95 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Room Category
              </button>
            )}
            <button
              onClick={() => onOpenWalkIn()}
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/90 font-black text-xs uppercase tracking-wider px-4 py-3 rounded-2xl transition active:scale-95 flex items-center gap-2 shadow-2xs"
            >
              <LogIn className="w-4 h-4" /> Quick Walk-in
            </button>
            <button
              onClick={reload}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-3 rounded-2xl transition active:scale-95"
              title="Refresh Matrix"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ───── SUMMARY STATS BAR ───── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-6">
          <button
            onClick={() => setStatusFilter("ALL")}
            className={`p-4 rounded-2xl border text-left transition-all ${statusFilter === "ALL"
              ? "bg-slate-900 text-white border-slate-900 shadow-md"
              : "bg-slate-50 hover:bg-slate-100 border-slate-200/80 text-slate-700"
              }`}
          >
            <p className={`text-[10px] font-black uppercase tracking-wider ${statusFilter === "ALL" ? "text-slate-300" : "text-slate-500"}`}>Total Physical Units</p>
            <p className="text-2xl font-black tabular-nums mt-1">{totalUnits}</p>
            <span className={`text-[9px] font-bold mt-1 inline-block ${statusFilter === "ALL" ? "text-slate-400" : "text-slate-500"}`}>100% Capacity</span>
          </button>

          <button
            onClick={() => setStatusFilter("OCCUPIED")}
            className={`p-4 rounded-2xl border text-left transition-all ${statusFilter === "OCCUPIED"
              ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20"
              : "bg-blue-50/60 hover:bg-blue-100/60 border-blue-200 text-blue-900"
              }`}
          >
            <p className={`text-[10px] font-black uppercase tracking-wider ${statusFilter === "OCCUPIED" ? "text-blue-100" : "text-blue-600"}`}>Occupied</p>
            <p className="text-2xl font-black tabular-nums mt-1">{occupiedCount}</p>
            <span className={`text-[9px] font-bold mt-1 inline-block ${statusFilter === "OCCUPIED" ? "text-blue-200" : "text-blue-600"}`}>{occupancyPercent}% Occupancy</span>
          </button>

          <button
            onClick={() => setStatusFilter("VACANT_CLEAN")}
            className={`p-4 rounded-2xl border text-left transition-all ${statusFilter === "VACANT_CLEAN"
              ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20"
              : "bg-emerald-50/60 hover:bg-emerald-100/60 border-emerald-200 text-emerald-900"
              }`}
          >
            <p className={`text-[10px] font-black uppercase tracking-wider ${statusFilter === "VACANT_CLEAN" ? "text-emerald-100" : "text-emerald-600"}`}>Vacant Clean</p>
            <p className="text-2xl font-black tabular-nums mt-1">{vacantCleanCount}</p>
            <span className={`text-[9px] font-bold mt-1 inline-block ${statusFilter === "VACANT_CLEAN" ? "text-emerald-200" : "text-emerald-600"}`}>Ready for Check-In</span>
          </button>

          <button
            onClick={() => setStatusFilter("DIRTY")}
            className={`p-4 rounded-2xl border text-left transition-all ${statusFilter === "DIRTY"
              ? "bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-500/20"
              : "bg-amber-50/60 hover:bg-amber-100/60 border-amber-200 text-amber-900"
              }`}
          >
            <p className={`text-[10px] font-black uppercase tracking-wider ${statusFilter === "DIRTY" ? "text-amber-100" : "text-amber-600"}`}>Needs Cleaning</p>
            <p className="text-2xl font-black tabular-nums mt-1">{dirtyCount}</p>
            <span className={`text-[9px] font-bold mt-1 inline-block ${statusFilter === "DIRTY" ? "text-amber-200" : "text-amber-600"}`}>Housekeeping Assigned</span>
          </button>

          <button
            onClick={() => setStatusFilter("MAINTENANCE")}
            className={`p-4 rounded-2xl border text-left transition-all ${statusFilter === "MAINTENANCE"
              ? "bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-500/20"
              : "bg-rose-50/60 hover:bg-rose-100/60 border-rose-200 text-rose-900"
              }`}
          >
            <p className={`text-[10px] font-black uppercase tracking-wider ${statusFilter === "MAINTENANCE" ? "text-rose-100" : "text-rose-600"}`}>Out of Order</p>
            <p className="text-2xl font-black tabular-nums mt-1">{maintenanceCount}</p>
            <span className={`text-[9px] font-bold mt-1 inline-block ${statusFilter === "MAINTENANCE" ? "text-rose-200" : "text-rose-600"}`}>Maintenance Hold</span>
          </button>
        </div>
      </div>

      {/* ───── FILTER BAR (FLOORS & SEARCH) ───── */}
      <div className="bg-white rounded-[28px] p-4 border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Floor Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto p-1 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            onClick={() => setSelectedFloor("ALL")}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition ${selectedFloor === "ALL"
              ? "bg-white text-indigo-700 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
              }`}
          >
            All Floors
          </button>
          {floors.map(fl => (
            <button
              key={fl}
              onClick={() => setSelectedFloor(fl)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition ${selectedFloor === fl
                ? "bg-white text-indigo-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
                }`}
            >
              Floor {fl}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search room (e.g. 101) or guest..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      {/* ───── ROOM MATRIX GRID ───── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {filteredRooms.map(rm => {
          const isOccupied = rm.status === "OCCUPIED";
          const isClean = rm.status === "VACANT_CLEAN";
          const isDirty = rm.status === "DIRTY";
          const isMaintenance = rm.status === "MAINTENANCE";

          const statusBadge = isOccupied
            ? { text: "Occupied", bg: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500" }
            : isClean
              ? { text: "Vacant Clean", bg: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" }
              : isDirty
                ? { text: "Cleaning Active", bg: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" }
                : { text: "Maintenance", bg: "bg-rose-50 text-rose-700 border-rose-200", dot: "bg-rose-500" };

          return (
            <div
              key={rm.id}
              className={`bg-white rounded-[26px] border transition-all duration-300 p-5 flex flex-col justify-between group hover:shadow-lg hover:-translate-y-0.5 ${isOccupied
                ? "border-blue-200/80 hover:border-blue-400 shadow-[0_2px_8px_rgba(59,130,246,0.06)]"
                : isClean
                  ? "border-emerald-200/80 hover:border-emerald-400 shadow-[0_2px_8px_rgba(16,185,129,0.06)]"
                  : isDirty
                    ? "border-amber-200/80 hover:border-amber-400 shadow-[0_2px_8px_rgba(245,158,11,0.06)]"
                    : "border-rose-200/80 hover:border-rose-400 shadow-[0_2px_8px_rgba(244,63,94,0.06)]"
                }`}
            >
              {/* Header */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-slate-900 tracking-tight tabular-nums">
                      #{rm.roomNumber}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                      Floor {rm.floor}
                    </span>
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border flex items-center gap-1.5 ${statusBadge.bg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot} animate-pulse`} />
                    {statusBadge.text}
                  </span>
                </div>

                {/* Room Category */}
                <p className="text-xs font-black text-slate-800 uppercase tracking-tight line-clamp-1 mb-3">
                  {rm.roomType}
                </p>

                {/* State-specific Body */}
                <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100 text-xs mb-4 min-h-[72px] flex flex-col justify-center">
                  {isOccupied && rm.currentBooking ? (
                    <div>
                      <p className="font-black text-slate-900 truncate">
                        {rm.currentBooking.guestName || "Registered Guest"}
                      </p>
                      <p className="text-[10px] text-slate-500 font-semibold mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {rm.currentBooking.checkIn} → {rm.currentBooking.checkOut}
                      </p>
                      <p className="text-[10px] text-emerald-700 font-bold mt-0.5">
                        Folio: ৳{rm.currentBooking.totalPrice.toLocaleString()} ({rm.currentBooking.status})
                      </p>
                    </div>
                  ) : isClean ? (
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Daily Base Rate</p>
                      <p className="text-base font-black text-emerald-700 tabular-nums">
                        ৳{rm.pricePerNight.toLocaleString()}<span className="text-[10px] text-slate-400 font-normal"> / night</span>
                      </p>
                      <p className="text-[9px] text-emerald-600 font-bold mt-0.5">Ready for instant assignment</p>
                    </div>
                  ) : isDirty ? (
                    <div>
                      <p className="text-[10px] font-bold text-amber-700 uppercase flex items-center gap-1">
                        <Brush className="w-3 h-3" /> Housekeeping Turnaround
                      </p>
                      <p className="text-xs font-black text-slate-800 mt-1 truncate">
                        {rm.assignedCleaner || "Staff on duty"}
                      </p>
                      <p className="text-[9px] text-slate-500">Linen change & sanitization</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-[10px] font-bold text-rose-700 uppercase flex items-center gap-1">
                        <Wrench className="w-3 h-3" /> Blocked for Service
                      </p>
                      <p className="text-[11px] font-black text-slate-800 mt-0.5 truncate">
                        {rm.maintenanceReason || "Maintenance inspection"}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-1.5 pt-1">
                {isClean && (
                  <button
                    onClick={() => onOpenWalkIn(rm.roomType)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] uppercase tracking-wider py-2 rounded-xl transition shadow-xs active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <LogIn className="w-3.5 h-3.5" /> Assign Walk-in
                  </button>
                )}

                {isOccupied && rm.currentBooking && (
                  <button
                    onClick={() => onInspectBooking(rm.currentBooking!)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] uppercase tracking-wider py-2 rounded-xl transition shadow-xs active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Guest Folio
                  </button>
                )}

                {isDirty && (
                  <button
                    onClick={() => saveOverride(rm.roomNumber, "VACANT_CLEAN")}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] uppercase tracking-wider py-2 rounded-xl transition shadow-xs active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Mark Clean & Ready
                  </button>
                )}

                {isMaintenance && (
                  <button
                    onClick={() => clearOverride(rm.roomNumber)}
                    className="w-full bg-slate-800 hover:bg-slate-900 text-white font-black text-[10px] uppercase tracking-wider py-2 rounded-xl transition shadow-xs active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" /> Restore to Available
                  </button>
                )}

                {/* Sub-actions Row */}
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => {
                      if (isClean) {
                        saveOverride(rm.roomNumber, "DIRTY");
                      } else {
                        saveOverride(rm.roomNumber, "VACANT_CLEAN");
                      }
                    }}
                    className="py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  >
                    {isClean ? "Mark Dirty" : "Mark Clean"}
                  </button>

                  <button
                    onClick={() => {
                      setBlockTargetRoom(rm);
                      setShowBlockModal(true);
                    }}
                    className="py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 transition"
                  >
                    {isMaintenance ? "Edit Block" : "Block Room"}
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {filteredRooms.length === 0 && (
        <div className="bg-white rounded-[32px] p-16 text-center border border-slate-200/90 text-slate-400">
          <BedDouble className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-xs font-black uppercase tracking-wider text-slate-700">No rooms match filter criteria</p>
          <p className="text-xs text-slate-400 mt-1">Try switching floor or resetting the status filter.</p>
        </div>
      )}

      {/* ───── BLOCK / MAINTENANCE MODAL ───── */}
      {showBlockModal && blockTargetRoom && (
        <div className="fixed inset-0 bg-slate-900/60 z-[120] flex items-center justify-center p-4 backdrop-blur-2xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] w-full max-w-md border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 bg-slate-50/80 flex justify-between items-center">
              <div>
                <h3 className="font-black text-base text-slate-900 uppercase tracking-tight">
                  Block Room #{blockTargetRoom.roomNumber}
                </h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Set room out of service for repairs, inspection, or VIP hold
                </p>
              </div>
              <button
                onClick={() => { setShowBlockModal(false); setBlockTargetRoom(null); }}
                className="p-2 hover:bg-slate-200 rounded-xl text-slate-500 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-2">
                  Select Reason
                </label>
                <div className="space-y-2">
                  {[
                    "AC Service & Deep Sanitization",
                    "Plumbing & Bathroom Maintenance",
                    "Painting & Furniture Touch-up",
                    "VIP Host / Owner Reserved Hold",
                    "Electrical & TV System Repair"
                  ].map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setBlockReason(r)}
                      className={`w-full text-left p-3 rounded-xl border text-xs font-bold transition flex items-center justify-between ${blockReason === r
                        ? "bg-rose-50 border-rose-400 text-rose-800 shadow-2xs"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                    >
                      <span>{r}</span>
                      {blockReason === r && <Check className="w-4 h-4 text-rose-600" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    saveOverride(blockTargetRoom.roomNumber, "MAINTENANCE", blockReason);
                    setShowBlockModal(false);
                    setBlockTargetRoom(null);
                  }}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-black py-3 rounded-xl text-xs uppercase tracking-wider transition shadow-md active:scale-95"
                >
                  Confirm Room Block
                </button>
                <button
                  type="button"
                  onClick={() => {
                    clearOverride(blockTargetRoom.roomNumber);
                    setShowBlockModal(false);
                    setBlockTargetRoom(null);
                  }}
                  className="px-4 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs uppercase hover:bg-slate-50 transition"
                >
                  Unblock
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
