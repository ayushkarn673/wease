import { createElement } from "react";
import { cn } from "@/lib/utils";
import { professionIcon, professionTint } from "@/lib/format";

// Illustration used where the design calls for a photo: the service's own colour, soft shapes and its icon.
export default function ServiceArt({ profession, className, iconClassName = "size-10", children }) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br",
        professionTint(profession).art,
        className
      )}
    >
      <span aria-hidden="true" className="absolute -right-4 -top-4 size-16 rounded-full bg-white/50" />
      <span aria-hidden="true" className="absolute -bottom-6 -left-3 size-14 rounded-full bg-white/40" />
      {createElement(professionIcon(profession), { className: cn("relative", iconClassName), strokeWidth: 1.6 })}
      {children}
    </div>
  );
}
