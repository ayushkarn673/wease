import { AlertTriangle, Inbox, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

export function Skeleton({ className }) {
  return <div className={cn("animate-pulse rounded-2xl bg-white", className)} />;
}

function Bar({ className }) {
  return <div className={cn("animate-pulse rounded-full bg-neutral-100", className)} />;
}

// Placeholder in the shape of the professional list rows.
export function CardGridSkeleton({ count = 4, className = "lg:grid-cols-2 lg:gap-x-12" }) {
  return (
    <div className={cn("grid border-t border-neutral-200/80", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-4 border-b border-neutral-200/80 py-5">
          <div className="size-16 shrink-0 animate-pulse rounded-full bg-neutral-200/70" />
          <div className="flex-1 space-y-2.5 pt-1">
            <Bar className="h-4 w-1/3 bg-neutral-200/70" />
            <Bar className="h-3 w-1/2 bg-neutral-200/70" />
            <Bar className="h-3 w-5/6 bg-neutral-200/70" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ListSkeleton({ rows = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-2xl border border-neutral-200/80 bg-white p-3">
          <div className="size-16 animate-pulse rounded-xl bg-neutral-100" />
          <div className="flex-1 space-y-2">
            <Bar className="h-3.5 w-1/3" />
            <Bar className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ icon: Icon = Inbox, title, description, action, className }) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-2xl border border-neutral-200/80 bg-white px-6 py-10 text-center", className)}>
      <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
        <Icon className="size-6" />
      </span>
      <h3 className="mt-4 text-base font-semibold text-neutral-900">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-neutral-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({ title = "Couldn't load this", message, onRetry, className }) {
  return (
    <div role="alert" className={cn("flex flex-col items-center justify-center rounded-2xl border border-neutral-200/80 bg-white px-6 py-10 text-center", className)}>
      <span className="flex size-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
        <AlertTriangle className="size-6" />
      </span>
      <h3 className="mt-4 text-base font-semibold text-neutral-900">{title}</h3>
      {message && <p className="mt-1.5 max-w-sm text-sm text-neutral-600">{message}</p>}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-100"
        >
          <RotateCw className="size-4" />
          Try again
        </button>
      )}
    </div>
  );
}
