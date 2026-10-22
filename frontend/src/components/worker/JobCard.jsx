import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate, formatTime, todayIso } from "@/lib/format";
import UserAvatar from "../shared/UserAvatar";

// Where the job stands with the quote, and what the worker should do next.
const STAGE = {
  NONE: { label: "Inspect and send a quote", className: "bg-sky-50 text-sky-700" },
  DECLINED: { label: "Quote declined", className: "bg-red-50 text-red-700" },
  AWAITING_APPROVAL: { label: "Waiting for approval", className: "bg-amber-50 text-amber-800" },
  APPROVED: { label: "Quote approved — do the work", className: "bg-emerald-50 text-emerald-700" },
};

// A confirmed job. Quotes, completion and payment are handled on the booking page.
export default function JobCard({ booking }) {
  const isToday = booking.bookingDate === todayIso();
  const stage = STAGE[booking.quoteState] ?? STAGE.NONE;

  return (
    <article className="rounded-2xl border border-neutral-200/80 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <UserAvatar name={booking.customerName} />
          <div>
            <p className="font-semibold text-neutral-900">{booking.customerName}</p>
            <p className="text-sm text-neutral-500">Booking #{booking.bookingId}</p>
          </div>
        </div>
        {isToday && <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">Today</span>}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-neutral-600">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="size-4 text-neutral-400" />
          {formatDate(booking.bookingDate, { weekday: "short", day: "numeric", month: "short" })}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="size-4 text-neutral-400" />
          {formatTime(booking.bookingTime)}
        </span>
        <span className="inline-flex min-w-0 items-center gap-1.5">
          <MapPin className="size-4 shrink-0 text-neutral-400" />
          <span className="[overflow-wrap:anywhere]">{booking.serviceAddress}</span>
        </span>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", stage.className)}>{stage.label}</span>
          {booking.bill && (
            <span className="text-sm text-neutral-500">
              {booking.quoteState === "APPROVED" ? "Agreed" : "Visit"}{" "}
              <span className="font-semibold text-neutral-900">{formatCurrency(booking.bill.total)}</span>
            </span>
          )}
        </div>
        <Link
          to={`/booking/${booking.bookingId}`}
          className="inline-flex h-9 items-center gap-1.5 rounded-full bg-brand-700 px-4 text-sm font-semibold text-white transition hover:bg-brand-800"
        >
          Manage job
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </article>
  );
}
