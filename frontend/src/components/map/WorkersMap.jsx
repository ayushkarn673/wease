import { Link } from "react-router-dom";
import { Circle, Marker, Popup } from "react-leaflet";
import { professionLabel } from "@/lib/format";
import { CITY_CENTERS, INDIA_CENTER, SERVICE_RADIUS_KM, formatKm } from "@/lib/geo";
import { CUSTOMER_PIN, WORKER_PIN } from "@/lib/mapIcons";
import WeaseMap from "./WeaseMap";

// Professionals and their 10 km service areas. Positions are approximate (rounded to ~1 km) by design.
export default function WorkersMap({ workers, location, city, className }) {
  const placed = workers.filter((w) => w.hasServiceArea && w.approxLatitude != null);
  const hidden = workers.length - placed.length;
  const first = placed[0];
  const center = location
    ? [location.lat, location.lng]
    : CITY_CENTERS[city] ?? (first ? [first.approxLatitude, first.approxLongitude] : INDIA_CENTER);
  const zoom = location ? 12 : CITY_CENTERS[city] || first ? 11 : 5;

  return (
    <div className="space-y-2">
      <WeaseMap key={center.join(",")} center={center} zoom={zoom} className={className ?? "h-[28rem]"} scrollWheelZoom>
        {placed.map((w) => (
          <Circle
            key={`area-${w.id}`}
            center={[w.approxLatitude, w.approxLongitude]}
            radius={SERVICE_RADIUS_KM * 1000}
            pathOptions={{ color: "#1f5f56", weight: 1, opacity: 0.35, fillOpacity: 0.04 }}
          />
        ))}
        {placed.map((w) => (
          <Marker key={w.id} position={[w.approxLatitude, w.approxLongitude]} icon={WORKER_PIN}>
            <Popup>
              <div className="min-w-40 space-y-0.5 font-sans">
                <p className="text-sm font-semibold text-neutral-900">{w.fullName}</p>
                <p className="text-xs text-neutral-500">
                  {professionLabel(w.profession)}
                  {w.distanceKm != null && ` · ${formatKm(w.distanceKm)} away`}
                  {w.reviewCount > 0 && ` · ★ ${w.averageRating.toFixed(1)}`}
                </p>
                <Link to={`/workers/${w.id}`} className="inline-block pt-1 text-xs font-semibold text-brand-700">
                  View profile →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
        {location && (
          <Marker position={[location.lat, location.lng]} icon={CUSTOMER_PIN}>
            <Popup>You · {location.label}</Popup>
          </Marker>
        )}
      </WeaseMap>
      <p className="text-xs text-neutral-500">
        Pins show each professional&apos;s approximate area (to about 1 km) with their {SERVICE_RADIUS_KM} km service circle.
        {hidden > 0 && ` ${hidden} ${hidden === 1 ? "professional hasn't" : "professionals haven't"} set a service area yet and ${hidden === 1 ? "isn't" : "aren't"} on the map.`}
      </p>
    </div>
  );
}
