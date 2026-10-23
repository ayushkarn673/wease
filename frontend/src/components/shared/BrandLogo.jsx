import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import weaseMark from "@/assets/logo/wease-mark.svg";

export default function BrandLogo({ to = "/", inverted = false, className, nameClassName }) {
  return (
    <Link to={to} aria-label="Wease home" className={cn("group inline-flex shrink-0 items-center gap-2.5", className)}>
      <img
        src={weaseMark}
        alt=""
        className={cn(
          "size-9 rounded-lg transition-transform group-hover:scale-105",
          inverted && "ring-1 ring-white/40"
        )}
      />
      <span className={cn("text-xl font-bold tracking-tight", inverted ? "text-white" : "text-neutral-900", nameClassName)}>
        Wease
      </span>
    </Link>
  );
}
