import { useState } from "react";
import {
  acceptBooking,
  rejectBooking,
} from "../../services/bookingService";

export default function RequestCard({
  booking,
  onUpdate,
}) {

  const [loading,setLoading]=useState(false);

  async function handleAccept(){

      setLoading(true);

      try{

          await acceptBooking(
              booking.bookingId
          );

          onUpdate();

      }catch(err){

          console.error(err);

      }finally{

          setLoading(false);

      }

  }

  async function handleReject(){

      setLoading(true);

      try{

          await rejectBooking(
              booking.bookingId
          );

          onUpdate();

      }catch(err){

          console.error(err);

      }finally{

          setLoading(false);

      }

  }

  return(

      <div className="rounded-3xl bg-white p-6 shadow border">

          <div className="flex justify-between">

              <div>

                  <h2 className="text-xl font-bold">

                      {booking.customerName}

                  </h2>

                  <p className="text-slate-500">

                      {booking.profession}

                  </p>

              </div>

              <span className="rounded-full bg-yellow-100 px-3 py-1 text-yellow-700">

                  {booking.status}

              </span>

          </div>

          <div className="mt-5 space-y-2">

              <p>📅 {booking.bookingDate}</p>

              <p>🕒 {booking.bookingTime}</p>

              <p>📍 {booking.serviceAddress}</p>

              <p>

                  ₹{booking.estimatedPrice}

              </p>

          </div>

          <div className="mt-6 flex gap-3 justify-end">

              <button

                  disabled={loading}

                  onClick={handleReject}

                  className="px-4 py-2 rounded-xl border border-red-500 text-red-500 disabled:opacity-50"

              >

                  Reject

              </button>

              <button

                  disabled={loading}

                  onClick={handleAccept}

                  className="px-4 py-2 rounded-xl bg-blue-600 text-white disabled:opacity-50"

              >

                  {loading ? "Processing..." : "Accept"}

              </button>

          </div>

      </div>

  );

}
