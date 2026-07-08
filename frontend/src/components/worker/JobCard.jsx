export default function JobCard({ booking }) {
  const getFriendlyDate = (dateStr) => {
    if (!dateStr) return "";
    const today = new Date();
    const target = new Date(dateStr);
    const diffDays = Math.floor((today - target) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return dateStr;
  };

  return (
    <div className="rounded-3xl bg-white p-5 border border-slate-100 shadow-sm flex justify-between items-center hover:shadow-md transition">

      <div>
        <h3 className="font-bold text-gray-800">
          {booking.customerName}
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          {booking.profession}
        </p>
        <div className="flex gap-4 mt-2 text-sm text-slate-400">
          <span>📅 {getFriendlyDate(booking.bookingDate)}</span>
          <span>🕒 {booking.bookingTime}</span>
        </div>
      </div>

      <div className="text-right">
        <span className="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full uppercase tracking-wider">
          {booking.status}
        </span>
        <p className="text-xl font-black text-gray-800 mt-2">
          ₹{booking.finalPrice || booking.estimatedPrice}
        </p>
      </div>

    </div>
  );
}
