import { useState } from "react";
import { completeBooking } from "../../services/bookingService";

export default function JobCard({
    booking,
    onUpdate
}){

    const [loading,setLoading]=useState(false);

    async function handleComplete(){

        setLoading(true);

        try{

            await completeBooking(
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

        <div className="rounded-3xl bg-white border p-6 shadow">

            <div className="flex justify-between">

                <div>

                    <h2 className="text-xl font-bold">

                        {booking.customerName}

                    </h2>

                    <p className="text-gray-500">

                        {booking.profession}

                    </p>

                </div>

                <span className="bg-blue-100 text-blue-700 rounded-full px-3 py-1">

                    ACCEPTED

                </span>

            </div>

            <div className="mt-5 space-y-2">

                <p>📅 {booking.bookingDate}</p>

                <p>🕒 {booking.bookingTime}</p>

                <p>📍 {booking.serviceAddress}</p>

            </div>

            <div className="mt-6 flex justify-between items-center">

                <h2 className="text-2xl font-bold text-blue-600">

                    ₹{booking.estimatedPrice}

                </h2>

                <button

                    disabled={loading}

                    onClick={handleComplete}

                    className="bg-green-600 text-white px-5 py-2 rounded-xl disabled:opacity-50"

                >

                    {loading ? "Completing..." : "Complete Job"}

                </button>

            </div>

        </div>

    );

}
