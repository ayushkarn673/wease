import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Navigation, Calendar, Wrench } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export default function SearchCard() {
  const [location, setLocation] = useState("");
  const [service, setService] = useState("");
  const [schedule, setSchedule] = useState("Now");
  const navigate = useNavigate();

  const servicesList = [
    "Carpenter",
    "Painter",
    "Electrician",
    "Plumber",
    "Cleaner",
    "Mason",
    "AC Repair",
    "Labour"
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams({
      service,
      location: location || "Lucknow, UP",
      schedule
    }).toString();
    navigate(`/customer/workers?${query}`);
  };

  return (
    <section className="relative -mt-12 sm:-mt-20 z-25 max-w-5xl mx-auto px-6 w-full animate-fade-in-up">
      <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-[24px] p-6 sm:p-8 shadow-xl shadow-slate-100/50 dark:shadow-none">
        <form onSubmit={handleSearch} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          
          {/* Location Field */}
          <div className="lg:col-span-4 flex flex-col gap-2">
            <span className="flex items-center gap-1 text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">
              <MapPin className="size-3.5 text-blue-600 dark:text-blue-400" />
              Location
            </span>
            <div className="relative">
              <Input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Lucknow, UP"
                className="pl-4 pr-10 h-12 rounded-[16px] border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 text-sm focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all font-semibold"
              />
              <button
                type="button"
                onClick={() => setLocation("Lucknow, UP")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-blue-600 transition-colors"
                title="Use current location"
              >
                <Navigation className="size-4" />
              </button>
            </div>
          </div>

          {/* Service Dropdown */}
          <div className="lg:col-span-4 flex flex-col gap-2">
            <span className="flex items-center gap-1 text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">
              <Wrench className="size-3.5 text-blue-600 dark:text-blue-400" />
              Service
            </span>
            <div className="relative">
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="h-12 w-full pl-4 pr-10 rounded-[16px] border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 text-sm text-slate-700 dark:text-slate-300 font-semibold focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all appearance-none cursor-pointer"
              >
                <option value="">Select Service</option>
                {servicesList.map((srv) => (
                  <option key={srv} value={srv} className="font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900">
                    {srv}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-400 dark:border-t-slate-650" />
            </div>
          </div>

          {/* Schedule Picker */}
          <div className="lg:col-span-2 flex flex-col gap-2">
            <span className="flex items-center gap-1 text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">
              <Calendar className="size-3.5 text-blue-600 dark:text-blue-400" />
              Schedule
            </span>
            <div className="flex bg-slate-100/80 dark:bg-slate-950/40 p-1 rounded-[16px] h-12 w-full">
              {["Now", "Later"].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSchedule(option)}
                  className={`flex-1 rounded-[12px] text-xs font-bold transition-all ${
                    schedule === option
                      ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Search CTA */}
          <div className="lg:col-span-2 w-full">
            <Button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/10 rounded-[16px] font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
            >
              <Search className="size-4.5" />
              Find Workers
            </Button>
          </div>

        </form>
      </Card>
    </section>
  );
}
