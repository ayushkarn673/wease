import { useEffect, useState } from "react";
import { getWorkerBookings, acceptBooking, rejectBooking } from "../../services/bookingService";
import RequestCard from "../../components/worker/RequestCard";

export default function IncomingRequests({ onUpdate }) {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadBookings();
    }, []);

    async function loadBookings() {
        try {
            setLoading(true);
            const data = await getWorkerBookings();
            // Filter only PENDING bookings
            const pending = data.filter(b => b.status === "PENDING");
            setBookings(pending);
            if (onUpdate) {
                onUpdate(data); // Provide raw list to parent dashboard for stats calculation
            }
        } catch (err) {
            console.error(err);
            setError("Failed to load incoming requests.");
        } finally {
            setLoading(false);
        }
    }

    const handleAccept = async (id) => {
        try {
            await acceptBooking(id);
            await loadBookings();
        } catch (err) {
            console.error(err);
            alert("Failed to accept booking.");
        }
    };

    const handleReject = async (id) => {
        try {
            await rejectBooking(id);
            await loadBookings();
        } catch (err) {
            console.error(err);
            alert("Failed to reject booking.");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <p className="text-gray-500 animate-pulse font-medium">Loading incoming requests...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 text-red-650 rounded-2xl text-center border border-red-100">
                {error}
            </div>
        );
    }

    if (bookings.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-250">
                <p className="text-gray-400 font-medium">No pending requests at the moment.</p>
                <p className="text-xs text-gray-400 mt-1">When customers book your service, they will appear here.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.map((booking) => (
                <RequestCard
                    key={booking.bookingId}
                    booking={booking}
                    onAccept={handleAccept}
                    onReject={handleReject}
                />
            ))}
        </div>
    );
}
