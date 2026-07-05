import * as React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

function LoadingSpinner({ className, size = "md", text, ...props }) {
  const sizeClasses = {
    sm: "size-5",
    md: "size-8",
    lg: "size-12",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 p-4",
        className
      )}
      {...props}
    >
      <Loader2 className={cn("text-blue-600 dark:text-blue-400 animate-spin", sizeClasses[size])} />
      {text && (
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {text}
        </span>
      )}
    </div>
  );
}

export { LoadingSpinner }
