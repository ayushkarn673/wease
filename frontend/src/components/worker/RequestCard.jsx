import { acceptBooking, rejectBooking } from "../../services/bookingService";

export default function RequestCard({ booking, onUpdate }) {
  async function handleAccept() {
    try {
      await acceptBooking(booking.bookingId);
      onUpdate();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleReject() {
    try {
      await rejectBooking(booking.bookingId);
      onUpdate();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="rounded-3xl bg-white p-6 shadow border border-slate-100">

      <div className="flex justify-between items-start">

        <div>
          <h2 className="text-xl font-bold">
            {booking.customerName}
          </h2>
          <p className="text-slate-500 mt-1">
            {booking.profession}
          </p>
        </div>

        <span className="rounded-full bg-yellow-100 px-3 py-1 text-yellow-700 text-sm font-semibold">
          {booking.status}
        </span>

      </div>

      <div className="mt-5 space-y-2 text-slate-600">
        <p>📅 {booking.bookingDate}</p>
        <p>🕒 {booking.bookingTime}</p>
        <p>📍 {booking.serviceAddress}</p>
        {booking.description && (
          <p className="text-sm text-slate-400 italic">"{booking.description}"</p>
        )}
      </div>

      <div className="mt-6 flex justify-between items-center">

        <h3 className="text-2xl font-bold text-blue-600">
          ₹{booking.estimatedPrice}
        </h3>

        <div className="flex gap-3">
          <button
            onClick={handleReject}
            className="rounded-xl border border-red-400 px-4 py-2 text-red-500 hover:bg-red-50 transition font-semibold"
          >
            Reject
          </button>
          <button
            onClick={handleAccept}
            className="rounded-xl bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 transition font-semibold"
          >
            Accept
          </button>
        </div>

      </div>

    </div>
  );
}
