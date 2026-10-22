import { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { cn } from "@/lib/utils";

// Leaflet measures its container once; maps opened inside dialogs or tabs need a nudge after layout.
function FixSize() {
  const map = useMap();
  useEffect(() => {
    const id = setTimeout(() => map.invalidateSize(), 150);
    return () => clearTimeout(id);
  }, [map]);
  return null;
}

// Base map: OpenStreetMap tiles with the required attribution. `isolate` keeps Leaflet's own
// z-index stacking from covering the app header and dialogs.
export default function WeaseMap({ center, zoom = 12, className, children, scrollWheelZoom = false, ...rest }) {
  return (
    <div className={cn("isolate z-0 overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-100", className)}>
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={scrollWheelZoom} className="size-full" {...rest}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        <FixSize />
        {children}
      </MapContainer>
    </div>
  );
}