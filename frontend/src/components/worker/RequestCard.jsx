export default function RequestCard({ booking, onAccept, onReject }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition duration-200">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-gray-800">
            {booking.customerName}
          </h3>
          <p className="text-sm text-indigo-600 font-medium mt-0.5">
             🔧 Service Requested
          </p>
        </div>
        <span className="text-2xl font-black text-gray-800">
          ₹{booking.estimatedPrice}
        </span>
      </div>

      {booking.description && (
        <div className="mt-4 p-3 bg-slate-50 rounded-2xl text-sm text-gray-600 border border-gray-100">
          <p className="font-semibold text-gray-700 mb-1">Details:</p>
          {booking.description}
        </div>
      )}

      <div className="mt-5 grid grid-cols-3 gap-3 text-sm text-gray-600">
        <div className="flex items-center gap-1.5">
          <span className="text-gray-400">📅</span>
          <span>{booking.bookingDate}</span>
        </div>
        <div className="flex items-center gap-1.5 col-span-2">
          <span className="text-gray-400">🕒</span>
          <span>{booking.bookingTime}</span>
        </div>
        <div className="flex items-center gap-1.5 col-span-3 mt-1">
          <span className="text-gray-400">📍</span>
          <span className="truncate">{booking.serviceAddress}</span>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => onReject(booking.bookingId)}
          className="flex-1 rounded-2xl border border-red-200 py-3 text-sm font-bold text-red-600 hover:bg-red-50 transition active:scale-95"
        >
          Reject
        </button>
        <button
          onClick={() => onAccept(booking.bookingId)}
          className="flex-1 rounded-2xl bg-indigo-600 py-3 text-sm font-bold text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 transition active:scale-95"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
