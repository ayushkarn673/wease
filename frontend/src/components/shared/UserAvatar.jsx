import { cn } from "@/lib/utils";
import { initials } from "@/lib/format";

// Rich, distinct colours so a list of professionals without photos still reads as different people.
const PALETTE = [
  "from-teal-500 to-emerald-600",
  "from-sky-500 to-indigo-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-violet-500 to-purple-600",
  "from-cyan-500 to-teal-600",
  "from-lime-600 to-green-700",
  "from-fuchsia-500 to-rose-600",
];

const SIZES = {
  sm: "size-8 text-xs",
  md: "size-11 text-sm",
  lg: "size-16 text-xl",
  xl: "size-24 text-3xl",
};

function colorFor(seed = "") {
  let hash = 0;
  for (const ch of String(seed)) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return PALETTE[hash % PALETTE.length];
}

// `seed` picks the colour (defaults to the name); pass a stable id so two people with the same
// name still look different.
export default function UserAvatar({ name, src, seed, size = "md", className }) {
  if (src) {
    return <img src={src} alt={name} className={cn(SIZES[size], "shrink-0 rounded-full object-cover", className)} />;
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-semibold text-white",
        SIZES[size],
        colorFor(seed ?? name),
        className
      )}
    >
      {initials(name) || "?"}
    </span>
  );
}
