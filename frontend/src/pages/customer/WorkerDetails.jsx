import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Star, ShieldCheck, Briefcase, MapPin, ArrowLeft, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getWorkerDetails } from "../../services/workerService";

const defaultAvatar = "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=200&h=200&fit=crop&crop=face";

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

export default function WorkerDetails() {
  const { id } = useParams();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = await getWorkerDetails(id);
        setWorker(data);
      } catch (err) {
        console.error("Error fetching worker details:", err);
        setError("Failed to load worker profile details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-slate-500 font-bold">
        Loading profile...
      </div>
    );
  }

  if (error || !worker) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center max-w-md mx-auto mt-12">
        <p className="text-red-600 font-semibold">{error || "Profile not found."}</p>
        <Link to="/customer/dashboard">
          <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
            Go back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  const ratingValue = worker.rating || 5.0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm transition"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* Main Details Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex gap-4 items-center">
            <img
              src={worker.profilePhoto || defaultAvatar}
              alt={worker.fullName}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border border-slate-100 dark:border-slate-800"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {worker.fullName}
                </h2>
                {worker.verified && (
                  <ShieldCheck size={20} className="text-blue-600 dark:text-blue-500" />
                )}
              </div>
              <p className="text-slate-500 font-semibold mt-0.5">
                {professionLabels[worker.profession] || worker.profession}
              </p>

              <div className="flex items-center gap-1.5 mt-2 bg-slate-50 dark:bg-slate-950 px-3 py-1 rounded-xl w-max">
                <Star size={16} className="text-amber-500 fill-amber-500" />
                <span className="text-sm font-extrabold text-slate-700 dark:text-slate-350">
                  {ratingValue.toFixed(1)} (12 reviews)
                </span>
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right w-full sm:w-auto">
            <p className="text-2xl font-black text-blue-600 dark:text-blue-500">
              ₹{worker.hourlyRate}
            </p>
            <p className="text-xs text-slate-400 font-bold tracking-wide uppercase mt-0.5">Starting visit rate</p>
          </div>
        </div>

        {/* Stats segment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div className="flex items-center gap-3 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl">
            <Briefcase size={22} className="text-slate-450" />
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Experience</p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">{worker.experience} Years</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl">
            <MapPin size={22} className="text-slate-450" />
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Location / Address</p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">{worker.address}</p>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-8 space-y-3">
          <h4 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2 text-base">
            <FileText size={18} className="text-slate-450" />
            About the Professional
          </h4>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-semibold">
            {worker.bio || "No description provided."}
          </p>
        </div>

        {/* Booking CTA Button */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-4">
          <div className="hidden sm:block">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Availability</p>
            <p className="text-sm font-bold text-green-600 mt-0.5">Available Today</p>
          </div>
          
          <Button
            onClick={() => navigate(`/book/${worker.id}`)}
            className="w-full sm:w-48 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2"
          >
            <Calendar size={18} />
            Book Service
          </Button>
        </div>
      </div>
    </div>
  );
}
