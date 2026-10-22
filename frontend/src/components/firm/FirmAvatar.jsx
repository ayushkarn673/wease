import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { initials } from "@/lib/format";

const SIZES = { sm: "size-10 text-sm", md: "size-14 text-lg", lg: "size-20 text-2xl" };

// Square badge with the company's initials, so firms are easy to tell apart from individual people.
export default function FirmAvatar({ name, size = "md", className }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 font-bold text-white",
        SIZES[size],
        className
      )}
    >
      {initials(name) || <Building2 className="size-1/2" />}
      <span className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-white text-slate-700 ring-2 ring-white">
        <Building2 className="size-3" />
      </span>
    </span>
  );
}