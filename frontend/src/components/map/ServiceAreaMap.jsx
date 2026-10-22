import { Circle, Marker, Popup } from "react-leaflet";
import { SERVICE_RADIUS_KM, distanceKm, formatKm } from "@/lib/geo";
import { CUSTOMER_PIN, WORKER_PIN } from "@/lib/mapIcons";
import WeaseMap from "./WeaseMap";

// A professional's 10 km service area, and (if set) where the visitor is relative to it.
export default function ServiceAreaMap({ lat, lng, customer, className = "h-64" }) {
  const km = customer ? distanceKm(customer.lat, customer.lng, lat, lng) : null;
  return (
    <div className="space-y-2">
      <WeaseMap center={[lat, lng]} zoom={11} className={className}>
        <Circle center={[lat, lng]} radius={SERVICE_RADIUS_KM * 1000} pathOptions={{ color: "#1f5f56", weight: 2, fillOpacity: 0.08 }} />
        <Marker position={[lat, lng]} icon={WORKER_PIN} />
        {customer && (
          <Marker position={[customer.lat, customer.lng]} icon={CUSTOMER_PIN}>
            <Popup>You · {customer.label}</Popup>
          </Marker>
        )}
      </WeaseMap>
      {km != null && (
        <p className={km <= SERVICE_RADIUS_KM ? "text-sm font-medium text-emerald-700" : "text-sm font-medium text-amber-700"}>
          {km <= SERVICE_RADIUS_KM
            ? `Your location (${customer.label}) is about ${formatKm(km)} away — inside their service area.`
            : `Your location (${customer.label}) is about ${formatKm(km)} away — outside their ${SERVICE_RADIUS_KM} km service area.`}
        </p>
      )}
    </div>
  );
}