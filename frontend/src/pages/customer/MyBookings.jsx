import { useEffect, useState } from "react";
import { getCustomerBookings } from "../../services/bookingService";
import BookingCard from "../../components/booking/BookingCard";

export default function MyBookings() {

    const [bookings,setBookings]=useState([]);
    const [loading,setLoading]=useState(true);

    useEffect(()=>{
        loadBookings();
    },[]);

    async function loadBookings(){

        try{

            const data=await getCustomerBookings();

            setBookings(data);

        }catch(err){

            console.error(err);

        }finally{

            setLoading(false);

        }

    }

    if(loading){

        return(
            <div className="p-8">
                Loading Bookings...
            </div>
        );

    }

    return(

        <div className="max-w-6xl mx-auto p-8">

            <h1 className="text-4xl font-bold mb-8">

                My Bookings

            </h1>

            {bookings.length===0 ? (

                <div className="rounded-3xl bg-white shadow p-10 text-center">

                    <h2 className="text-2xl font-semibold">

                        No bookings yet

                    </h2>

                    <p className="text-slate-500 mt-2">

                        Book a worker to see your bookings here.

                    </p>

                </div>

            ) : (

                <div className="space-y-6">

                    {bookings.map((booking)=>(

                        <BookingCard
                            key={booking.bookingId}
                            booking={booking}
                        />

                    ))}

                </div>

            )}

        </div>

    );

}
