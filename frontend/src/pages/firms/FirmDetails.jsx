import { useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Building2, ChevronLeft, ClipboardCheck, FileText, MapPin, Phone, Users } from "lucide-react";
import { useAsync } from "../../hooks/useAsync";
import { getFirm } from "../../services/firmService";
import { coverageLabel, formatCurrency, professionLabel } from "@/lib/format";
import FirmCoverageMap from "../../components/map/FirmCoverageMap";
import ReviewsSection from "../../components/review/ReviewsSection";
import { RatingBadge } from "../../components/review/StarRating";
import { getFirmReviews } from "../../services/reviewService";
import HeroPanel from "../../components/shared/HeroPanel";
import SectionHeader from "../../components/shared/SectionHeader";
import FirmAvatar from "../../components/firm/FirmAvatar";
import RequestCrewButton from "../../components/firm/RequestCrewButton";
import { EmptyState, ErrorState, Skeleton } from "../../components/shared/States";

export default function FirmDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const loader = useCallback(() => getFirm(id), [id]);
  const loadReviews = useCallback(() => getFirmReviews(id), [id]);
  const { status: loadStatus, data: firm, error, reload } = useAsync(loader);
  const status = loadStatus === "error" && error?.response?.status === 404 ? "notfound" : loadStatus;

  if (status === "loading") return <Skeleton className="h-64" />;
  if (status === "notfound") {
    return (
      <EmptyState
        icon={Building2}
        title="Firm not found"
        description="This firm may have been removed."
        action={<Link to="/firms" className="text-sm font-semibold text-brand-700">Browse firms</Link>}
      />
    );
  }
  if (status === "error") return <ErrorState message="We couldn't load this firm." onRetry={reload} />;

  return (
    <div className="space-y-6">
      <HeroPanel>
        <div className="flex items-start justify-between gap-4">
          <button type="button" onClick={() => navigate(-1)} aria-label="Back" className="flex size-10 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25">
            <ChevronLeft className="size-5" />
          </button>
          <span className={firm.available ? "rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-700" : "rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white"}>
            {firm.available ? "Taking requests" : "Not taking requests"}
          </span>
        </div>
        <div className="mt-5 flex items-center gap-4">
          <FirmAvatar name={firm.companyName} size="lg" className="from-white/20 to-white/10 ring-1 ring-white/30" />
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">{firm.companyName}</h1>
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-white/75">
              Labour firm · {coverageLabel(firm)}
              <RatingBadge average={firm.averageRating} count={firm.reviewCount} inverted />
            </p>
          </div>
        </div>
        <div className="mt-7 grid max-w-xl grid-cols-3 gap-2 rounded-2xl bg-white/10 p-3 text-center">
          <Fact label="Team size" value={firm.teamSize} />
          <Fact label="From / worker / day" value={formatCurrency(firm.lowestDailyRate)} />
          <Fact label="Skills" value={firm.rates.length} />
        </div>
      </HeroPanel>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <section>
            <SectionHeader title="Daily rates" subtitle="Per worker, per day" />
            <ul className="divide-y divide-neutral-100 rounded-2xl border border-neutral-200/80 bg-white">
              {firm.rates.map((r) => (
                <li key={r.profession} className="flex items-center justify-between gap-4 px-5 py-3.5">
                  <span className="font-medium text-neutral-900">{professionLabel(r.profession)}</span>
                  <span className="flex items-center gap-4">
                    <span className="font-semibold text-neutral-900">{formatCurrency(r.dailyRate)}</span>
                    <RequestCrewButton firm={firm} profession={r.profession} size="sm">
                      Request
                    </RequestCrewButton>
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <SectionHeader title="Where they supply crews" subtitle={coverageLabel(firm)} />
            <FirmCoverageMap cities={firm.coveredCities} />
          </section>

          {firm.about && (
            <section>
              <SectionHeader title="About" />
              <p className="whitespace-pre-line rounded-2xl border border-neutral-200/80 bg-white p-5 leading-relaxed text-neutral-700 [overflow-wrap:anywhere]">{firm.about}</p>
            </section>
          )}

          <section>
            <SectionHeader title="Details" />
            <ul className="space-y-3">
              <Detail icon={MapPin} label="Office / yard" value={firm.address} />
              <Detail icon={Users} label="Contact person" value={firm.contactPerson} />
              <Detail icon={Phone} label="Phone" value="Shared once the firm accepts your request" />
              {firm.gstin && <Detail icon={FileText} label="GSTIN (provided by the firm)" value={firm.gstin} />}
            </ul>
          </section>

          <section>
            <SectionHeader title="Ratings & reviews" subtitle="From customers who hired a crew through Wease" />
            <ReviewsSection load={loadReviews} name={firm.companyName} />
          </section>
        </div>

        <aside className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xl shadow-neutral-900/[0.04] lg:sticky lg:top-6">
          <p className="text-sm font-semibold text-neutral-900">Request a crew</p>
          <p className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-neutral-900">{formatCurrency(firm.lowestDailyRate)}</span>
            <span className="text-sm text-neutral-500">per worker / day</span>
          </p>
          <ul className="mt-4 space-y-2 text-sm text-neutral-600">
            <li className="flex gap-2"><ClipboardCheck className="mt-0.5 size-4 shrink-0 text-brand-600" />See the full estimate before you send</li>
            <li className="flex gap-2"><ClipboardCheck className="mt-0.5 size-4 shrink-0 text-brand-600" />Never billed more than the agreed worker-days</li>
            <li className="flex gap-2"><ClipboardCheck className="mt-0.5 size-4 shrink-0 text-brand-600" />Pay the firm after the work</li>
          </ul>
          <RequestCrewButton firm={firm} size="lg" className="mt-5 w-full" />
        </aside>
      </div>
    </div>
  );
}

function Fact({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="truncate text-sm font-bold">{value}</p>
      <p className="text-xs text-white/65">{label}</p>
    </div>
  );
}

function Detail({ icon: Icon, label, value }) {
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