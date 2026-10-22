import { useState } from "react";
import { toast } from "sonner";
import { CalendarDays, Check, Clock, Loader2, MapPin, X } from "lucide-react";
import { acceptBooking, rejectBooking } from "../../services/bookingService";
import { formatVisitCharge, formatDate, formatTime, getErrorMessage } from "@/lib/format";
import UserAvatar from "../shared/UserAvatar";

// A new booking request the worker can accept or decline.
export default function RequestCard({ booking, onUpdate }) {
  const [pending, setPending] = useState(null); // "accept" | "reject" | null

  async function act(kind) {
    setPending(kind);
    try {
      if (kind === "accept") {
        await acceptBooking(booking.bookingId);
        toast.success("Booking accepted", { description: `${booking.customerName} will see it confirmed on their bookings page.` });
      } else {
        await rejectBooking(booking.bookingId);
        toast("Request declined");
      }
      onUpdate();
    } catch (err) {
      toast.error("Couldn't update the request", { description: getErrorMessage(err) });
    } finally {
      setPending(null);
    }
  }

  return (
    <article className="rounded-2xl border border-neutral-200/80 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <UserAvatar name={booking.customerName} />
          <div>
            <p className="font-semibold text-neutral-900">{booking.customerName}</p>
            <p className="text-sm text-neutral-500">New request</p>
          </div>
        </div>
        <p className="text-right">
          <span className="block text-xs text-neutral-500">Visiting charge</span>
          <span className="font-semibold text-neutral-900">{formatVisitCharge(booking.bill?.visitingCharge)}</span>
        </p>
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
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="size-4 text-neutral-400" />
          {booking.serviceAddress}
        </span>
      </div>

      {booking.description && (
        <p className="mt-4 rounded-xl bg-surface p-3.5 text-sm leading-relaxed text-neutral-700">{booking.description}</p>
      )}

      <div className="mt-5 flex gap-3">
        <button
          type="button"
          onClick={() => act("reject")}
          disabled={pending !== null}
          className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-neutral-200 text-sm font-medium text-neutral-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:opacity-50 sm:flex-none sm:px-5"
        >
          {pending === "reject" ? <Loader2 className="size-4 animate-spin" /> : <X className="size-4" />}
          Decline
        </button>
        <button
          type="button"
          onClick={() => act("accept")}
          disabled={pending !== null}
          className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-brand-600 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60 sm:flex-none sm:px-6"
        >
          {pending === "accept" ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
          Accept
        </button>
      </div>
    </article>
  );
}
