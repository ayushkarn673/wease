import * as React from "react"
import { Button } from "./Button"
import { cn } from "@/lib/utils"

function CustomButton({ className, children, variant = "default", size = "default", ...props }) {
  return (
    <Button
      className={cn(
        variant === "default" && "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/10 rounded-xl transition duration-300 font-semibold",
        variant === "outline" && "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl transition duration-300 font-semibold",
        className
      )}
      variant={variant === "default" || variant === "outline" ? "default" : variant}
      size={size}
      {...props}
    >
      {children}
    </Button>
  );
}

export { CustomButton }
