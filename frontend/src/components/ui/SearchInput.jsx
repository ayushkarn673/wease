import * as React from "react"
import { Search } from "lucide-react"
import { Input } from "./Input"
import { cn } from "@/lib/utils"

function SearchInput({ className, wrapperClassName, ...props }) {
  return (
    <div className={cn("relative w-full flex items-center", wrapperClassName)}>
      <Search className="absolute left-3 size-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
      <Input
        type="search"
        className={cn(
          "pl-9 pr-4 h-10 w-full rounded-xl border-slate-200/80 bg-white dark:bg-slate-900 dark:border-slate-800 text-sm focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all shadow-sm shadow-slate-100/30 dark:shadow-none",
          className
        )}
        {...props}
      />
    </div>
  )
}

export { SearchInput }
