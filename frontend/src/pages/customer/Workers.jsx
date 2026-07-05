import { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Star, Shield, Clock, MapPin, SlidersHorizontal, ArrowLeft } from "lucide-react";
import PublicLayout from "../../layouts/PublicLayout";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

// Mock worker data mapping services
const MOCK_WORKERS = [
  {
    id: 1,
    name: "Rahul Sharma",
    service: "Carpenter",
    rating: 4.9,
    jobs: 142,
    experience: 5,
    price: 499,
    availability: "Available Now",
    photo: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400",
  },
  {
    id: 2,
    name: "Aman Gupta",
    service: "Painter",
    rating: 4.8,
    jobs: 98,
    experience: 4,
    price: 599,
    availability: "Available Now",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
  },
  {
    id: 3,
    name: "Vikram Singh",
    service: "Electrician",
    rating: 4.7,
    jobs: 110,
    experience: 6,
    price: 399,
    availability: "Booked",
    photo: "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=400",
  },
  {
    id: 4,
    name: "Sanjay Kumar",
    service: "Plumber",
    rating: 4.9,
    jobs: 160,
    experience: 8,
    price: 449,
    availability: "Available Now",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
  },
  {
    id: 5,
    name: "Neha Verma",
    service: "Cleaner",
    rating: 4.9,
    jobs: 210,
    experience: 3,
    price: 299,
    availability: "Available Now",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
  },
  {
    id: 6,
    name: "Karan Johar",
    service: "AC Repair",
    rating: 4.6,
    jobs: 76,
    experience: 4,
    price: 699,
    availability: "Available Now",
    photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400",
  },
];

export default function Workers() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialService = searchParams.get("service") || "";
  const initialLocation = searchParams.get("location") || "Lucknow, UP";

  const [selectedService, setSelectedService] = useState(initialService);
  const [maxPrice, setMaxPrice] = useState(800);
  const [minRating, setMinRating] = useState(0);

  // Filter logic
  const filteredWorkers = useMemo(() => {
    return MOCK_WORKERS.filter((worker) => {
      const matchService = selectedService ? worker.service.toLowerCase() === selectedService.toLowerCase() : true;
      const matchPrice = worker.price <= maxPrice;
      const matchRating = worker.rating >= minRating;
      return matchService && matchPrice && matchRating;
    });
  }, [selectedService, maxPrice, minRating]);

  return (
    <PublicLayout>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
        <Container>
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white mb-2 transition-colors"
              >
                <ArrowLeft className="size-4" />
                Back
              </button>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Available Workers
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                <MapPin className="size-4 text-blue-600 dark:text-blue-400" />
                Showing experts in <span className="font-semibold text-slate-800 dark:text-slate-200">{initialLocation}</span>
              </p>
            </div>
            
            <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              Found <span className="text-blue-600 dark:text-blue-400">{filteredWorkers.length}</span> professionals
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Filters Sidebar */}
            <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
                <SlidersHorizontal className="size-4 text-slate-900 dark:text-white" />
                <h2 className="font-bold text-slate-900 dark:text-white">Filters</h2>
              </div>

              {/* Service Filter */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Service Category
                </label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30 text-sm font-semibold text-slate-700 dark:text-slate-355 focus-visible:outline-none"
                >
                  <option value="">All Services</option>
                  {["Carpenter", "Painter", "Electrician", "Plumber", "Cleaner", "AC Repair"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Max Price
                  </label>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">₹{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="800"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Minimum Rating
                </label>
                <div className="flex flex-col gap-2">
                  {[0, 4.7, 4.8, 4.9].map((rating) => (
                    <label key={rating} className="flex items-center gap-2 text-sm text-slate-650 dark:text-slate-350 font-semibold cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        checked={minRating === rating}
                        onChange={() => setMinRating(rating)}
                        className="accent-blue-600 size-4"
                      />
                      {rating === 0 ? "Any Rating" : `${rating} ★ & Above`}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Workers Grid */}
            <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredWorkers.length > 0 ? (
                filteredWorkers.map((worker) => (
                  <Card
                    key={worker.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-805 rounded-[24px] p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="flex items-start gap-4">
                      {/* Photo */}
                      <img
                        src={worker.photo}
                        alt={worker.name}
                        className="h-20 w-20 rounded-2xl object-cover border border-slate-100 dark:border-slate-800"
                      />
                      
                      {/* Name, Service, Rating */}
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">
                            {worker.name}
                          </h3>
                          <Shield className="size-4 text-blue-600 dark:text-blue-400 shrink-0" title="Verified Worker" />
                        </div>
                        <p className="text-sm font-semibold text-slate-400 mt-0.5">
                          {worker.service}
                        </p>
                        
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                            <Star className="size-4 fill-amber-500 text-amber-500" />
                            {worker.rating}
                          </div>
                          <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
                            {worker.jobs} Jobs
                          </span>
                          <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
                            {worker.experience} yrs exp
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Details */}
                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Rate</span>
                        <span className="font-extrabold text-blue-600 dark:text-blue-400 text-lg">
                          ₹{worker.price} <span className="text-xs text-slate-500 dark:text-slate-450 font-normal">/ Visit</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-md ${
                          worker.availability === "Available Now"
                            ? "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-450"
                        }`}>
                          {worker.availability}
                        </span>
                        
                        <Button
                          onClick={() => navigate(`/booking?worker=${worker.id}`)}
                          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm px-4 h-9 text-xs font-bold"
                        >
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-slate-500">
                  No workers match your selected filters. Try broadening your criteria.
                </div>
              )}
            </div>

          </div>

        </Container>
      </div>
    </PublicLayout>
  );
}
