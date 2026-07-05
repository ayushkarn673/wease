import { useEffect, useState, useCallback } from "react";
import { Search } from "lucide-react";
import WelcomeCard from "../../components/customer/WelcomeCard";
import CategoryTabs from "../../components/customer/CategoryTabs";
import WorkerGrid from "../../components/customer/WorkerGrid";
import { getAvailableWorkers } from "../../services/workerService";

export default function CustomerDashboard() {
  const [workers, setWorkers] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 450);

    return () => clearTimeout(handler);
  }, [search]);

  // Fetch workers when category or search changes
  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        setLoading(true);
        const data = await getAvailableWorkers(category, debouncedSearch);
        setWorkers(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching workers:", err);
        setError("Could not load workers. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();
  }, [category, debouncedSearch]);

  const handleBookWorker = (worker) => {
    console.log("Book worker:", worker);
    // Modal or routing to booking page will be wired in Phase 4
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome banner */}
      <WelcomeCard />

      {/* Search Input Card */}
      <div className="relative w-full">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
          <Search size={20} />
        </div>
        <input
          type="text"
          placeholder="Search workers by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-14 pl-12 pr-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 outline-none transition font-semibold text-sm focus:border-blue-650 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/10 text-slate-700 dark:text-slate-250 placeholder:text-slate-400 placeholder:font-semibold shadow-sm"
        />
      </div>

      {/* Category Selection Tab Segment */}
      <CategoryTabs
        activeCategory={category}
        onChange={setCategory}
      />

      {/* Main Grid Section */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[200px] text-slate-500 font-bold">
          Searching for nearby workers...
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/60 rounded-3xl p-6 text-center text-red-600 dark:text-red-400 font-bold text-sm">
          {error}
        </div>
      ) : (
        <WorkerGrid
          workers={workers}
          onBook={handleBookWorker}
        />
      )}
    </div>
  );
}
