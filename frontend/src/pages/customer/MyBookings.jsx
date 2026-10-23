import { useMemo, useState } from "react";
import { useAsync } from "../../hooks/useAsync";
import { usePolling } from "../../hooks/usePolling";
import { Link } from "react-router-dom";
import { CalendarClock, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { ACTIVE_STATUSES, CLOSED_STATUSES } from "@/lib/format";
import { getCustomerBookings } from "../../services/bookingService";
import { getCustomerCrewRequests } from "../../services/crewService";
import BookingCard from "../../components/booking/BookingCard";
import CrewCard from "../../components/firm/CrewCard";
import HeroPanel from "../../components/shared/HeroPanel";
import { EmptyState, ErrorState, ListSkeleton } from "../../components/shared/States";

const byDateAsc = (a, b) => `${a.bookingDate}${a.bookingTime}`.localeCompare(`${b.bookingDate}${b.bookingTime}`);
const byDateDesc = (a, b) => byDateAsc(b, a);

const TABS = [
  { key: "upcoming", label: "Upcoming", filter: (b) => ACTIVE_STATUSES.includes(b.status), sort: byDateAsc },
  { key: "completed", label: "Completed", filter: (b) => b.status === "COMPLETED", sort: byDateDesc },
  { key: "closed", label: "Closed", filter: (b) => CLOSED_STATUSES.includes(b.status), sort: byDateDesc },
  { key: "all", label: "All", filter: () => true, sort: byDateDesc },
  // Crew requests to labour firms are a separate list.
  { key: "crews", label: "Crews" },
];

const EMPTY_COPY = {
  upcoming: "You don't have any upcoming bookings.",
  completed: "Completed jobs will appear here.",
  closed: "No declined or cancelled bookings.",
  all: "You haven't made any bookings yet.",
};

export default function MyBookings() {
  const [tab, setTab] = useState("upcoming");
  const { status, data, reload, refresh } = useAsync(getCustomerBookings);
  // Statuses (accepted, quote waiting, completed) update without reloading.
  usePolling(refresh, 15000, status === "ready");
  const { status: crewStatus, data: crewData, reload: reloadCrews } = useAsync(getCustomerCrewRequests);
  const bookings = useMemo(() => data ?? [], [data]);
  const crews = useMemo(() => crewData ?? [], [crewData]);

  const counts = useMemo(
    () => ({
      ...Object.fromEntries(TABS.filter((t) => t.filter).map((t) => [t.key, bookings.filter(t.filter).length])),
      crews: crews.length,
    }),
    [bookings, crews]
  );

  const active = TABS.find((t) => t.key === tab);
  const visible = useMemo(() => (active.filter ? bookings.filter(active.filter).sort(active.sort) : []), [bookings, active]);
  const isCrews = tab === "crews";
  const listStatus = isCrews ? crewStatus : status;

  return (
    <div className="space-y-6">
      <HeroPanel>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">My bookings</h1>
            <p className="mt-1 text-sm text-white/70">Track requests, confirmations and completed jobs.</p>
          </div>
          <Link
            to={isCrews ? "/firms" : "/workers"}
            className="inline-flex h-10 shrink-0 items-center rounded-full bg-white px-4 text-sm font-semibold text-brand-700 hover:bg-brand-50"
          >
            {isCrews ? "Hire a crew" : "Book a service"}
          </Link>
        </div>
      </HeroPanel>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "inline-flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-medium transition",
              tab === t.key ? "bg-brand-600 text-white" : "bg-white text-neutral-700 hover:text-brand-700"
            )}
          >
            {t.label}
            {(t.key === "crews" ? crewStatus : status) === "ready" && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-xs leading-none",
                  tab === t.key ? "bg-white/20 text-white" : "bg-brand-50 text-brand-700"
                )}
              >
                {counts[t.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {listStatus === "loading" && <ListSkeleton rows={4} />}
      {listStatus === "error" && (
        <ErrorState message={isCrews ? "We couldn't load your crew requests." : "We couldn't load your bookings."} onRetry={isCrews ? reloadCrews : reload} />
      )}

      {isCrews && crewStatus === "ready" && crews.length === 0 && (
        <EmptyState
          icon={Users}
          title="No crew requests yet"
          description="Need several workers for shifting or site work? Request a crew from a labour firm."
          action={<Link to="/firms" className="text-sm font-semibold text-brand-600 hover:text-brand-700">Browse labour firms</Link>}
        />
      )}
      {isCrews && crewStatus === "ready" && crews.length > 0 && (
        <div className="grid gap-3 lg:grid-cols-2">
          {crews.map((c) => (
            <CrewCard key={c.id} crew={c} />
          ))}
        </div>
      )}

      {!isCrews && status === "ready" && visible.length === 0 && (
        <EmptyState
          icon={CalendarClock}
          title="Nothing here yet"
          description={EMPTY_COPY[tab]}
          action={
            tab !== "closed" && (
              <Link to="/workers" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
                Find a professional
              </Link>
            )
          }
        />
      )}
      {!isCrews && status === "ready" && visible.length > 0 && (
        <div className="grid gap-3 lg:grid-cols-2">
          {visible.map((b) => (
            <BookingCard key={b.bookingId} booking={b} />
          ))}
        </div>
      )}
    </div>
  );
}
