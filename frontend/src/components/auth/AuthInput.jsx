import { cn } from "@/lib/utils";

export default function AuthInput({
  label,
  type = "text",
  placeholder,
  Icon,
  error,
  className,
  ...props
}) {
  return (
    <div className="space-y-2 w-full flex flex-col items-start">
      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
        {label}
      </label>

      <div className="relative w-full">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
            <Icon size={18} />
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          className={cn(
            "w-full h-12 rounded-2xl border px-4 py-3 outline-none transition font-semibold text-sm focus:border-blue-600 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 bg-slate-50/50 dark:bg-slate-950/30 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 placeholder:font-semibold",
            Icon && "pl-11",
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-100 dark:focus:ring-red-900/10"
              : "border-slate-200 dark:border-slate-800",
            className
          )}
          {...props}
        />
      </div>

      {error && (
        <span className="text-xs text-red-500 font-semibold mt-1">
          {error}
        </span>
      )}
    </div>
  );
}
