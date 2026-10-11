/**
 * Admin Dashboard — Full Modular Implementation
 * Tabs: Stats · Users · Hotels · Bookings (Check-in/out) · Complaints · Notifications · Experiences · Spots
 */
import { useEffect, useState } from "react";
import {
  Shield, Users, Building2, AlertTriangle,
  Bell, BookOpen, BarChart3, Star, Compass
} from "lucide-react";
import { api, UserProfile, HotelOwner, Hotel, Booking, Notification, Room, ExperienceCard, Complaint } from "../services/api";

// Modular Components
import AdminSidebar from "./admin/components/AdminSidebar";
import AdminTopBar from "./admin/components/AdminTopBar";
import { Loading } from "./admin/components/AdminUIElements";

// Panels
import StatsPanel from "./admin/panels/StatsPanel";
import UserManagementPanel from "./admin/panels/UserManagementPanel";
import HotelManagementPanel from "./admin/panels/HotelManagementPanel";
import BookingsPanel from "./admin/panels/BookingsPanel";
import ComplaintsPanel from "./admin/panels/ComplaintsPanel";
import ExperienceManagementPanel from "./admin/panels/ExperienceManagementPanel";
import NotificationsPanel from "./admin/panels/NotificationsPanel";
import TouristSpotsPanel from "./admin/panels/TouristSpotsPanel";

type Tab = "stats" | "users" | "hotels" | "bookings" | "complaints" | "notifications" | "experiences" | "spots";

export default function AdminDashboard() {
  const [currentUser, setCurrentUser] = useState<UserProfile | HotelOwner | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [tab, setTab] = useState<Tab>("stats");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAddOwner, setShowAddOwner] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<(UserProfile | HotelOwner)[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [rooms, setRooms] = useState<(Room & { hotelName: string })[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [experiences, setExperiences] = useState<ExperienceCard[]>([]);
  const [refresh, setRefresh] = useState(0);

  const unreadNotif = (Array.isArray(notifications) ? notifications : []).filter(n => !n.isRead).length;

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const userStr = localStorage.getItem('adminUser');
    if (token && userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch (e) { }
    } else {
      window.location.href = '/admin/login';
    }
    setAuthLoading(false);
  }, []);

  useEffect(() => {
    if (currentUser?.role !== "ADMIN") return;
    api.getAdminStats().then(setStats);
    api.getAllUsers().then(d => setUsers(Array.isArray(d) ? d : []));
    api.getAllHotels().then(d => setHotels(Array.isArray(d) ? d : []));
    api.getAllRooms().then(d => setRooms(Array.isArray(d) ? d : []));
    api.getAdminComplaints().then(d => setComplaints(Array.isArray(d) ? d : []));
    api.getAllBookings().then(d => {
      const serverBookings = Array.isArray(d) ? d : [];
      try {
        const local = JSON.parse(localStorage.getItem('sb_bookings') || '[]');
        const combined = [...serverBookings, ...local.filter((l: any) => !serverBookings.some(s => s.id === l.id))];
        setBookings(combined);
      } catch {
        setBookings(serverBookings);
      }
    });
    if (currentUser) api.getNotifications(currentUser.id).then(d => setNotifications(Array.isArray(d) ? d : []));
    api.getExperiences().then(d => setExperiences(Array.isArray(d) ? d : []));
  }, [refresh, currentUser]);

  if (authLoading) return <Loading />;
  if (!currentUser) return null;

  if (currentUser?.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mb-4">
          <Shield className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-2">Access Denied</h1>
        <p className="text-slate-500 max-w-md text-sm mb-6">
          This area is restricted to Super Administrators. Owners and regular guests do not have permission to access the national control panel.
        </p>
        <button
          onClick={() => window.location.href = "/"}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-sm transition"
        >
          Return to Public Site
        </button>
      </div>
    );
  }

  const reload = () => setRefresh(p => p + 1);

  const tabNav: { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: "stats", label: "Dashboard", icon: <BarChart3 className="w-5 h-5" /> },
    { id: "users", label: "Users & Owners", icon: <Users className="w-5 h-5" /> },
    { id: "hotels", label: "Hotels & Rooms", icon: <Building2 className="w-5 h-5" /> },
    { id: "bookings", label: "Bookings", icon: <BookOpen className="w-5 h-5" /> },
    { id: "complaints", label: "Complaints", icon: <AlertTriangle className="w-5 h-5" />, badge: (Array.isArray(complaints) ? complaints : []).filter(c => c.status !== "Resolved").length },
    { id: "experiences", label: "Experiences", icon: <Star className="w-5 h-5" /> },
    { id: "spots", label: "Tourist Spots", icon: <Compass className="w-5 h-5" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="w-5 h-5" />, badge: unreadNotif },
  ];

  const currentTabObj = tabNav.find(t => t.id === tab);

  const handleExportAll = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ stats, hotelsCount: hotels.length, bookingsCount: bookings.length }, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", `staybd_admin_report_${new Date().toISOString().slice(0, 10)}.json`);
    dl.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-[40] md:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Admin Sidebar */}
      <AdminSidebar
        tab={tab}
        setTab={setTab}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        tabNav={tabNav}
        setShowAddOwner={setShowAddOwner}
        reload={reload}
        currentUser={currentUser}
      />

      {/* Main Content Area */}
      <main className="md:ml-64 flex-1 p-4 md:p-8 max-w-full overflow-x-hidden relative min-h-screen bg-slate-50">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-60" />

        <div className="relative z-10">
          <AdminTopBar
            setIsSidebarOpen={setIsSidebarOpen}
            activeTabLabel={currentTabObj?.label || "Dashboard"}
            unreadCount={unreadNotif}
            onNotificationClick={() => setTab("notifications")}
            onExport={handleExportAll}
          />

          {tab === "stats" && <StatsPanel stats={stats} bookings={bookings} hotels={hotels} onNavigateTab={setTab} />}

          {tab === "users" && (
            <UserManagementPanel
              users={users}
              hotels={hotels}
              bookings={bookings}
              complaints={complaints}
              reload={reload}
              showAddOwner={showAddOwner}
              setShowAddOwner={setShowAddOwner}
            />
          )}

          {tab === "hotels" && (
            <HotelManagementPanel
              hotels={hotels}
              rooms={rooms}
              userList={users}
              reload={reload}
            />
          )}

          {tab === "bookings" && (
            <BookingsPanel
              bookings={bookings}
              users={users}
              complaints={complaints}
              reload={reload}
            />
          )}

          {tab === "complaints" && <ComplaintsPanel complaints={complaints} reload={reload} />}

          {tab === "experiences" && (
            <ExperienceManagementPanel
              experiences={experiences}
              userList={users}
              reload={reload}
            />
          )}

          {tab === "spots" && <TouristSpotsPanel />}

          {tab === "notifications" && (
            <NotificationsPanel
              notifications={notifications}
              currentUser={currentUser}
              reload={reload}
            />
          )}
        </div>
      </main>
    </div>
  );
}
