import * as React from "react"
import { cn } from "@/lib/utils"

function Container({ className, as: Component = "div", clean = false, ...props }) {
  return (
    <Component
      className={cn(
        !clean && "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full",
        className
      )}
      {...props}
    />
  )
}

export { Container }
