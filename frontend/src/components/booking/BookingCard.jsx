import StatusBadge from "./StatusBadge";
import BookingTimeline from "./BookingTimeline";

export default function BookingCard({ booking }) {
  return (
    <div className="rounded-3xl bg-white shadow-lg border border-gray-100 p-6">

      <div className="flex justify-between items-start">

        <div>
          <h2 className="text-2xl font-bold">
            {booking.workerName}
          </h2>

          <p className="text-gray-500 mt-1">
            {booking.profession}
          </p>
        </div>

        <StatusBadge status={booking.status} />

      </div>

      <div className="mt-6 space-y-2">

        <p>📅 {booking.bookingDate}</p>

        <p>🕒 {booking.bookingTime}</p>

        <p>📍 {booking.serviceAddress}</p>

        <p className="text-xl font-bold text-blue-600">
          ₹{booking.estimatedPrice}
        </p>

      </div>

      <BookingTimeline status={booking.status} />

    </div>
  );
}
