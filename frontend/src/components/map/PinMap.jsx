import { Marker } from "react-leaflet";
import { Navigation } from "lucide-react";
import { directionsUrl } from "@/lib/geo";
import { CUSTOMER_PIN } from "@/lib/mapIcons";
import WeaseMap from "./WeaseMap";

// One pinned place with a "Get directions" link that opens the visitor's maps app.
export default function PinMap({ lat, lng, className = "h-48" }) {
  return (
    <div className="space-y-2">
      <WeaseMap center={[lat, lng]} zoom={15} className={className}>
        <Marker position={[lat, lng]} icon={CUSTOMER_PIN} />
      </WeaseMap>
      <a
        href={directionsUrl(lat, lng)}
        target="_blank"
        rel="noreferrer"
        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-neutral-300 bg-white px-3.5 text-sm font-semibold text-neutral-800 hover:border-brand-600 hover:text-brand-700"
      >
        <Navigation className="size-4" />
        Get directions
      </a>
    </div>
  );
}