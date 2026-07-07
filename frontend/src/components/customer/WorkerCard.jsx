import { useState } from "react";
import { MapPin, Briefcase, BadgeCheck } from "lucide-react";
import BookingModal from "../booking/BookingModal";
import BookingForm from "../booking/BookingForm";

export default function WorkerCard({ worker }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm hover:shadow-lg transition">

      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {worker.fullName}
          </h2>

          <p className="text-indigo-600 font-semibold text-sm">
            {worker.profession}
          </p>
        </div>

        {worker.verified && (
          <BadgeCheck className="text-emerald-500" />
        )}

      </div>

      <div className="mt-5 space-y-2 text-gray-600 text-sm">

        <p className="flex items-center gap-2">
          <Briefcase size={18} className="text-gray-400" />
          {worker.experience} Years Experience
        </p>

        <p className="flex items-center gap-2">
          <MapPin size={18} className="text-gray-400" />
          {worker.address}
        </p>

      </div>

      <div className="mt-6 flex items-center justify-between">

        <span className="text-2xl font-black text-gray-800">
          ₹{worker.hourlyRate}
        </span>

        <button 
          onClick={() => setOpen(true)}
          className="rounded-2xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all"
        >
          Book Now
        </button>

      </div>

      <BookingModal
        worker={worker}
        isOpen={open}
        onClose={() => setOpen(false)}
      >
        <BookingForm
          worker={worker}
          onClose={() => setOpen(false)}
        />
      </BookingModal>

    </div>
  );
}
