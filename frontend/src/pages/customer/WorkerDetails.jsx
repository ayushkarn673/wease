import { useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BadgeCheck, Banknote, Briefcase, CalendarCheck2, ChevronLeft, ClipboardList, MapPin, ShieldCheck, Tag, UserX } from "lucide-react";
import { useAsync } from "../../hooks/useAsync";
import { getWorkerDetails } from "../../services/workerService";
import { firstName, formatVisitCharge, professionLabel, visitPolicy } from "@/lib/format";
import { serviceImage } from "@/lib/media";
import UserAvatar from "../../components/shared/UserAvatar";
import HeroPanel from "../../components/shared/HeroPanel";
import SectionHeader from "../../components/shared/SectionHeader";
import BookWorkerButton from "../../components/booking/BookWorkerButton";
import ServiceAreaMap from "../../components/map/ServiceAreaMap";
import ReviewsSection from "../../components/review/ReviewsSection";
import { getWorkerReviews } from "../../services/reviewService";
import { RatingBadge } from "../../components/review/StarRating";
import { useCity } from "../../context/city";
import { SERVICE_RADIUS_KM } from "@/lib/geo";
import { EmptyState, ErrorState, Skeleton } from "../../components/shared/States";

export default function WorkerDetails() {
  const { id } = useParams();
  const { location } = useCity();
  const navigate = useNavigate();
  const loader = useCallback(() => getWorkerDetails(id), [id]);
  const loadReviews = useCallback(() => getWorkerReviews(id), [id]);
  const { status: loadStatus, data: worker, error, reload } = useAsync(loader);
  const status = loadStatus === "error" && error?.response?.status === 404 ? "notfound" : loadStatus;

  const backButton = (light) => (
    <button
      type="button"
      onClick={() => navigate(-1)}
      aria-label="Back"
      className={
        light
          ? "flex size-10 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
          : "flex size-10 items-center justify-center rounded-full bg-white text-neutral-700 transition hover:text-brand-700"
      }
    >
      <ChevronLeft className="size-5" />
    </button>
  );

  if (status === "loading") {
    return (
      <div className="space-y-4">
        <Skeleton className="h-56 bg-brand-100" />
        <Skeleton className="h-40" />
      </div>
    );
  }

  if (status === "notfound") {
    return (
      <div className="space-y-4">
        {backButton(false)}
        <EmptyState
          icon={UserX}
          title="Professional not found"
          description="This profile may have been removed."
          action={<Link to="/workers" className="text-sm font-semibold text-brand-600">Browse professionals</Link>}
        />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="space-y-4">
        {backButton(false)}
        <ErrorState message="We couldn't load this profile." onRetry={reload} />
      </div>
    );
  }

  const years = worker.experience ?? 0;
  const first = firstName(worker.fullName);
  const policy = visitPolicy(worker.visitingChargePolicy);

  return (
    <div className="space-y-6">
      <HeroPanel image={serviceImage(worker.profession, 1200)}>
        <div className="flex items-start justify-between gap-4">
          {backButton(true)}
          {worker.available ? (
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-700">Accepting bookings</span>
          ) : (
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">Not available right now</span>
          )}
        </div>
        <div className="mt-5 flex items-center gap-4">
          <UserAvatar name={worker.fullName} src={worker.profilePhoto} seed={worker.id} size="xl" className="ring-4 ring-white/25" />
          <div className="min-w-0">
            <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight sm:text-4xl">
              <span className="truncate">{worker.fullName}</span>
              {worker.verified && <BadgeCheck className="size-6 shrink-0" aria-label="Verified" />}
            </h1>
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-white/75">
              {professionLabel(worker.profession)}
              <RatingBadge average={worker.averageRating} count={worker.reviewCount} inverted />
            </p>
          </div>
        </div>
        <div className="mt-7 grid max-w-xl grid-cols-3 gap-2 rounded-2xl bg-white/10 p-3 text-center backdrop-blur-sm">
          <HeroFact label="Experience" value={`${years} ${years === 1 ? "yr" : "yrs"}`} />
          <HeroFact label="Visiting charge" value={formatVisitCharge(worker.visitingCharge)} />
          <HeroFact label="Area" value={worker.address || "—"} />
        </div>
      </HeroPanel>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <section>
            <SectionHeader title="About" />
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-6">
              <p className="whitespace-pre-line leading-relaxed text-neutral-700">
                {worker.bio || `${worker.fullName} hasn't added a description yet.`}
              </p>
            </div>
          </section>

          <section>
            <SectionHeader title="Details" />
            <ul className="space-y-3">
              <DetailRow icon={Briefcase} label="Experience" value={`${years} ${years === 1 ? "year" : "years"} in ${professionLabel(worker.profession).toLowerCase()} work`} />
              <DetailRow icon={MapPin} label="Service area" value={worker.address || "Not specified"} />
            </ul>
          </section>

          <section>
            <SectionHeader title="Service area" subtitle={`Within ${SERVICE_RADIUS_KM} km of their base (shown approximately)`} />
            {worker.hasServiceArea ? (
              <ServiceAreaMap lat={worker.approxLatitude} lng={worker.approxLongitude} customer={location} />
            ) : (
              <p className="rounded-2xl border border-neutral-200/80 bg-white p-5 text-sm text-neutral-600">
                {first} hasn&apos;t set a service area on the map yet. They work around {worker.address || "their listed area"}.
              </p>
            )}
          </section>

          <section>
            <SectionHeader title="How pricing works" />
            <ol className="divide-y divide-neutral-100 rounded-2xl border border-neutral-200/80 bg-white">
              <PricingStep
                icon={Tag}
                title={`Visiting charge: ${formatVisitCharge(worker.visitingCharge)}`}
                text={`Covers travel and inspecting the job. ${policy.description}`}
              />
              <PricingStep
                icon={ClipboardList}
                title="Itemised quote after inspection"
                text={`${first} sees the job and sends you a quote with labour and materials listed separately, priced for your job.`}
              />
              <PricingStep
                icon={ShieldCheck}
                title="You approve before any repair"
                text="No repair work is charged until you accept the quote. If more work is needed, you get a revised quote to approve first."
              />
              <PricingStep icon={Banknote} title="Pay in cash after the job" text="You pay the professional when the work is done and get a payment record in your booking." />
            </ol>
          </section>

          <section>
            <SectionHeader title="Ratings & reviews" subtitle="From customers who booked through Wease" />
            <ReviewsSection load={loadReviews} name={first} />
          </section>
        </div>

        <aside className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xl shadow-neutral-900/[0.04] lg:sticky lg:top-24">
          <p className="text-sm font-semibold text-neutral-900">Book this professional</p>
          <p className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-neutral-900">{formatVisitCharge(worker.visitingCharge)}</span>
            <span className="text-sm text-neutral-500">visiting charge</span>
          </p>
          <p className="mt-1 text-sm text-neutral-500">{policy.short}</p>
          <dl className="mt-4 space-y-2 rounded-xl bg-neutral-50 p-3.5 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-neutral-500">Repair</dt>
              <dd className="font-medium text-neutral-900">Quoted after inspection</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-neutral-500">Payment</dt>
              <dd className="font-medium text-neutral-900">Cash after the job</dd>
            </div>
          </dl>
          <BookWorkerButton worker={worker} size="lg" className="mt-5 w-full">
            Request a booking
          </BookWorkerButton>
          <p className="mt-4 flex items-start gap-2 text-xs text-neutral-500">
            <CalendarCheck2 className="mt-0.5 size-4 shrink-0 text-brand-600" />
            Choose a date and time, then follow the status on your bookings page.
          </p>
        </aside>
      </div>
    </div>
  );
}

function HeroFact({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="truncate text-sm font-bold">{value}</p>
      <p className="text-xs text-white/65">{label}</p>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <li className="flex items-center gap-4 rounded-2xl border border-neutral-200/80 bg-white p-3">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
        <Icon className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-neutral-500">{label}</p>
        <p className="truncate font-medium text-neutral-900">{value}</p>
      </div>
    </li>
  );
}

function PricingStep({ icon: Icon, title, text }) {
  return (
    <li className="flex gap-4 p-4">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
        <Icon className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="font-semibold text-neutral-900">{title}</p>
        <p className="mt-0.5 text-sm leading-relaxed text-neutral-600">{text}</p>
      </div>
    </li>
  );
}