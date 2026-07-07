import React from "react";

export default function RequestCard({
  booking,
  onAccept,
  onReject,
}) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow border border-slate-100">

      <div className="flex justify-between">

        <div>

          <h2 className="text-xl font-bold">
            {booking.customerName}
          </h2>

          <p className="text-slate-500">
            {booking.profession}
          </p>

        </div>

        <span className="rounded-full bg-yellow-100 px-3 py-1 text-yellow-700 font-semibold">

          {booking.status}

        </span>

      </div>

      <div className="mt-5 space-y-2 text-slate-600">

        <p>📅 {booking.bookingDate}</p>

        <p>🕒 {booking.bookingTime}</p>

        <p>📍 {booking.serviceAddress}</p>

      </div>

      <div className="mt-6 flex justify-between items-center">

        <h3 className="text-2xl font-bold text-blue-600">

          ₹{booking.estimatedPrice}

        </h3>

        <div className="flex gap-3">

          <button
            onClick={() => onReject(booking.bookingId)}
            className="rounded-xl border border-red-500 px-4 py-2 text-red-500 hover:bg-red-50"
          >
            Reject
          </button>

          <button
            onClick={() => onAccept(booking.bookingId)}
            className="rounded-xl bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
          >
            Accept
          </button>

        </div>

      </div>

    </div>
  );
}
