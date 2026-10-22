import { Link } from "react-router-dom";
import { ChevronRight, Users } from "lucide-react";
import { coverageLabel, formatCurrency, professionLabel } from "@/lib/format";
import FirmAvatar from "./FirmAvatar";
import { RatingBadge } from "../review/StarRating";
import RequestCrewButton from "./RequestCrewButton";

// One labour firm in the open directory list (same hairline-separated style as professionals).
export default function FirmRow({ firm, profession }) {
  const path = `/firms/${firm.id}`;
  return (
    <article className="group flex min-w-0 gap-4 border-b border-neutral-200/80 py-5 sm:gap-5">
      <Link to={path} tabIndex={-1} aria-hidden="true">
        <FirmAvatar name={firm.companyName} />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Link to={path} className="flex items-center gap-2 text-base font-semibold text-neutral-900 hover:text-brand-700 sm:text-lg">
              <span className="truncate">{firm.companyName}</span>
              <RatingBadge average={firm.averageRating} count={firm.reviewCount} className="shrink-0" />
            </Link>
            <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-sm text-neutral-500">
              <span className="font-medium text-neutral-700">Labour firm</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1">
                <Users className="size-3.5" />
                Team of {firm.teamSize}
              </span>
              <span aria-hidden="true">·</span>
              <span>{coverageLabel(firm)}</span>
            </p>
          </div>
          <div className="hidden shrink-0 text-right sm:block">
            <p className="text-lg font-bold leading-tight text-neutral-900">{formatCurrency(firm.lowestDailyRate)}</p>
            <p className="text-xs text-neutral-500">from, per worker / day</p>
          </div>
        </div>

        <ul className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-600">
          {firm.rates.map((r) => (
            <li key={r.profession}>
              {professionLabel(r.profession)} <span className="font-semibold text-neutral-900">{formatCurrency(r.dailyRate)}</span>
              <span className="text-neutral-400">/day</span>
            </li>
          ))}
        </ul>

        <div className="mt-3 flex items-center justify-end gap-1">
          <Link to={path} className="inline-flex h-9 items-center gap-0.5 rounded-full px-3 text-sm font-semibold text-neutral-700 transition hover:bg-white hover:text-brand-700">
            Details
            <ChevronRight className="size-4" />
          </Link>
          <RequestCrewButton firm={firm} profession={profession} size="sm" />
        </div>
      </div>
    </article>
  );
}