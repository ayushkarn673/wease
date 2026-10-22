import { useState } from "react";
import { ChevronDown, MessageSquareText } from "lucide-react";
import { useAsync } from "../../hooks/useAsync";
import { formatDate } from "@/lib/format";
import StarRating from "./StarRating";
import { ErrorState, Skeleton } from "../shared/States";

const FIRST_PAGE = 3;
const PAGE = 5;
const LONG_COMMENT = 220;

// Overall rating, the 5→1 star breakdown and the latest reviews for a professional or a firm.
// `load` must be stable (e.g. from useCallback) and resolve to the review summary.
export default function ReviewsSection({ load, name, emptyText }) {
  const { status, data, reload } = useAsync(load);
  const [shown, setShown] = useState(FIRST_PAGE);

  if (status === "loading") return <Skeleton className="h-40" />;
  if (status === "error") return <ErrorState message="We couldn't load reviews." onRetry={reload} />;
  if (!data.count) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-neutral-200/80 bg-white p-5 text-sm text-neutral-600">
        <MessageSquareText className="size-5 shrink-0 text-neutral-400" />
        {emptyText ?? `No ratings yet. Customers can rate ${name} after a completed job.`}
      </div>
    );
  }

  const withComments = data.reviews.filter((r) => r.comment);
  const visible = withComments.slice(0, shown);
  const remaining = withComments.length - visible.length;

  return (
    <div className="space-y-4">
      <div className="grid gap-5 rounded-2xl border border-neutral-200/80 bg-white p-5 sm:grid-cols-[180px_1fr]">
        <div className="text-center sm:border-r sm:border-neutral-100 sm:pr-5">
          <p className="text-4xl font-bold tracking-tight text-neutral-900">{data.average.toFixed(1)}</p>
          <StarRating value={data.average} className="mt-1" />
          <p className="mt-1 text-sm text-neutral-500">
            {data.count} {data.count === 1 ? "rating" : "ratings"}
            {withComments.length > 0 && ` · ${withComments.length} ${withComments.length === 1 ? "review" : "reviews"}`}
          </p>
        </div>
        <ul className="space-y-1.5 self-center">
          {[5, 4, 3, 2, 1].map((stars) => {
            const n = data.breakdown[stars] ?? 0;
            return (
              <li key={stars} className="flex items-center gap-3 text-sm">
                <span className="w-10 shrink-0 text-neutral-600">{stars} ★</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-100">
                  <span className="block h-full rounded-full bg-amber-400" style={{ width: `${(n / data.count) * 100}%` }} />
                </span>
                <span className="w-6 shrink-0 text-right text-neutral-500">{n}</span>
              </li>
            );
          })}
        </ul>
      </div>

      {visible.length > 0 && (
        <ul className="divide-y divide-neutral-100 rounded-2xl border border-neutral-200/80 bg-white">
          {visible.map((r) => (
            <ReviewItem key={r.id} review={r} />
          ))}
        </ul>
      )}

      {remaining > 0 && (
        <button
          type="button"
          onClick={() => setShown((n) => n + PAGE)}
          className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-full border border-neutral-300 bg-white text-sm font-semibold text-neutral-800 hover:border-brand-600 hover:text-brand-700"
        >
          Show more reviews ({remaining})
          <ChevronDown className="size-4" />
        </button>
      )}
    </div>
  );
}

function ReviewItem({ review }) {
  const [expanded, setExpanded] = useState(false);
  const long = review.comment.length > LONG_COMMENT;

  return (
    <li className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-semibold text-neutral-900">{review.reviewerName}</span>
        <span className="text-xs text-neutral-500">{formatDate(review.createdAt.slice(0, 10))}</span>
      </div>
      <StarRating value={review.rating} size="size-3.5" className="mt-1" />
      <p className={`mt-2 whitespace-pre-line text-sm leading-relaxed text-neutral-700 [overflow-wrap:anywhere] ${long && !expanded ? "line-clamp-3" : ""}`}>
        {review.comment}
      </p>
      {long && (
        <button type="button" onClick={() => setExpanded((v) => !v)} className="mt-1 text-sm font-semibold text-brand-700 hover:text-brand-800">
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </li>
  );
}
