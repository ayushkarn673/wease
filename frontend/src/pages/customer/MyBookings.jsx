import { useEffect, useState } from "react";
import { getCustomerBookings } from "../../services/bookingService";
import BookingCard from "../../components/booking/BookingCard";

export default function MyBookings() {

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBookings();
    }, []);

    async function loadBookings() {
        try {
            const data = await getCustomerBookings();
            setBookings(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <h2>Loading...</h2>;
    }

    return (
        <div className="space-y-6">

            <h1 className="text-3xl font-bold">
                My Bookings
            </h1>

            {bookings.map((booking) => (
                <BookingCard
                    key={booking.bookingId}
                    booking={booking}
                />
            ))}

        </div>
    );
}
