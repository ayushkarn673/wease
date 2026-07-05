import { MapPin, Briefcase, BadgeCheck } from "lucide-react";

export default function WorkerCard({ worker }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm hover:shadow-lg transition">

      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-xl font-bold">
            {worker.fullName}
          </h2>

          <p className="text-slate-500">
            {worker.profession}
          </p>
        </div>

        {worker.verified && (
          <BadgeCheck className="text-blue-600" />
        )}

      </div>

      <div className="mt-5 space-y-2">

        <p className="flex items-center gap-2">
          <Briefcase size={18} />
          {worker.experience} Years Experience
        </p>

        <p className="flex items-center gap-2">
          <MapPin size={18} />
          {worker.address}
        </p>

      </div>

      <div className="mt-6 flex items-center justify-between">

        <span className="text-2xl font-bold text-blue-600">
          ₹{worker.hourlyRate}
        </span>

        <button className="rounded-xl bg-blue-600 px-5 py-2 text-white hover:bg-blue-700">
          Book Now
        </button>

      </div>

    </div>
  );
}
