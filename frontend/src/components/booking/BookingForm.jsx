import { useState } from "react";
import { createBooking } from "../../services/bookingService";

export default function BookingForm({
  worker,
  onClose,
}) {

  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [serviceAddress, setServiceAddress] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await createBooking({

        workerProfileId: worker.id,

        bookingDate,

        bookingTime,

        serviceAddress,

        description,

      });

      alert("Booking Created Successfully!");

      onClose();

    } catch (err) {

      console.error(err);

      alert("Booking Failed");

    }

  };

  return (

    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >

      <input
        type="date"
        className="w-full rounded-xl border p-3"
        value={bookingDate}
        onChange={(e)=>setBookingDate(e.target.value)}
      />

      <input
        type="time"
        className="w-full rounded-xl border p-3"
        value={bookingTime}
        onChange={(e)=>setBookingTime(e.target.value)}
      />

      <input
        placeholder="Service Address"
        className="w-full rounded-xl border p-3"
        value={serviceAddress}
        onChange={(e)=>setServiceAddress(e.target.value)}
      />

      <textarea
        rows="4"
        placeholder="Describe the work..."
        className="w-full rounded-xl border p-3"
        value={description}
        onChange={(e)=>setDescription(e.target.value)}
      />

      <div className="flex items-center justify-between">

        <div>

          <p className="text-gray-500">
            Estimated Price
          </p>

          <h3 className="text-2xl font-bold text-blue-600">

            ₹{worker.hourlyRate}

          </h3>

        </div>

        <button
          className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Confirm Booking
        </button>

      </div>

    </form>

  );

}
