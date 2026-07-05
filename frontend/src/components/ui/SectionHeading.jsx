import * as React from "react"
import { cn } from "@/lib/utils"

function SectionHeading({
  title,
  subtitle,
  align = "center",
  className,
  titleClassName,
  subtitleClassName,
  ...props
}) {
  const isCenter = align === "center";
  const isRight = align === "right";

  return (
    <div
      className={cn(
        "flex flex-col gap-2 max-w-3xl w-full",
        isCenter && "text-center mx-auto",
        isRight && "text-right ml-auto",
        className
      )}
      {...props}
    >
      <h2
        className={cn(
          "text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl",
          titleClassName
        )}
      >
        {title}
      </h2>
      
      {subtitle && (
        <p
          className={cn(
            "text-base sm:text-lg text-slate-600 dark:text-slate-400 mt-1 leading-relaxed",
            subtitleClassName
          )}
        >
          {subtitle}
        </p>
      )}
      
      <div
        className={cn(
          "h-1.5 w-12 rounded-full bg-blue-600 dark:bg-blue-400 mt-3",
          isCenter && "mx-auto",
          isRight && "ml-auto"
        )}
      />
    </div>
  )
}

export { SectionHeading }
