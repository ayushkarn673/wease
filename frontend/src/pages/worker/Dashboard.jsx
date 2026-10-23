import { useCallback, useMemo } from "react";
import { useAsync } from "../../hooks/useAsync";
import { usePolling } from "../../hooks/usePolling";
import { Link } from "react-router-dom";
import { BriefcaseBusiness, CalendarCheck2, CheckCircle2, Clock, IndianRupee, Inbox, UserRoundPlus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getWorkerDashboard } from "../../services/dashboardService";
import { getWorkerProfile } from "../../services/workerService";
import { firstName, formatCurrency, formatDate } from "@/lib/format";
import HeroPanel from "../../components/shared/HeroPanel";
import SectionHeader from "../../components/shared/SectionHeader";
import StatCard from "../../components/shared/StatCard";
import { EmptyState, ErrorState, ListSkeleton, Skeleton } from "../../components/shared/States";
import AvailabilityToggle from "../../components/worker/AvailabilityToggle";
import RequestCard from "../../components/worker/RequestCard";
import JobCard from "../../components/worker/JobCard";
import PricingSettings from "../../components/worker/PricingSettings";
import ServiceAreaCard from "../../components/worker/ServiceAreaCard";
import StatusBadge from "../../components/booking/StatusBadge";
import { RatingBadge } from "../../components/review/StarRating";

const byDateAsc = (a, b) => `${a.bookingDate}${a.bookingTime}`.localeCompare(`${b.bookingDate}${b.bookingTime}`);

// The profile comes first: a 404 means the worker hasn't finished onboarding.
async function loadDashboard() {
  const profile = await getWorkerProfile();
  const bookings = await getWorkerDashboard();
  return { profile, bookings };
}

export default function WorkerDashboard() {
  const { user } = useAuth();
  const { status: loadStatus, data, error, reload, refresh, setData } = useAsync(loadDashboard);
  const status = loadStatus === "error" && error?.response?.status === 404 ? "noprofile" : loadStatus;
  // New requests and customers' quote approvals show up without reloading.
  usePolling(refresh, 15000, status === "ready");
  const bookings = useMemo(() => data?.bookings ?? [], [data]);
  const available = Boolean(data?.profile?.available);
  const setProfile = useCallback((profile) => setData((d) => ({ ...d, profile })), [setData]);
  const setAvailable = useCallback(
    (value) => setData((d) => ({ ...d, profile: { ...d.profile, available: value } })),
    [setData]
  );

  const { requests, upcoming, completed, earnings } = useMemo(() => {
    const completedList = bookings.filter((b) => b.status === "COMPLETED");
    return {
      requests: bookings.filter((b) => b.status === "PENDING").sort(byDateAsc),
      upcoming: bookings.filter((b) => b.status === "ACCEPTED" || b.status === "IN_PROGRESS").sort(byDateAsc),
      completed: [...completedList].sort((a, b) => byDateAsc(b, a)),
      // Take-home pay: the bill minus Wease's commission.
      earnings: completedList.reduce((sum, b) => sum + Number(b.bill?.workerEarning ?? b.finalPrice ?? 0), 0),
    };
  }, [bookings]);

  if (status === "noprofile") {
    return (
      <EmptyState
        icon={UserRoundPlus}
        title="Finish setting up your profile"
        description="Customers can't find or book you until you add your service, experience and rates."
        action={
          <Link to="/complete-worker-profile" className="inline-flex h-10 items-center rounded-full bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700">
            Complete profile
          </Link>
        }
        className="py-16"
      />
    );
  }

  return (
    <div className="space-y-8">
      <HeroPanel>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-white/70">Welcome back</p>
            <h1 className="text-2xl font-bold sm:text-3xl">Hi {firstName(user?.fullName)}</h1>
            {status === "ready" && (
              <p className="mt-1 flex items-center gap-2 text-sm text-white/75">
                Your rating
                <RatingBadge average={data.profile.averageRating} count={data.profile.reviewCount} inverted />
              </p>
            )}
          </div>
          {status === "ready" && (
            <div className="rounded-2xl bg-white/10 px-4 py-3">
              <AvailabilityToggle available={available} onChange={setAvailable} />
            </div>
          )}
        </div>
      </HeroPanel>

      {status === "error" && <ErrorState message="We couldn't load your dashboard." onRetry={reload} />}

      {status === "loading" && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <ListSkeleton rows={3} />
        </>
      )}

      {status === "ready" && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <StatCard label="New requests" value={requests.length} icon={Clock} tone="amber" hint="Waiting for your reply" />
            <StatCard label="Upcoming jobs" value={upcoming.length} icon={CalendarCheck2} tone="blue" hint="Accepted and scheduled" />
            <StatCard label="Completed jobs" value={completed.length} icon={CheckCircle2} tone="emerald" hint="All time" />
            <StatCard label="Total earnings" value={formatCurrency(earnings)} icon={IndianRupee} tone="violet" hint="After Wease commission" />
          </div>

          <div className="grid items-start gap-4 lg:grid-cols-2">
            <PricingSettings profile={data.profile} onSaved={setProfile} />
            <ServiceAreaCard profile={data.profile} onSaved={setProfile} />
          </div>

          <div className="grid items-start gap-8 lg:grid-cols-2">
            <section>
              <SectionHeader title="New requests" count={requests.length} />
              {requests.length === 0 ? (
                <EmptyState
                  icon={Inbox}
                  title="No new requests"
                  description={available ? "New booking requests will show up here." : "Turn on availability to start receiving requests."}
                />
              ) : (
                <div className="space-y-3">
                  {requests.map((b) => (
                    <RequestCard key={b.bookingId} booking={b} onUpdate={refresh} />
                  ))}
                </div>
              )}
            </section>

            <section>
              <SectionHeader title="Upcoming jobs" count={upcoming.length} />
              {upcoming.length === 0 ? (
                <EmptyState icon={BriefcaseBusiness} title="No upcoming jobs" description="Jobs you accept will be listed here." />
              ) : (
                <div className="space-y-3">
                  {upcoming.map((b) => (
                    <JobCard key={b.bookingId} booking={b} />
                  ))}
                </div>
              )}
            </section>
          </div>

          {completed.length > 0 && (
            <section>
              <SectionHeader title="Recently completed" />
              <div className="rounded-2xl border border-neutral-200/80 bg-white px-5">
                <ul className="divide-y divide-neutral-100">
                  {completed.slice(0, 5).map((b) => (
                    <li key={b.bookingId}>
                      <Link to={`/booking/${b.bookingId}`} className="flex items-center justify-between gap-4 py-4 transition hover:text-brand-600">
                        <div className="min-w-0">
                          <p className="truncate font-medium text-neutral-900">{b.customerName}</p>
                          <p className="truncate text-sm text-neutral-500">
                            {formatDate(b.bookingDate)} · {b.serviceAddress}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-4">
                          <StatusBadge status={b.status} className="hidden sm:inline-flex" />
                          <span className="font-semibold text-neutral-900">{formatCurrency(b.finalPrice ?? b.estimatedPrice)}</span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

