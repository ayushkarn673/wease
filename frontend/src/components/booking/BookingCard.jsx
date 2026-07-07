import { useNavigate } from "react-router-dom";

export default function BookingCard({ booking }) {
  const navigate = useNavigate();

  const getStatusLabel = () => {
    switch (booking.status) {
      case "PENDING":
        return "🟡 Pending";
      case "ACCEPTED":
        return "🔵 Accepted";
      case "REJECTED":
        return "🔴 Rejected";
      case "IN_PROGRESS":
        return "🟣 In Progress";
      case "COMPLETED":
        return "🟢 Completed";
      case "CANCELLED":
        return "⚫ Cancelled";
      default:
        return `⚪ ${booking.status}`;
    }
  };

  return (
    <div 
      onClick={() => navigate(`/booking/${booking.bookingId}`)}
      className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 hover:shadow-md transition cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
    >
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-gray-800">
          {booking.workerName}
        </h2>
        <p className="text-indigo-600 font-semibold text-sm">
          {booking.profession}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-slate-500">
          <p>📅 {booking.bookingDate}</p>
          <p>🕒 {booking.bookingTime}</p>
          <p className="col-span-2">📍 {booking.serviceAddress}</p>
        </div>
      </div>

      <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 gap-4">
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase md:text-right">Estimated Price</p>
          <h3 className="text-2xl font-black text-gray-800 mt-0.5">
            ₹{booking.estimatedPrice}
          </h3>
        </div>

        <div className="text-right">
          <p className="text-xs text-gray-400 font-medium uppercase mb-1 hidden md:block">Status</p>
          <span className="inline-block rounded-full bg-slate-50 border border-slate-200/50 px-4 py-1 text-sm font-bold text-slate-700 shadow-sm">
            {getStatusLabel()}
          </span>
        </div>
      </div>
    </div>
  );
}
