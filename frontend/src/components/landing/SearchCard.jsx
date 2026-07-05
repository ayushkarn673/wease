import { MapPin, Briefcase, CalendarDays, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchCard() {
  const [location, setLocation] = useState("");
  const [service, setService] = useState("");
  const [schedule, setSchedule] = useState("Now");
  const navigate = useNavigate();

  const services = [
    "Carpenter",
    "Painter",
    "Electrician",
    "Plumber",
    "Cleaner",
    "Mason",
    "AC Repair",
    "Labour",
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams({
      service,
      location: location || "Lucknow, UP",
      schedule,
    }).toString();
    navigate(`/customer/workers?${query}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="-mt-14 relative z-20 px-6"
    >
      <form
        onSubmit={handleSearch}
        className="max-w-7xl mx-auto rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Location */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-805 p-4 hover:border-blue-500 dark:hover:border-blue-500 transition">
            <label className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2">
              <MapPin size={18} className="text-blue-600 dark:text-blue-400" />
              Location
            </label>

            <input
              type="text"
              placeholder="Enter your city"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-transparent outline-none font-medium text-slate-900 dark:text-white"
            />
          </div>

          {/* Service */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-805 p-4 hover:border-blue-500 dark:hover:border-blue-500 transition">
            <label className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2">
              <Briefcase size={18} className="text-blue-600 dark:text-blue-400" />
              Service
            </label>

            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full bg-transparent outline-none font-medium text-slate-900 dark:text-white cursor-pointer"
            >
              <option value="" className="bg-white dark:bg-slate-900">
                Select Service
              </option>

              {services.map((item) => (
                <option
                  key={item}
                  value={item}
                  className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                >
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Schedule */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-805 p-4 hover:border-blue-500 dark:hover:border-blue-500 transition">
            <label className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2">
              <CalendarDays size={18} className="text-blue-600 dark:text-blue-400" />
              Schedule
            </label>

            <select
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              className="w-full bg-transparent outline-none font-medium text-slate-900 dark:text-white cursor-pointer"
            >
              <option className="bg-white dark:bg-slate-900">Now</option>
              <option className="bg-white dark:bg-slate-900">Today</option>
              <option className="bg-white dark:bg-slate-900">Tomorrow</option>
              <option className="bg-white dark:bg-slate-900">Schedule Later</option>
            </select>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="rounded-2xl bg-blue-600 hover:bg-blue-700 transition text-white font-semibold flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
          >
            <Search size={20} />
            Find Workers
          </button>
        </div>
      </form>
    </motion.div>
  );
}
