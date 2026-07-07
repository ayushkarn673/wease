import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import DashboardHeader from "../../components/customer/DashboardHeader";
import IncomingRequests from "./IncomingRequests";
import { Bell, ShieldAlert, Sparkles, TrendingUp } from "lucide-react";

export default function WorkerDashboard() {
  const { user } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);
  const [todayJobsCount, setTodayJobsCount] = useState(0);
  const [todayEarnings, setTodayEarnings] = useState(0);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const handleUpdateBookings = (allBookings) => {
    const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const pending = allBookings.filter((b) => b.status === "PENDING");
    
    const todayJobs = allBookings.filter((b) => 
      (b.status === "ACCEPTED" || b.status === "IN_PROGRESS" || b.status === "COMPLETED") &&
      b.bookingDate === todayStr
    );

    const earnings = allBookings
      .filter((b) => b.status === "COMPLETED" && b.bookingDate === todayStr)
      .reduce((sum, b) => sum + (b.finalPrice || b.estimatedPrice || 0), 0);

    setPendingCount(pending.length);
    setTodayJobsCount(todayJobs.length);
    setTodayEarnings(earnings);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader />

      <main className="mx-auto max-w-7xl px-6 py-8">
        
        {/* Welcome Banner */}
        <div className="mb-8 rounded-3xl bg-slate-900 p-8 text-white relative overflow-hidden shadow-lg">
          <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 bg-radial-gradient"></div>
          <h1 className="text-3xl font-black tracking-tight">
            {getGreeting()}, {user?.fullName || "Worker"} 👋
          </h1>
          <p className="mt-2 text-slate-400 max-w-lg text-sm font-medium">
            Welcome to your worker portal. Here you can track active schedules, manage profile bookings, and check your daily earnings.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Pending Requests</p>
              <h3 className="text-3xl font-black text-gray-800 mt-1">{pendingCount}</h3>
            </div>
            <div className="p-3 bg-amber-50 text-amber-500 rounded-2xl">
              <ShieldAlert size={24} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Today's Jobs</p>
              <h3 className="text-3xl font-black text-gray-800 mt-1">{todayJobsCount}</h3>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <Sparkles size={24} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Today's Earnings</p>
              <h3 className="text-3xl font-black text-emerald-600 mt-1">₹{todayEarnings}</h3>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <TrendingUp size={24} />
            </div>
          </div>

        </div>

        {/* Incoming Requests Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Incoming Requests
          </h2>
          <IncomingRequests onUpdate={handleUpdateBookings} />
        </div>

      </main>
    </div>
  );
}
