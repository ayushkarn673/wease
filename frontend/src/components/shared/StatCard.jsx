import { cn } from "@/lib/utils";

const TONES = {
  blue: "bg-brand-50 text-brand-600",
  amber: "bg-amber-50 text-amber-600",
  emerald: "bg-emerald-50 text-emerald-600",
  violet: "bg-violet-50 text-violet-600",
};

export default function StatCard({ label, value, hint, icon: Icon, tone = "blue" }) {
  return (
    <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 sm:p-5">
      {Icon && (
        <span className={cn("flex size-10 items-center justify-center rounded-xl", TONES[tone])}>
          <Icon className="size-5" />
        </span>
      )}
      <p className="mt-3 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">{value}</p>
      <p className="mt-0.5 text-sm font-medium text-neutral-600">{label}</p>
      {hint && <p className="text-xs text-neutral-400">{hint}</p>}
    </div>
  );
}
