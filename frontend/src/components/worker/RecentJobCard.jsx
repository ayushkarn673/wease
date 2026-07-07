export default function RecentJobCard({ booking }) {
  const getFriendlyDate = (dateStr) => {
    const today = new Date();
    const targetDate = new Date(dateStr);
    
    const diffTime = today - targetDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return dateStr;
  };

  return (
    <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition">
      <div>
        <h4 className="font-bold text-gray-800">{booking.customerName}</h4>
        <div className="flex gap-2 items-center mt-1 text-xs text-gray-400 font-medium">
          <span>📅 {getFriendlyDate(booking.bookingDate)}</span>
          <span>•</span>
          <span>🕒 {booking.bookingTime}</span>
        </div>
      </div>
      <div className="text-right">
        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
          {booking.status}
        </span>
        <h4 className="text-lg font-black text-gray-800 mt-2">
          ₹{booking.finalPrice || booking.estimatedPrice}
        </h4>
      </div>
    </div>
  );
}
