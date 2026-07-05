import { Star, ShieldCheck, Briefcase, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";

const defaultAvatar = "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&h=150&fit=crop&crop=face";

const professionLabels = {
  CARPENTER: "Carpenter",
  PAINTER: "Painter",
  ELECTRICIAN: "Electrician",
  PLUMBER: "Plumber",
  MASON: "Mason",
  CLEANER: "Cleaner",
  AC_TECHNICIAN: "AC Repair",
  LABOURER: "Labourer",
};

export default function WorkerCard({ worker, onBook }) {
  const ratingValue = worker.rating || 5.0;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Header: Photo and Info */}
        <div className="flex gap-4 items-start">
          <img
            src={worker.profilePhoto || defaultAvatar}
            alt={worker.fullName}
            className="w-16 h-16 rounded-2xl object-cover border border-slate-100 dark:border-slate-800"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="font-extrabold text-slate-900 dark:text-white truncate text-base">
                {worker.fullName}
              </h4>
              {worker.verified && (
                <ShieldCheck size={16} className="text-blue-600 dark:text-blue-500 flex-shrink-0" />
              )}
            </div>
            
            <p className="text-sm font-semibold text-slate-500 mt-0.5">
              {professionLabels[worker.profession] || worker.profession}
            </p>

            <div className="flex items-center gap-1.5 mt-2 bg-slate-50 dark:bg-slate-950 px-2 py-0.5 rounded-lg w-max">
              <Star size={14} className="text-amber-500 fill-amber-500" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-350">
                {ratingValue.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Info Rows */}
        <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <Briefcase size={16} className="text-slate-400" />
            <div>
              <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">Experience</p>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{worker.experience} Years</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <MapPin size={16} className="text-slate-400" />
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">Rate</p>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5 truncate">
                ₹{worker.hourlyRate}/hr
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <Link
          to={`/customer/worker/${worker.id}`}
          className="flex-1"
        >
          <Button
            variant="outline"
            className="w-full h-11 rounded-xl text-slate-655 dark:text-slate-300 border border-slate-200 dark:border-slate-800 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-950"
          >
            View Profile
          </Button>
        </Link>
        
        <Button
          onClick={() => onBook(worker)}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs"
        >
          Book Now
        </Button>
      </div>
    </div>
  );
}
