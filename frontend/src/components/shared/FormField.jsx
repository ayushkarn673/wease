import { cn } from "@/lib/utils";

export function FormField({ label, hint, error, className, children }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-sm font-medium text-neutral-700">{label}</span>
      {children}
      {error ? (
        <span className="mt-1.5 block text-xs font-medium text-red-600">{error}</span>
      ) : (
        hint && <span className="mt-1.5 block text-xs text-neutral-500">{hint}</span>
      )}
    </label>
  );
}

export function FormSection({ title, description, children }) {
  return (
    <section className="grid gap-6 rounded-2xl border border-neutral-200/80 bg-white p-5 sm:p-7 md:grid-cols-[220px_1fr]">
      <div>
        <h2 className="font-semibold text-neutral-900">{title}</h2>
        {description && <p className="mt-1 text-sm text-neutral-500">{description}</p>}
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}
