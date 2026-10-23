import { useCallback, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { CalendarDays, Check, ChevronLeft, Clock, FileSearch, Loader2, MapPin, Phone, X } from "lucide-react";
import { useAsync } from "../../hooks/useAsync";
import { useAuth } from "../../context/AuthContext";
import {
  acceptCrewRequest,
  cancelCrewRequest,
  completeCrewRequest,
  getCrewRequest,
  rejectCrewRequest,
} from "../../services/crewService";
import { formatCurrency, formatDate, formatTime, getErrorMessage, homePathFor, professionLabel } from "@/lib/format";
import { inputClassName } from "@/lib/styles";
import HeroPanel from "../../components/shared/HeroPanel";
import SectionHeader from "../../components/shared/SectionHeader";
import CrewStatusBadge from "../../components/firm/CrewStatusBadge";
import RateCard from "../../components/review/RateCard";
import { rateCrewRequest } from "../../services/reviewService";
import { EmptyState, ErrorState, Skeleton } from "../../components/shared/States";

export default function CrewRequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isFirm = user?.role === "FIRM";
  const loader = useCallback(() => getCrewRequest(id), [id]);
  const { status: loadStatus, data: crew, error, reload, setData } = useAsync(loader);
  const code = error?.response?.status;
  const status = loadStatus === "error" && (code === 404 || code === 403) ? "notfound" : loadStatus;
  const backPath = isFirm ? homePathFor("FIRM") : "/customer/bookings";

  if (status === "loading") return <Skeleton className="h-72" />;
  if (status === "notfound") {
    return (
      <EmptyState
        icon={FileSearch}
        title="Request not found"
        description="It may not exist, or it belongs to another account."
        action={<Link to={backPath} className="text-sm font-semibold text-brand-700">Go back</Link>}
      />
    );
  }
  if (status === "error") return <ErrorState message="We couldn't load this request." onRetry={reload} />;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <HeroPanel>
        <div className="flex items-center justify-between gap-4">
          <button type="button" onClick={() => navigate(-1)} aria-label="Back" className="flex size-10 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25">
            <ChevronLeft className="size-5" />
          </button>
          <CrewStatusBadge status={crew.status} className="bg-white ring-0" />
        </div>
        <p className="mt-5 text-sm text-white/70">Crew request #{crew.id}</p>
        <h1 className="text-2xl font-bold sm:text-3xl">
          {crew.workers} × {professionLabel(crew.profession)} for {crew.days} {crew.days === 1 ? "day" : "days"}
        </h1>
        <p className="mt-1 text-white/75">{isFirm ? `For ${crew.customerName}` : `From ${crew.firmName}`}</p>
      </HeroPanel>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-6">
          <section>
            <SectionHeader title="Schedule & site" />
            <ul className="space-y-3">
              <Item icon={CalendarDays} label="Start date" value={formatDate(crew.startDate, { weekday: "long", day: "numeric", month: "long", year: "numeric" })} />
              <Item icon={Clock} label="Reporting time" value={formatTime(crew.reportingTime)} />
              <Item icon={MapPin} label="Site address" value={crew.siteCity ? `${crew.siteAddress} · ${crew.siteCity}` : crew.siteAddress} />
              {crew.contactPhone && (
                <Item
                  icon={Phone}
                  label={isFirm ? "Customer's phone" : "Firm's phone"}
                  value={<a href={`tel:${crew.contactPhone}`} className="text-brand-700 hover:underline">{crew.contactPhone}</a>}
                />
              )}
            </ul>
          </section>

          <section>
            <SectionHeader title="The work" />
            <p className="whitespace-pre-line rounded-2xl border border-neutral-200/80 bg-white p-5 text-sm leading-relaxed text-neutral-700 [overflow-wrap:anywhere]">{crew.description}</p>
          </section>
        </div>

        <div className="space-y-4">
          <Amounts crew={crew} />
          {isFirm && <FirmActions crew={crew} onChange={setData} />}
          {!isFirm && (crew.status === "PENDING" || crew.status === "ACCEPTED") && <CancelCrew crew={crew} onChange={setData} />}
          {!isFirm && crew.status === "COMPLETED" && (
            <RateCard
              name={crew.firmName}
              existingRating={crew.customerRating}
              submit={(review) => rateCrewRequest(crew.id, review)}
              onRated={(rating) => setData((c) => ({ ...c, customerRating: rating }))}
            />
          )}
          {!crew.contactPhone && (crew.status === "PENDING") && (
            <p className="text-xs text-neutral-500">Phone numbers are shared once the firm accepts the request.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Amounts({ crew }) {
  const done = crew.finalAmount != null;
  return (
    <div className="rounded-2xl border border-neutral-200/80 bg-white p-5">
      <p className="font-semibold text-neutral-900">{done ? "Final amount" : "Estimate"}</p>
      <dl className="mt-3 space-y-2 text-sm">
        <Row label="Daily rate" value={`${formatCurrency(crew.dailyRate)} / worker`} />
        <Row label="Planned" value={`${crew.plannedWorkerDays} worker-days`} />
        {done && <Row label="Supplied" value={`${crew.actualWorkerDays} worker-days`} />}
      </dl>
      <div className="mt-4 flex items-baseline justify-between border-t border-neutral-100 pt-4">
        <span className="font-semibold text-neutral-900">Total</span>
        <span className="text-2xl font-bold text-neutral-900">{formatCurrency(done ? crew.finalAmount : crew.estimatedTotal)}</span>
      </div>
      {done && Number(crew.finalAmount) < Number(crew.estimatedTotal) && (
        <p className="mt-1 text-xs text-emerald-700">{formatCurrency(Number(crew.estimatedTotal) - Number(crew.finalAmount))} less than the estimate</p>
      )}
      <p className="mt-3 text-xs text-neutral-500">Paid to the firm after the work.</p>
    </div>
  );
}

function FirmActions({ crew, onChange }) {
  const [busy, setBusy] = useState(null);
  const [days, setDays] = useState(String(crew.plannedWorkerDays));
  const [error, setError] = useState("");

  async function run(action, fn, message) {
    setBusy(action);
    try {
      onChange(await fn());
      toast.success(message);
    } catch (err) {
      toast.error("Couldn't update the request", { description: getErrorMessage(err) });
    } finally {
      setBusy(null);
    }
  }

  if (crew.status === "PENDING") {
    return (
      <div className="flex gap-2">
        <button type="button" disabled={busy !== null} onClick={() => run("reject", () => rejectCrewRequest(crew.id), "Request declined")} className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-neutral-300 text-sm font-semibold text-neutral-700 hover:border-red-300 hover:text-red-600 disabled:opacity-60">
          {busy === "reject" ? <Loader2 className="size-4 animate-spin" /> : <X className="size-4" />}
          Decline
        </button>
        <button type="button" disabled={busy !== null} onClick={() => run("accept", () => acceptCrewRequest(crew.id), "Request accepted")} className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-brand-700 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-60">
          {busy === "accept" ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
          Accept
        </button>
      </div>
    );
  }

  if (crew.status === "ACCEPTED") {
    const value = Number(days);
    const valid = Number.isInteger(value) && value >= 1 && value <= crew.plannedWorkerDays;
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5">
        <p className="font-semibold text-neutral-900">Mark as completed</p>
        <label className="mt-3 block text-sm text-neutral-600">
          Worker-days supplied
          <input type="number" min="1" max={crew.plannedWorkerDays} inputMode="numeric" value={days} onChange={(e) => { setDays(e.target.value); setError(""); }} className={`${inputClassName} mt-1.5`} />
        </label>
        <p className="mt-1.5 text-xs text-neutral-500">
          Up to {crew.plannedWorkerDays} (agreed). Final amount: <span className="font-semibold text-neutral-900">{formatCurrency(valid ? value * Number(crew.dailyRate) : 0)}</span>
        </p>
        {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => (valid ? run("complete", () => completeCrewRequest(crew.id, value), "Marked as completed") : setError(`Enter 1 to ${crew.plannedWorkerDays}`))}
          className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {busy === "complete" && <Loader2 className="size-4 animate-spin" />}
          Complete
        </button>
      </div>
    );
  }
  return null;
}

function CancelCrew({ crew, onChange }) {
  const [confirming, setConfirming] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleCancel() {
    setSaving(true);
    try {
      onChange(await cancelCrewRequest(crew.id));
      toast.success("Request cancelled");
    } catch (err) {
      toast.error("Couldn't cancel", { description: getErrorMessage(err) });
      setSaving(false);
      setConfirming(false);
    }
  }

  return confirming ? (
    <div className="rounded-2xl border border-neutral-200/80 bg-white p-5">
      <p className="font-semibold text-neutral-900">Cancel this request?</p>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={() => setConfirming(false)} disabled={saving} className="h-10 flex-1 rounded-full bg-surface text-sm font-medium text-neutral-700">Keep it</button>
        <button type="button" onClick={handleCancel} disabled={saving} className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-red-600 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">
          {saving && <Loader2 className="size-4 animate-spin" />}
          Yes, cancel
        </button>
      </div>
    </div>
  ) : (
    <button type="button" onClick={() => setConfirming(true)} className="h-10 w-full rounded-full border border-red-200 text-sm font-semibold text-red-600 hover:bg-red-50">
      Cancel request
    </button>
  );
}

function Item({ icon: Icon, label, value }) {
  return (
    <li className="flex items-center gap-4 rounded-2xl border border-neutral-200/80 bg-white p-3">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
        <Icon className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-neutral-500">{label}</p>
        <p className="font-medium text-neutral-900 [overflow-wrap:anywhere]">{value}</p>
      </div>
    </li>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-neutral-500">{label}</dt>
      <dd className="font-medium text-neutral-900">{value}</dd>
    </div>
  );
}