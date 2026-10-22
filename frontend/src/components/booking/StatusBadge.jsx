import { cn } from "@/lib/utils";

const STATUS = {
  PENDING: { label: "Awaiting response", className: "bg-amber-50 text-amber-700 ring-amber-200", dot: "bg-amber-500" },
  ACCEPTED: { label: "Confirmed", className: "bg-brand-50 text-brand-700 ring-brand-200", dot: "bg-brand-500" },
  IN_PROGRESS: { label: "In progress", className: "bg-indigo-50 text-indigo-700 ring-indigo-200", dot: "bg-indigo-500" },
  COMPLETED: { label: "Completed", className: "bg-emerald-50 text-emerald-700 ring-emerald-200", dot: "bg-emerald-500" },
  REJECTED: { label: "Declined", className: "bg-red-50 text-red-700 ring-red-200", dot: "bg-red-500" },
  CANCELLED: { label: "Cancelled", className: "bg-neutral-100 text-neutral-600 ring-neutral-200", dot: "bg-neutral-400" },
};

export default function StatusBadge({ status, className }) {
  const config = STATUS[status] ?? { label: status, className: "bg-neutral-100 text-neutral-600 ring-neutral-200", dot: "bg-neutral-400" };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        config.className,
        className
      )}
    >
      <span className={cn("size-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}
