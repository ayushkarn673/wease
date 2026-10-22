import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// Section title with an optional "View all" link.
export default function SectionHeader({ title, subtitle, to, linkLabel = "View all", count }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight text-neutral-900 sm:text-xl">
          {title}
          {count > 0 && (
            <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700">{count}</span>
          )}
        </h2>
        {subtitle && <p className="mt-0.5 text-sm text-neutral-500">{subtitle}</p>}
      </div>
      {to && (
        <Link to={to} className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-600">
          {linkLabel}
          <ArrowRight className="size-4" />
        </Link>
      )}
    </div>
  );
}
