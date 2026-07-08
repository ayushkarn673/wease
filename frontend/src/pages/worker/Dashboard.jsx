import { useEffect, useState } from "react";
import {
  Briefcase,
  Clock,
  IndianRupee,
  CheckCircle,
} from "lucide-react";

import DashboardStats from "../../components/worker/DashboardStats";
import RequestCard from "../../components/worker/RequestCard";
import JobCard from "../../components/worker/JobCard";
import AvailabilityToggle from "../../components/worker/AvailabilityToggle";
import { getWorkerDashboard } from "../../services/dashboardService";

export default function Dashboard() {

  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const data = await getWorkerDashboard();
      setBookings(data);
    } catch (err) {
      console.error(err);
    }
  }

  const pending = bookings.filter(
    b => b.status === "PENDING"
  ).length;

  const completed = bookings.filter(
    b => b.status === "COMPLETED"
  ).length;

  const earnings = bookings
    .filter(b => b.status === "COMPLETED")
    .reduce(
      (sum, b) => sum + (b.finalPrice || 0),
      0
    );

  const pendingBookings = bookings.filter(
    booking => booking.status === "PENDING"
  );

  const acceptedBookings = bookings.filter(
    booking => booking.status === "ACCEPTED"
  );

  const completedBookings = bookings.filter(
    booking => booking.status === "COMPLETED"
  );

  const recentJobs = completedBookings.slice(0, 5);

  return (

    <div className="p-8 max-w-6xl mx-auto">

      <div className="flex justify-between items-center mb-8">

          <h1 className="text-4xl font-bold">

              Worker Dashboard

          </h1>

          <AvailabilityToggle

              available={true}

              onUpdate={loadDashboard}

          />

      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

        <DashboardStats
          title="Pending Requests"
          value={pending}
          icon={<Clock />}
          color="text-yellow-500"
        />

        <DashboardStats
          title="Completed Jobs"
          value={completed}
          icon={<CheckCircle />}
          color="text-green-600"
        />

        <DashboardStats
          title="Total Jobs"
          value={bookings.length}
          icon={<Briefcase />}
        />

        <DashboardStats
          title="Total Earnings"
          value={`₹${earnings}`}
          icon={<IndianRupee />}
          color="text-green-700"
        />

      </div>

      {/* Incoming Requests */}
      <div className="mb-10">

        <h2 className="text-2xl font-bold mb-6">
          Incoming Requests
        </h2>

        {pendingBookings.length === 0 ? (

          <div className="rounded-3xl bg-white border border-dashed border-slate-200 p-12 text-center">
            <p className="text-4xl mb-4">📭</p>
            <h3 className="text-xl font-semibold text-slate-700">
              No pending requests.
            </h3>
            <p className="text-slate-400 mt-2">
              You're all caught up!
            </p>
          </div>

        ) : (

          <div className="space-y-4">
            {pendingBookings.map(booking => (
              <RequestCard
                key={booking.bookingId}
                booking={booking}
                onUpdate={loadDashboard}
              />
            ))}
          </div>

        )}

      </div>

      {/* Accepted Jobs */}
      <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">
              Accepted Jobs
          </h2>
          {acceptedBookings.length === 0 ? (
              <div className="rounded-3xl border border-dashed p-8 text-center bg-white">
                  <p className="text-gray-500">
                      No accepted jobs.
                  </p>
              </div>
          ) : (
              <div className="space-y-4">
                  {acceptedBookings.map((booking)=>(
                      <JobCard
                          key={booking.bookingId}
                          booking={booking}
                          onUpdate={loadDashboard}
                      />
                  ))}
              </div>
          )}
      </div>

      {/* Recent Jobs */}
      {recentJobs.length > 0 && (

        <div>

          <h2 className="text-2xl font-bold mb-6">
            Recent Jobs
          </h2>

          <div className="space-y-4">
            {recentJobs.map(booking => (
              <div
                key={booking.bookingId}
                className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-bold text-gray-800">
                    {booking.customerName}
                  </h3>
                  <p className="text-sm text-slate-400 mt-0.5">
                    📅 {booking.bookingDate} &nbsp;•&nbsp; 📍 {booking.serviceAddress}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                    COMPLETED
                  </span>
                  <p className="text-lg font-black text-gray-800 mt-1">
                    ₹{booking.finalPrice || booking.estimatedPrice}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

      )}

    </div>

  );
}
