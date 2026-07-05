import * as React from "react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"

function Logo({ className, textClassName, size = "md", href = "/", ...props }) {
  const sizeClasses = {
    sm: "h-7 w-7 rounded-lg",
    md: "h-9 w-9 rounded-xl",
    lg: "h-12 w-12 rounded-2xl",
  };

  const svgSizes = {
    sm: "size-4",
    md: "size-5",
    lg: "size-7",
  };

  const LogoContent = (
    <div className={cn("flex items-center gap-2 group", className)} {...props}>
      <div
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 text-white shadow-md shadow-blue-500/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-blue-500/30",
          sizeClasses[size]
        )}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={svgSizes[size]}
        >
          <path d="M3 6l4 12 4-9 4 9 4-12" />
        </svg>
      </div>
      <span
        className={cn(
          "font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-400 dark:to-indigo-500 bg-clip-text text-transparent transition-colors",
          size === "sm" && "text-base",
          size === "md" && "text-xl",
          size === "lg" && "text-2xl",
          textClassName
        )}
      >
        Wease
      </span>
    </div>
  );

  if (href) {
    return <Link to={href}>{LogoContent}</Link>;
  }

  return LogoContent;
}

export { Logo }
