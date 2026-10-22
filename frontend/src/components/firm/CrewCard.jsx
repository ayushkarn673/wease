import { Link } from "react-router-dom";
import { CalendarDays, ChevronRight, Users } from "lucide-react";
import { formatCurrency, formatDate, professionLabel } from "@/lib/format";
import CrewStatusBadge from "./CrewStatusBadge";

// Summary row for a crew request, for either the customer or the firm.
export default function CrewCard({ crew, viewer = "customer" }) {
  const amount = crew.finalAmount ?? crew.estimatedTotal;
  return (
    <Link
      to={`/crew/${crew.id}`}
      className="group flex min-w-0 items-center gap-4 rounded-2xl border border-neutral-200/80 bg-white p-4 transition hover:ring-2 hover:ring-brand-200"
    >
      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
        <Users className="size-6" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <p className="truncate font-semibold text-neutral-900 group-hover:text-brand-700">
            {crew.workers} × {professionLabel(crew.profession)} · {viewer === "firm" ? crew.customerName : crew.firmName}
          </p>
          <CrewStatusBadge status={crew.status} />
        </div>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-sm text-neutral-500">
          <CalendarDays className="size-3.5" />
          From {formatDate(crew.startDate, { weekday: "short", day: "numeric", month: "short" })} · {crew.days}{" "}
          {crew.days === 1 ? "day" : "days"}
        </p>
        <p className="mt-1.5 flex flex-wrap items-center gap-2 text-sm">
          <span>
            <span className="text-neutral-500">{crew.finalAmount != null ? "Total" : "Estimate"} </span>
            <span className="font-semibold text-neutral-900">{formatCurrency(amount)}</span>
          </span>
          {viewer === "customer" && crew.status === "COMPLETED" && !crew.customerRating && (
            <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800">★ Rate the firm</span>
          )}
          {crew.customerRating && <span className="text-xs font-semibold text-amber-700">★ {crew.customerRating}</span>}
        </p>
      </div>
      <ChevronRight className="size-5 shrink-0 text-neutral-400 transition group-hover:translate-x-0.5 group-hover:text-brand-600" />
    </Link>
  );
}