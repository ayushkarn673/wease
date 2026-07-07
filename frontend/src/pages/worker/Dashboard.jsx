import { useEffect, useState } from "react";
import {
  Briefcase,
  Clock,
  IndianRupee,
  CheckCircle,
} from "lucide-react";

import DashboardStats from "../../components/worker/DashboardStats";
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

  return (

    <div className="p-8">

      <h1 className="text-4xl font-bold mb-8">

        Worker Dashboard

      </h1>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

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
          title="Today's Jobs"
          value={bookings.length}
          icon={<Briefcase />}
        />

        <DashboardStats
          title="Earnings"
          value={`₹${earnings}`}
          icon={<IndianRupee />}
          color="text-green-700"
        />

      </div>

    </div>

  );
}
