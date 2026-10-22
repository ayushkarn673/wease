import { Briefcase, Building2, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "customer", label: "I need a service", hint: "Book professionals", icon: Home },
  { value: "worker", label: "I'm a professional", hint: "Get booking requests", icon: Briefcase },
  { value: "firm", label: "We supply labour", hint: "List your firm's crews", icon: Building2 },
];

export default function RoleSelector({ value, onChange }) {
  return (
    <div role="radiogroup" aria-label="Account type" className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {OPTIONS.map(({ value: option, label, hint, icon: Icon }) => {
        const selected = value === option;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option)}
            className={cn(
              "flex flex-col items-start gap-3 rounded-lg border p-4 text-left transition",
              selected ? "border-brand-600 bg-brand-50/60 ring-1 ring-brand-600" : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
            )}
          >
            <span
              className={cn(
                "flex size-9 items-center justify-center rounded-lg",
                selected ? "bg-brand-600 text-white" : "bg-neutral-100 text-neutral-500"
              )}
            >
              <Icon className="size-[18px]" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-neutral-900">{label}</span>
              <span className="block text-xs text-neutral-500">{hint}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
