import * as React from "react"
import { AlertCircle } from "lucide-react"
import { Button } from "./Button"
import { cn } from "@/lib/utils"

function EmptyState({
  title = "No results found",
  description = "Try adjusting your search filters or check back later.",
  icon: Icon = AlertCircle,
  actionText,
  onActionClick,
  className,
  ...props
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xs",
        className
      )}
      {...props}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-800">
        <Icon className="size-6" />
      </div>
      
      <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
        {title}
      </h3>
      
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
        {description}
      </p>
      
      {actionText && onActionClick && (
        <div className="mt-6">
          <Button
            onClick={onActionClick}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
          >
            {actionText}
          </Button>
        </div>
      )}
    </div>
  )
}

export { EmptyState }
