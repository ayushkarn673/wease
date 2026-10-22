import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

// Five stars filled to `value` (supports halves, e.g. 4.3 shows 4 full + a partial fifth).
export default function StarRating({ value = 0, size = "size-4", className }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-label={`${value} out of 5 stars`} role="img">
      {[1, 2, 3, 4, 5].map((n) => {
        const fill = Math.max(0, Math.min(1, value - (n - 1)));
        return (
          <span key={n} className={cn("relative inline-block", size)}>
            <Star className={cn("absolute inset-0 text-neutral-300", size)} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star className={cn("fill-amber-400 text-amber-400", size)} />
            </span>
          </span>
        );
      })}
    </span>
  );
}

// Compact "★ 4.3 (12)" or "New" for cards and headers.
export function RatingBadge({ average, count, className, inverted = false }) {
  if (!count) {
    return (
      <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold", inverted ? "bg-white/15 text-white" : "bg-neutral-100 text-neutral-600", className)}>
        New
      </span>
    );
  }
  return (
    <span className={cn("inline-flex items-center gap-1 text-sm font-semibold", inverted ? "text-white" : "text-neutral-900", className)}>
      <Star className="size-4 fill-amber-400 text-amber-400" />
      {average.toFixed(1)}
      <span className={cn("font-normal", inverted ? "text-white/70" : "text-neutral-500")}>({count})</span>
    </span>
  );
}