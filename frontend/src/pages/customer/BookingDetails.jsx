import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useAsync } from "../../hooks/useAsync";
import { usePolling } from "../../hooks/usePolling";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, FileSearch } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getBookingDetails } from "../../services/bookingService";
import BookingTimeline from "../../components/booking/BookingTimeline";
import BookingDetailsCard from "../../components/booking/BookingDetailsCard";
import StatusBadge from "../../components/booking/StatusBadge";
import CancelBookingCard from "../../components/booking/CancelBookingCard";
import BookingPricing from "../../components/booking/BookingPricing";
import RateCard from "../../components/review/RateCard";
import { rateBooking } from "../../services/reviewService";
import HeroPanel from "../../components/shared/HeroPanel";
import SectionHeader from "../../components/shared/SectionHeader";
import { EmptyState, ErrorState, Skeleton } from "../../components/shared/States";
import { firstName, homePathFor, professionLabel } from "@/lib/format";

// Bookings that can still change: the other side's updates are picked up every few seconds.
const POLL_MS = 5000;
const isLive = (b) => !["REJECTED", "CANCELLED"].includes(b.status) && !(b.status === "COMPLETED" && b.paymentStatus === "PAID");

// Tells each side what the *other* person just did. A customer is only told about the professional's
// actions and vice versa, so nobody gets a pop-up for their own click.
function announceChange(prev, next, role) {
  const quoteChanged = prev.quoteState !== next.quoteState;
  const totalChanged = prev.bill?.total !== next.bill?.total;
  if (role === "CUSTOMER") {
    if (prev.status !== next.status && next.status === "ACCEPTED") toast.success(`${next.workerName} accepted your booking`);
    else if (prev.status !== next.status && next.status === "REJECTED") toast.error(`${next.workerName} declined this booking`);
    else if (prev.status !== next.status && next.status === "COMPLETED") toast.success("Job marked as completed", { description: "See the final bill below." });
    else if (quoteChanged && next.quoteState === "AWAITING_APPROVAL") toast.info(`New quote from ${next.workerName}`, { description: "Review it below and approve or decline." });
    else if (prev.paymentStatus !== next.paymentStatus && next.paymentStatus !== "UNPAID") toast.success("Payment recorded");
  } else if (role === "WORKER") {
    if (prev.status !== next.status && next.status === "CANCELLED") toast.error(`${next.customerName} cancelled this booking`);
    else if (next.quoteState === "APPROVED" && (quoteChanged || totalChanged)) toast.success(`${next.customerName} approved your quote`, { description: "You can start the work." });
    else if (quoteChanged && next.quoteState === "DECLINED") toast.error(`${next.customerName} declined your quote`);
  }
}

export default function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const loader = useCallback(() => getBookingDetails(id), [id]);
  const { status: loadStatus, data: booking, error, reload, refresh, setData } = useAsync(loader);
  const errorCode = error?.response?.status;
  const status = loadStatus === "error" && (errorCode === 404 || errorCode === 403) ? "notfound" : loadStatus;

  // Keep the page in step with the other person (new quote, approval, payment) without reloading.
  const shown = useRef(booking);
  useEffect(() => {
    shown.current = booking;
  }, [booking]);
  const poll = useCallback(async () => {
    const next = await getBookingDetails(id);
    const prev = shown.current;
    setData(next);
    if (prev && prev.bookingId === next.bookingId) announceChange(prev, next, user?.role);
  }, [id, setData, user?.role]);
  usePolling(poll, POLL_MS, status === "ready" && isLive(booking));

  const backPath = user?.role === "CUSTOMER" ? "/customer/bookings" : homePathFor(user?.role);
  const goBack = () => (window.history.length > 1 ? navigate(-1) : navigate(backPath));

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {status !== "ready" && (
        <button
          type="button"
          onClick={goBack}
          aria-label="Back"
          className="flex size-10 items-center justify-center rounded-full bg-white text-neutral-700 hover:text-brand-700"
        >
          <ChevronLeft className="size-5" />
        </button>
      )}

      {status === "loading" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <Skeleton className="h-96" />
          <Skeleton className="h-64" />
        </div>
      )}

      {status === "notfound" && (
        <EmptyState
          icon={FileSearch}
          title="Booking not found"
          description="It may not exist, or it belongs to another account."
          action={<Link to={backPath} className="text-sm font-semibold text-brand-600">Go back</Link>}
        />
      )}

      {status === "error" && <ErrorState message="We couldn't load this booking." onRetry={reload} />}

      {status === "ready" && (
        <>
          <HeroPanel>
            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={goBack}
                aria-label="Back"
                className="flex size-10 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
              >
                <ChevronLeft className="size-5" />
              </button>
              <StatusBadge status={booking.status} className="bg-white ring-0" />
            </div>
            <p className="mt-5 text-sm text-white/70">Booking #{booking.bookingId}</p>
            <h1 className="text-2xl font-bold sm:text-3xl">
              {professionLabel(booking.profession)} with {booking.workerName}
            </h1>
          </HeroPanel>

          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="min-w-0 space-y-8">
              <BookingPricing booking={booking} role={user?.role} onBookingChanged={refresh} />
              <BookingDetailsCard booking={booking} role={user?.role} />
            </div>
            <section className="space-y-3">
              <SectionHeader title="Progress" />
              <div className="rounded-2xl border border-neutral-200/80 bg-white p-5">
                <BookingTimeline status={booking.status} />
              </div>
              {user?.role === "CUSTOMER" && booking.status === "COMPLETED" && (
                <RateCard
                  name={firstName(booking.workerName)}
                  existingRating={booking.customerRating}
                  submit={(review) => rateBooking(booking.bookingId, review)}
                  onRated={(rating) => setData((b) => ({ ...b, customerRating: rating }))}
                />
              )}
              {user?.role === "CUSTOMER" && (booking.status === "PENDING" || (booking.status === "ACCEPTED" && ["NONE", undefined, null].includes(booking.quoteState))) && (
                <CancelBookingCard booking={booking} onCancelled={setData} />
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}
