export default function BookingCard({ booking }) {

    return (

        <div className="rounded-3xl bg-white p-6 shadow">

            <div className="flex justify-between">

                <div>

                    <h2 className="text-xl font-bold">
                        {booking.workerName}
                    </h2>

                    <p>
                        {booking.profession}
                    </p>

                </div>

                <span className="rounded-full bg-yellow-100 px-4 py-1">

                    {booking.status}

                </span>

            </div>

            <div className="mt-4">

                <p>
                    📅 {booking.bookingDate}
                </p>

                <p>
                    🕒 {booking.bookingTime}
                </p>

                <p className="font-bold text-blue-600">

                    ₹{booking.estimatedPrice}

                </p>

            </div>

        </div>

    );

}
