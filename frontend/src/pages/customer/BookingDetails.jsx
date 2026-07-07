import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardHeader from "../../components/customer/DashboardHeader";
import BookingTimeline from "../../components/booking/BookingTimeline";
import BookingDetailsCard from "../../components/booking/BookingDetailsCard";
import { getBookingDetails } from "../../services/bookingService";
import { ArrowLeft } from "lucide-react";

export default function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadBookingDetails();
  }, [id]);

  const loadBookingDetails = async () => {
    try {
      setLoading(true);
      const data = await getBookingDetails(id);
      setBooking(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load booking details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader />

      <main className="mx-auto max-w-3xl px-6 py-8">
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition mb-6 font-bold"
        >
          <ArrowLeft size={16} />
          Back to list
        </button>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <p className="text-gray-500 animate-pulse font-bold text-lg">Loading details...</p>
          </div>
        ) : error ? (
          <div className="p-6 bg-red-50 text-red-600 rounded-3xl border border-red-100 text-center font-semibold">
            {error}
          </div>
        ) : (
          <div className="space-y-6">
            <h1 className="text-3xl font-black text-gray-800 tracking-tight">
              Booking Progress
            </h1>

            <BookingTimeline status={booking.status} />

            <BookingDetailsCard booking={booking} />
          </div>
        )}

      </main>
    </div>
  );
}
