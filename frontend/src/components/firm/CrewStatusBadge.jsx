import { cn } from "@/lib/utils";

const STATUS = {
  PENDING: { label: "Awaiting response", className: "bg-amber-50 text-amber-800 ring-amber-200" },
  ACCEPTED: { label: "Confirmed", className: "bg-sky-50 text-sky-700 ring-sky-200" },
  COMPLETED: { label: "Completed", className: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  REJECTED: { label: "Declined", className: "bg-red-50 text-red-700 ring-red-200" },
  CANCELLED: { label: "Cancelled", className: "bg-neutral-100 text-neutral-600 ring-neutral-200" },
};

export default function CrewStatusBadge({ status, className }) {
  const s = STATUS[status] ?? STATUS.PENDING;
  return (
    <span className={cn("inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset", s.className, className)}>
      {s.label}
    </span>
  );
}