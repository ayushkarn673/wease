import * as React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

function Loading({ className, size = "md", text = "Loading...", ...props }) {
  const sizeClasses = {
    xs: "size-4",
    sm: "size-6",
    md: "size-8",
    lg: "size-12",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 p-6 min-h-[150px]",
        className
      )}
      {...props}
    >
      <Loader2 className={cn("text-blue-600 dark:text-blue-400 animate-spin", sizeClasses[size])} />
      {text && (
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">
          {text}
        </span>
      )}
    </div>
  )
}

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80", className)}
      {...props}
    />
  )
}

export { Loading, Skeleton }
