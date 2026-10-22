import { useCallback } from "react";
import { useAsync } from "../../hooks/useAsync";
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

export default function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const loader = useCallback(() => getBookingDetails(id), [id]);
  const { status: loadStatus, data: booking, error, reload, refresh, setData } = useAsync(loader);
  const errorCode = error?.response?.status;
  const status = loadStatus === "error" && (errorCode === 404 || errorCode === 403) ? "notfound" : loadStatus;

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
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
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

          <div className="grid items-start gap-6 lg:grid-cols-[1fr_300px]">
            <div className="min-w-0 space-y-8">
              <BookingPricing booking={booking} role={user?.role} onBookingChanged={refresh} />
              <BookingDetailsCard booking={booking} />
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
