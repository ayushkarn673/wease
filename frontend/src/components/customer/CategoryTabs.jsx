import { useState } from "react";
import { Hammer, Paintbrush, Zap, Droplet, BrickWall, Sparkles, Wind, Construction } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  { id: "ALL", name: "All Services", icon: Sparkles },
  { id: "CARPENTER", name: "Carpenter", icon: Hammer },
  { id: "PAINTER", name: "Painter", icon: Paintbrush },
  { id: "ELECTRICIAN", name: "Electrician", icon: Zap },
  { id: "PLUMBER", name: "Plumber", icon: Droplet },
  { id: "MASON", name: "Mason", icon: BrickWall },
  { id: "CLEANER", name: "Cleaner", icon: Sparkles },
  { id: "AC_TECHNICIAN", name: "AC Repair", icon: Wind },
  { id: "LABOURER", name: "Labour", icon: Construction },
];

export default function CategoryTabs({ activeCategory, onChange }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
        Categories
      </h3>
      
      <div className="flex items-center gap-3 overflow-x-auto pb-3 scrollbar-none -mx-6 px-6 sm:mx-0 sm:px-0">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          
          return (
            <button
              key={cat.id}
              onClick={() => onChange(cat.id)}
              className={cn(
                "flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all duration-300 whitespace-nowrap border hover:scale-[1.02] active:scale-[0.98] select-none",
                isActive
                  ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/25 dark:shadow-blue-500/10"
                  : "bg-white border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700"
              )}
            >
              <Icon size={16} className={isActive ? "text-white" : "text-slate-500"} />
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
