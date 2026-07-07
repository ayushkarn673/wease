import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import DashboardHeader from "../../components/customer/DashboardHeader";
import DashboardStats from "../../components/worker/DashboardStats";
import RequestCard from "../../components/worker/RequestCard";
import RecentJobCard from "../../components/worker/RecentJobCard";
import AvailabilityToggle from "../../components/worker/AvailabilityToggle";
import EarningsCard from "../../components/worker/EarningsCard";
import { getWorkerDashboard, updateAvailability, acceptBooking, rejectBooking } from "../../services/bookingService";
import { Briefcase, ShieldAlert, DollarSign, Star } from "lucide-react";

export default function WorkerDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toggleLoading, setToggleLoading] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const dashboardData = await getWorkerDashboard();
      setData(dashboardData);
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
      setData(prev => prev ? { ...prev, available: res.available } : null);
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
      await loadDashboard();
    } catch (err) {
      console.error(err);
      alert("Failed to accept booking.");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectBooking(id);
      await loadDashboard();
    } catch (err) {
      console.error(err);
      alert("Failed to reject booking.");
    }
  };

  const calculateMonthEarnings = (recentBookings) => {
    if (!recentBookings) return 0;
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth(); // 0-11
    
    return recentBookings
      .filter((b) => {
        if (b.status !== "COMPLETED" || !b.bookingDate) return false;
        const bDate = new Date(b.bookingDate);
        return bDate.getFullYear() === currentYear && bDate.getMonth() === currentMonth;
      })
      .reduce((sum, b) => sum + (b.finalPrice || b.estimatedPrice || 0), 0);
  };

  if (loading && !data) {
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

  const incomingRequests = data?.recentBookings?.filter(b => b.status === "PENDING") || [];
  const recentJobs = data?.recentBookings?.filter(b => b.status === "COMPLETED").slice(0, 5) || [];
  const monthEarnings = calculateMonthEarnings(data?.recentBookings);

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
            available={data?.available ?? true}
            onToggle={handleToggleAvailability}
            disabled={toggleLoading}
          />
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <DashboardStats
            title="Today's Jobs"
            value={data?.todayJobs || 0}
            icon={<Briefcase size={20} />}
          />
          <DashboardStats
            title="Pending Jobs"
            value={data?.pendingRequests || 0}
            icon={<ShieldAlert size={20} />}
          />
          <DashboardStats
            title="Earnings"
            value={`₹${data?.todayEarnings || 0}`}
            icon={<DollarSign size={20} />}
          />
          <DashboardStats
            title="Rating"
            value={`⭐${data?.rating || "4.9"}`}
            icon={<Star size={20} className="fill-amber-400 text-amber-400" />}
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
                {incomingRequests.length} Pending
              </span>
            </div>

            {incomingRequests.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200">
                <p className="text-gray-400 font-medium">No pending requests at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {incomingRequests.map((booking) => (
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
              todayEarnings={data?.todayEarnings}
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
