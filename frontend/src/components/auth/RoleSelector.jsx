import { User, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RoleSelector({ value, onChange }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm font-semibold text-slate-700 dark:text-slate-350">
        Choose account type
      </label>
      
      <div className="grid grid-cols-2 gap-4">
        
        {/* Customer Card */}
        <div
          onClick={() => onChange("customer")}
          className={cn(
            "cursor-pointer border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 text-center transition hover:border-blue-500 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 select-none",
            value === "customer" && "border-blue-600 dark:border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 ring-2 ring-blue-600/20"
          )}
        >
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-850 text-slate-655 dark:text-slate-400 transition-colors",
            value === "customer" && "bg-blue-600 text-white dark:bg-blue-500"
          )}>
            <User size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Customer</h4>
            <p className="text-[11px] text-slate-450 dark:text-slate-500 font-medium mt-0.5">I want to hire workers</p>
          </div>
        </div>

        {/* Worker Card */}
        <div
          onClick={() => onChange("worker")}
          className={cn(
            "cursor-pointer border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 text-center transition hover:border-blue-500 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 select-none",
            value === "worker" && "border-blue-600 dark:border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 ring-2 ring-blue-600/20"
          )}
        >
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-850 text-slate-655 dark:text-slate-400 transition-colors",
            value === "worker" && "bg-blue-600 text-white dark:bg-blue-500"
          )}>
            <Briefcase size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Worker</h4>
            <p className="text-[11px] text-slate-455 dark:text-slate-500 font-medium mt-0.5">I want to offer services</p>
          </div>
        </div>

      </div>
    </div>
  );
}
