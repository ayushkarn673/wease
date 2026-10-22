import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const LABELS = { 1: "Poor", 2: "Fair", 3: "Good", 4: "Very good", 5: "Excellent" };

// Tap a star to choose 1–5. Keyboard: arrow keys move the selection.
export default function StarInput({ value, onChange, disabled }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;

  return (
    <div className="flex items-center gap-3">
      <div
        role="radiogroup"
        aria-label="Your rating"
        className="flex gap-1"
        onMouseLeave={() => setHover(0)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowUp") onChange(Math.min(5, (value || 0) + 1));
          if (e.key === "ArrowLeft" || e.key === "ArrowDown") onChange(Math.max(1, (value || 1) - 1));
        }}
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            disabled={disabled}
            onClick={() => onChange(n)}
            onMouseEnter={() => setHover(n)}
            className="rounded-md p-0.5 transition hover:scale-110 disabled:cursor-not-allowed"
          >
            <Star className={cn("size-8", n <= shown ? "fill-amber-400 text-amber-400" : "text-neutral-300")} />
          </button>
        ))}
      </div>
      <span className="text-sm font-medium text-neutral-600">{shown ? LABELS[shown] : "Tap to rate"}</span>
    </div>
  );
}