import { createElement } from "react";
import { Link } from "react-router-dom";
import { BadgeCheck, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "../../context/AuthContext";
import { formatVisitCharge, professionIcon, professionLabel, professionTint, workerDetailsPath } from "@/lib/format";
import { formatKm } from "@/lib/geo";
import UserAvatar from "../shared/UserAvatar";
import { RatingBadge } from "../review/StarRating";
import BookWorkerButton from "../booking/BookWorkerButton";

// One professional in an open directory list: no card around it, just a row separated from the next by
// a hairline. Uses only the professional's own details.
export default function WorkerCard({ worker }) {
  const { user } = useAuth();
  const years = worker.experience ?? 0;
  const detailsPath = workerDetailsPath(user?.role, worker.id);
  const profession = professionLabel(worker.profession);
  const area = worker.address?.split(",")[0];
  const intro = worker.bio?.trim() || `${profession} with ${years} ${years === 1 ? "year" : "years"} of experience.`;

  return (
    <article className="group flex min-w-0 gap-4 border-b border-neutral-200/80 py-5 sm:gap-5">
      <Link to={detailsPath} tabIndex={-1} aria-hidden="true" className="shrink-0">
        <UserAvatar name={worker.fullName} src={worker.profilePhoto} seed={worker.id} size="lg" className="transition group-hover:scale-[1.03]" />
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Link to={detailsPath} className="flex items-center gap-1.5 text-base font-semibold text-neutral-900 hover:text-brand-700 sm:text-lg">
              <span className="truncate">{worker.fullName}</span>
              {worker.verified && <BadgeCheck className="size-4 shrink-0 text-brand-600" aria-label="Verified" />}
              <RatingBadge average={worker.averageRating} count={worker.reviewCount} className="ml-1 shrink-0" />
            </Link>
            <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-neutral-500">
              <span className="inline-flex items-center gap-1.5 font-medium text-neutral-700">
                <span className={cn("flex size-5 items-center justify-center rounded-full", professionTint(worker.profession).soft)}>
                  {createElement(professionIcon(worker.profession), { className: "size-3" })}
                </span>
                {profession}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                {years} {years === 1 ? "yr" : "yrs"} experience
              </span>
              {worker.distanceKm != null ? (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-medium text-blue-700">{formatKm(worker.distanceKm)} away</span>
                </>
              ) : (
                area && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="truncate">{area}</span>
                  </>
                )
              )}
            </p>
          </div>

          <div className="hidden shrink-0 text-right sm:block">
            <p className="text-lg font-bold leading-tight text-neutral-900">{formatVisitCharge(worker.visitingCharge)}</p>
            <p className="text-xs text-neutral-500">visiting charge</p>
          </div>
        </div>

        <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-relaxed text-neutral-600 [overflow-wrap:anywhere]">{intro}</p>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          {worker.available !== false && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Taking bookings
            </span>
          )}
          <span className="text-sm text-neutral-600 sm:hidden">
            <span className="font-semibold text-neutral-900">{formatVisitCharge(worker.visitingCharge)}</span> visit
          </span>
          <div className="ml-auto flex items-center gap-1">
            <Link
              to={detailsPath}
              className="inline-flex h-9 items-center gap-0.5 rounded-full px-3 text-sm font-semibold text-neutral-700 transition hover:bg-white hover:text-brand-700"
            >
              Profile
              <ChevronRight className="size-4" />
            </Link>
            <BookWorkerButton worker={worker} size="sm" className="px-4">
              Book
            </BookWorkerButton>
          </div>
        </div>
      </div>
    </article>
  );
}
