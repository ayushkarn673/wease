import { Circle, Tooltip } from "react-leaflet";
import { CITY_CENTERS, INDIA_CENTER } from "@/lib/geo";
import WeaseMap from "./WeaseMap";

// The cities a labour firm covers, drawn as broad circles around each city centre (indicative only).
export default function FirmCoverageMap({ cities, className = "h-64" }) {
  const known = cities.filter((c) => CITY_CENTERS[c]);
  const bounds = known.length > 1 ? known.map((c) => CITY_CENTERS[c]) : null;
  const center = known.length === 1 ? CITY_CENTERS[known[0]] : INDIA_CENTER;

  return (
    <WeaseMap
      key={known.join(",")}
      center={center}
      zoom={known.length === 1 ? 10 : 5}
      {...(bounds && { bounds, boundsOptions: { padding: [40, 40] } })}
      className={className}
    >
      {known.map((city) => (
        <Circle key={city} center={CITY_CENTERS[city]} radius={18000} pathOptions={{ color: "#334155", weight: 2, fillOpacity: 0.12 }}>
          <Tooltip direction="center" permanent className="!border-0 !bg-white/90 !px-2 !py-0.5 !text-xs !font-semibold !text-slate-800 !shadow">
            {city}
          </Tooltip>
        </Circle>
      ))}
    </WeaseMap>
  );
}