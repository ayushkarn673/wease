import { useId } from "react";
import { cn } from "@/lib/utils";

export default function AuthInput({ label, type = "text", placeholder, Icon, error, className, trailing, ...props }) {
  const id = useId();

  return (
    <div className="w-full">
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-neutral-700">
        {label}
      </label>
      <div className="relative">
        {Icon && <Icon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          className={cn(
            "h-12 w-full rounded-xl border bg-white px-3.5 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:ring-4",
            Icon && "pl-10",
            trailing && "pr-11",
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
              : "border-neutral-200 focus:border-brand-500 focus:ring-brand-500/10",
            className
          )}
          {...props}
        />
        {trailing && <div className="absolute right-1.5 top-1/2 -translate-y-1/2">{trailing}</div>}
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
