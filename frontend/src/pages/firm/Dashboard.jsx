import { useCallback, useMemo } from "react";
import { Link, Navigate } from "react-router-dom";
import { CheckCircle2, ClipboardList, Clock, IndianRupee, Inbox, Pencil, Users } from "lucide-react";
import { useAsync } from "../../hooks/useAsync";
import { getOwnFirm, updateFirmAvailability } from "../../services/firmService";
import { getFirmCrewRequests } from "../../services/crewService";
import { formatCurrency, professionLabel } from "@/lib/format";
import HeroPanel from "../../components/shared/HeroPanel";
import SectionHeader from "../../components/shared/SectionHeader";
import StatCard from "../../components/shared/StatCard";
import AvailabilityToggle from "../../components/worker/AvailabilityToggle";
import CrewCard from "../../components/firm/CrewCard";
import { RatingBadge } from "../../components/review/StarRating";
import { EmptyState, ErrorState, ListSkeleton } from "../../components/shared/States";

async function loadDashboard() {
  const firm = await getOwnFirm();
  const requests = await getFirmCrewRequests();
  return { firm, requests };
}

export default function FirmDashboard() {
  const { status, data, error, reload, setData } = useAsync(loadDashboard);
  const requests = useMemo(() => data?.requests ?? [], [data]);
  const setAvailable = useCallback((available) => setData((d) => ({ ...d, firm: { ...d.firm, available } })), [setData]);

  const groups = useMemo(() => {
    const completed = requests.filter((r) => r.status === "COMPLETED");
    return {
      pending: requests.filter((r) => r.status === "PENDING"),
      active: requests.filter((r) => r.status === "ACCEPTED"),
      completed,
      billed: completed.reduce((sum, r) => sum + Number(r.finalAmount ?? 0), 0),
    };
  }, [requests]);

  // No company profile yet: finish onboarding first.
  if (status === "error" && error?.response?.status === 404) return <Navigate to="/complete-firm-profile" replace />;

  return (
    <div className="space-y-8">
      <HeroPanel>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-white/70">Labour firm</p>
            <h1 className="text-2xl font-bold sm:text-3xl">{data?.firm?.companyName ?? "Your firm"}</h1>
            {status === "ready" && (
              <p className="mt-1 flex items-center gap-2 text-sm text-white/75">
                Your rating
                <RatingBadge average={data.firm.averageRating} count={data.firm.reviewCount} inverted />
              </p>
            )}
          </div>
          {status === "ready" && (
            <div className="rounded-2xl bg-white/10 px-4 py-3">
              <AvailabilityToggle available={Boolean(data.firm.available)} onChange={setAvailable} save={updateFirmAvailability} noun="requests" />
            </div>
          )}
        </div>
      </HeroPanel>

      {status === "error" && <ErrorState message="We couldn't load your dashboard." onRetry={reload} />}
      {status === "loading" && <ListSkeleton rows={3} />}

      {status === "ready" && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <StatCard label="New requests" value={groups.pending.length} icon={Clock} tone="amber" hint="Waiting for your reply" />
            <StatCard label="Confirmed crews" value={groups.active.length} icon={Users} tone="blue" hint="Accepted and upcoming" />
            <StatCard label="Completed" value={groups.completed.length} icon={CheckCircle2} tone="emerald" hint="All time" />
            <StatCard label="Total billed" value={formatCurrency(groups.billed)} icon={IndianRupee} tone="violet" hint="From completed requests" />
          </div>

          <section className="rounded-2xl border border-neutral-200/80 bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-neutral-900">Your daily rates</p>
                <p className="text-sm text-neutral-500">Team of {data.firm.teamSize} · {data.firm.city}</p>
              </div>
              <Link to="/firm/profile" className="inline-flex h-9 items-center gap-1.5 rounded-full border border-neutral-300 px-3.5 text-sm font-semibold text-neutral-800 hover:border-brand-600 hover:text-brand-700">
                <Pencil className="size-3.5" />
                Edit
              </Link>
            </div>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-neutral-600">
              {data.firm.rates.map((r) => (
                <li key={r.profession}>
                  {professionLabel(r.profession)} <span className="font-semibold text-neutral-900">{formatCurrency(r.dailyRate)}</span>/day
                </li>
              ))}
            </ul>
          </section>

          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
            <section>
              <SectionHeader title="New requests" count={groups.pending.length} />
              {groups.pending.length === 0 ? (
                <EmptyState icon={Inbox} title="No new requests" description={data.firm.available ? "Crew requests from customers show up here." : "Turn on availability to receive requests."} />
              ) : (
                <div className="space-y-3">{groups.pending.map((r) => <CrewCard key={r.id} crew={r} viewer="firm" />)}</div>
              )}
            </section>
            <section>
              <SectionHeader title="Confirmed crews" count={groups.active.length} />
              {groups.active.length === 0 ? (
                <EmptyState icon={ClipboardList} title="No confirmed crews" description="Requests you accept are listed here until you mark them complete." />
              ) : (
                <div className="space-y-3">{groups.active.map((r) => <CrewCard key={r.id} crew={r} viewer="firm" />)}</div>
              )}
            </section>
          </div>

          {groups.completed.length > 0 && (
            <section>
              <SectionHeader title="Recently completed" />
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">{groups.completed.slice(0, 6).map((r) => <CrewCard key={r.id} crew={r} viewer="firm" />)}</div>
            </section>
          )}
        </>
      )}
    </div>
  );
}