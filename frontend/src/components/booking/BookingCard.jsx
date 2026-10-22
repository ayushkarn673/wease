import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { formatCurrency, formatDate, formatTime, formatVisitCharge, professionLabel } from "@/lib/format";
import ServiceArt from "../shared/ServiceArt";
import StatusBadge from "./StatusBadge";

// Booking summary row from the customer's point of view. Opens the details page.
export default function BookingCard({ booking }) {
  return (
    <Link
      to={`/booking/${booking.bookingId}`}
      className="group flex min-w-0 items-center gap-4 rounded-2xl border border-neutral-200/80 bg-white p-3 pr-4 transition hover:ring-2 hover:ring-brand-200"
    >
      <ServiceArt profession={booking.profession} className="size-16 shrink-0 rounded-xl" iconClassName="size-7" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <p className="truncate font-semibold text-neutral-900 group-hover:text-brand-700">
            {professionLabel(booking.profession)} · {booking.workerName}
          </p>
          <StatusBadge status={booking.status} />
        </div>
        <p className="mt-0.5 truncate text-sm text-neutral-500">
          {formatDate(booking.bookingDate, { weekday: "short", day: "numeric", month: "short" })} ·{" "}
          {formatTime(booking.bookingTime)} · {booking.serviceAddress}
        </p>
        <PriceLine booking={booking} />
      </div>
      <ChevronRight className="size-5 shrink-0 text-neutral-400 transition group-hover:translate-x-0.5 group-hover:text-brand-600" />
    </Link>
  );
}

// What the customer should know about the price at this stage of the booking.
function PriceLine({ booking }) {
  const bill = booking.bill;
  if (booking.quoteState === "AWAITING_APPROVAL") {
    return (
      <span className="mt-2 inline-flex rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-800">
        Quote waiting for your approval
      </span>
    );
  }
  const label =
    booking.status === "COMPLETED" ? "Total" : booking.quoteState === "APPROVED" ? "Agreed" : "Visiting charge";
  const amount = booking.quoteState == null ? booking.finalPrice ?? booking.estimatedPrice : bill?.total;
  return (
    <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-sm text-brand-800">
      {label}
      <span className="font-semibold">{label === "Visiting charge" ? formatVisitCharge(amount) : formatCurrency(amount)}</span>
    </span>
  );
}