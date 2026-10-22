import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import ServiceImage from "./ServiceImage";

// Photo card for a service category, with the name set over the photo.
export default function ServiceCard({ to, label, profession, description }) {
  return (
    <Link to={to} className="group block">
      <ServiceImage
        profession={profession}
        width={500}
        className="aspect-[4/3] rounded-2xl ring-1 ring-neutral-900/5"
        iconClassName="size-12"
      >
        <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/0 transition group-hover:from-black/80" />
        <span className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-white/90 text-neutral-800 opacity-0 transition group-hover:opacity-100">
          <ArrowUpRight className="size-4" />
        </span>
        <span className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4">
          <span className="block font-semibold text-white">{label}</span>
          {description && <span className="mt-0.5 hidden text-xs text-white/80 sm:line-clamp-1">{description}</span>}
        </span>
      </ServiceImage>
    </Link>
  );
}
