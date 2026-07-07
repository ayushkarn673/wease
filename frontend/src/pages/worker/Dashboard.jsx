import { useEffect, useState } from "react";
import {
  Briefcase,
  IndianRupee,
  Clock,
  Star,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import DashboardHeader from "../../components/customer/DashboardHeader";
import DashboardStats from "../../components/worker/DashboardStats";
import RequestCard from "../../components/worker/RequestCard";
import RecentJobCard from "../../components/worker/RecentJobCard";
import AvailabilityToggle from "../../components/worker/AvailabilityToggle";
import EarningsCard from "../../components/worker/EarningsCard";

import {
  getWorkerBookings,
  acceptBooking,
  rejectBooking,
  updateAvailability,
} from "../../services/bookingService";

export default function WorkerDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [available, setAvailable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toggleLoading, setToggleLoading] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await getWorkerBookings();
      setBookings(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (newVal) => {
    try {
      setToggleLoading(true);
      const res = await updateAvailability(newVal);
      setAvailable(res.available);
    } catch (err) {
      console.error(err);
      alert("Failed to toggle availability status.");
    } finally {
      setToggleLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      await acceptBooking(id);
      await loadDashboardData();
    } catch (err) {
      console.error(err);
      alert("Failed to accept booking.");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectBooking(id);
      await loadDashboardData();
    } catch (err) {
      console.error(err);
      alert("Failed to reject booking.");
    }
  };

  if (loading && bookings.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <DashboardHeader />
        <div className="flex flex-col justify-center items-center py-24">
          <p className="text-gray-500 animate-pulse font-bold text-lg">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <DashboardHeader />
        <main className="mx-auto max-w-7xl px-6 py-8">
          <div className="p-6 bg-red-50 text-red-600 rounded-3xl text-center border border-red-150 font-semibold">
            {error}
          </div>
        </main>
      </div>
    );
  }

  const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const currentMonthPrefix = todayStr.substring(0, 7); // YYYY-MM

  // Stats Calculations
  const pendingRequests = bookings.filter((b) => b.status === "PENDING");
  const todayJobs = bookings.filter((b) => 
    (b.status === "ACCEPTED" || b.status === "IN_PROGRESS" || b.status === "COMPLETED") &&
    b.bookingDate === todayStr
  );
  const completedJobs = bookings.filter((b) => b.status === "COMPLETED");

  const todayEarnings = completedJobs
    .filter((b) => b.bookingDate === todayStr)
    .reduce((sum, b) => sum + (b.finalPrice || b.estimatedPrice || 0), 0);

  const monthEarnings = completedJobs
    .filter((b) => b.bookingDate?.startsWith(currentMonthPrefix))
    .reduce((sum, b) => sum + (b.finalPrice || b.estimatedPrice || 0), 0);

  const recentJobs = completedJobs.slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader />

      <main className="mx-auto max-w-7xl px-6 py-8">
        
        {/* Welcome Header Panel */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-800">
              👋 Welcome {user?.fullName || "Worker"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Here is your daily summary and schedule details.
            </p>
          </div>
          <AvailabilityToggle
            available={available}
            onToggle={handleToggleAvailability}
            disabled={toggleLoading}
          />
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <DashboardStats
            title="Today's Jobs"
            value={todayJobs.length}
            icon={<Briefcase size={24} />}
            color="text-blue-600"
          />
          <DashboardStats
            title="Pending Jobs"
            value={pendingRequests.length}
            icon={<Clock size={24} />}
            color="text-amber-500"
          />
          <DashboardStats
            title="Earnings"
            value={`₹${todayEarnings}`}
            icon={<IndianRupee size={24} />}
            color="text-emerald-600"
          />
          <DashboardStats
            title="Rating"
            value="⭐4.9"
            icon={<Star size={24} />}
            color="text-amber-400"
          />
        </div>

        {/* Dynamic Inner Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Incoming Booking Requests */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                Incoming Requests
              </h2>
              <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold">
                {pendingRequests.length} Pending
              </span>
            </div>

            {pendingRequests.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200">
                <p className="text-gray-400 font-medium">No pending requests at the moment.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map((booking) => (
                  <RequestCard
                    key={booking.bookingId}
                    booking={booking}
                    onAccept={handleAccept}
                    onReject={handleReject}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar Panel */}
          <div className="space-y-8">
            <EarningsCard 
              todayEarnings={todayEarnings}
              monthEarnings={monthEarnings}
            />

            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800">
                Recent Jobs
              </h2>

              {recentJobs.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200">
                  <p className="text-gray-400 font-medium">No completed jobs yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentJobs.map((booking) => (
                    <RecentJobCard
                      key={booking.bookingId}
                      booking={booking}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
