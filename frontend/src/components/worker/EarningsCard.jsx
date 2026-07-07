import { TrendingUp, Calendar } from "lucide-react";

export default function EarningsCard({ todayEarnings, monthEarnings }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition hover:shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-bold text-gray-800 text-sm">Earnings Overview</h4>
        <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
          <TrendingUp size={16} />
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Today
          </p>
          <h3 className="text-2xl font-black text-emerald-600 mt-0.5">
            ₹{todayEarnings || 0}
          </h3>
        </div>

        <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <Calendar size={12} />
              This Month
            </p>
            <h4 className="text-lg font-black text-gray-800 mt-0.5">
              ₹{monthEarnings || 0}
            </h4>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
            +12% vs last month
          </span>
        </div>
      </div>
    </div>
  );
}
