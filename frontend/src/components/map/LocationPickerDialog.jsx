import { useEffect, useRef, useState } from "react";
import { Marker, useMap, useMapEvents } from "react-leaflet";
import { Crosshair, Loader2, MapPin, Search } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { describePlace, searchPlaces } from "../../services/geocode";
import { CITY_CENTERS, INDIA_CENTER, isInIndia } from "@/lib/geo";
import { CUSTOMER_PIN } from "@/lib/mapIcons";
import { inputClassName } from "@/lib/styles";
import WeaseMap from "./WeaseMap";

// Pick a point: search an address, use the device's location, or tap/drag the pin on the map.
// Calls onConfirm({ lat, lng, label }).
export default function LocationPickerDialog({ open, onOpenChange, initial, fallbackCity, title = "Choose location", description, confirmLabel = "Use this location", onConfirm }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[94vh] overflow-y-auto p-0 sm:max-w-2xl">
        {open && (
          <Picker
            initial={initial}
            fallbackCity={fallbackCity}
            title={title}
            description={description}
            confirmLabel={confirmLabel}
            onCancel={() => onOpenChange(false)}
            onConfirm={(value) => {
              onConfirm(value);
              onOpenChange(false);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function Picker({ initial, fallbackCity, title, description, confirmLabel, onCancel, onConfirm }) {
  const start = initial?.lat != null ? [initial.lat, initial.lng] : CITY_CENTERS[fallbackCity] ?? null;
  const [point, setPoint] = useState(initial?.lat != null ? { lat: initial.lat, lng: initial.lng } : null);
  const [label, setLabel] = useState(initial?.label ?? "");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState("");
  const [flyTo, setFlyTo] = useState(null);
  const lastLookup = useRef(0);

  // Name the chosen point (rate-limited to respect the free geocoder's 1 request/second policy).
  useEffect(() => {
    if (!point) return undefined;
    const wait = Math.max(0, 1100 - (Date.now() - lastLookup.current));
    const id = setTimeout(async () => {
      lastLookup.current = Date.now();
      const name = await describePlace(point.lat, point.lng).catch(() => null);
      if (name) setLabel(name);
    }, Math.max(wait, 500));
    return () => clearTimeout(id);
  }, [point]);

  function choose(lat, lng, name, zoom = 15) {
    if (!isInIndia(lat, lng)) {
      setError("Wease works in India only. Choose a location in India.");
      return;
    }
    setError("");
    setPoint({ lat, lng });
    if (name) setLabel(name);
    setFlyTo({ center: [lat, lng], zoom });
  }

  async function handleSearch(e) {
    e.preventDefault();
    if (query.trim().length < 3) return setError("Type at least 3 characters to search.");
    setBusy("search");
    setError("");
    try {
      const places = await searchPlaces(query.trim());
      setResults(places);
      if (places.length === 0) setError("No places found. Try a nearby landmark or area name.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(null);
    }
  }

  function useMyLocation() {
    if (!navigator.geolocation) return setError("This browser can't share your location.");
    setBusy("gps");
    setError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setBusy(null);
        choose(pos.coords.latitude, pos.coords.longitude, null, 16);
      },
      () => {
        setBusy(null);
        setError("Couldn't get your location. Allow location access, or search instead.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  return (
    <>
      <DialogHeader className="border-b border-neutral-100 p-5 pb-4">
        <DialogTitle className="text-lg font-semibold text-neutral-900">{title}</DialogTitle>
        <DialogDescription>{description ?? "Search an address, use your current location, or tap the map to drop the pin."}</DialogDescription>
      </DialogHeader>

      <div className="space-y-3 p-5 pt-1">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Area, landmark or address" aria-label="Search address" className={inputClassName} />
          <button type="submit" disabled={busy !== null} className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-xl bg-brand-700 px-4 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-60">
            {busy === "search" ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
            <span className="hidden sm:inline">Search</span>
          </button>
        </form>

        {results.length > 0 && (
          <ul className="max-h-40 divide-y divide-neutral-100 overflow-y-auto rounded-xl border border-neutral-200">
            {results.map((r) => (
              <li key={`${r.lat},${r.lng}`}>
                <button
                  type="button"
                  onClick={() => {
                    choose(r.lat, r.lng, r.label);
                    setResults([]);
                  }}
                  className="flex w-full items-start gap-2 px-3 py-2.5 text-left text-sm hover:bg-neutral-50"
                >
                  <MapPin className="mt-0.5 size-4 shrink-0 text-neutral-400" />
                  <span className="min-w-0">
                    <span className="block font-medium text-neutral-900">{r.label}</span>
                    <span className="block truncate text-xs text-neutral-500">{r.full}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        <button type="button" onClick={useMyLocation} disabled={busy !== null} className="inline-flex h-9 items-center gap-1.5 rounded-full px-2 text-sm font-semibold text-brand-700 hover:bg-brand-50 disabled:opacity-60">
          {busy === "gps" ? <Loader2 className="size-4 animate-spin" /> : <Crosshair className="size-4" />}
          Use my current location
        </button>

        {error && <p className="text-sm font-medium text-red-600">{error}</p>}

        <WeaseMap center={start ?? INDIA_CENTER} zoom={start ? (initial?.lat != null ? 15 : 12) : 5} scrollWheelZoom className="h-72 sm:h-80">
          <ClickToPlace onPlace={(lat, lng) => choose(lat, lng, null, null)} />
          {flyTo && <FlyTo target={flyTo} />}
          {point && (
            <Marker
              position={[point.lat, point.lng]}
              icon={CUSTOMER_PIN}
              draggable
              eventHandlers={{ dragend: (e) => { const p = e.target.getLatLng(); choose(p.lat, p.lng, null, null); } }}
            />
          )}
        </WeaseMap>

        <p className="flex min-h-5 items-center gap-1.5 text-sm text-neutral-600">
          <MapPin className="size-4 shrink-0 text-brand-700" />
          {point ? label || "Pinned location" : "No location chosen yet"}
        </p>

        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onCancel} className="h-10 rounded-full px-4 text-sm font-medium text-neutral-600 hover:bg-neutral-100">
            Cancel
          </button>
          <button
            type="button"
            disabled={!point}
            onClick={() => onConfirm({ lat: point.lat, lng: point.lng, label: label || "Pinned location" })}
            className="h-10 rounded-full bg-brand-700 px-5 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-50"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </>
  );
}

function ClickToPlace({ onPlace }) {
  useMapEvents({ click: (e) => onPlace(e.latlng.lat, e.latlng.lng) });
  return null;
}

function FlyTo({ target }) {
  const map = useMap();
  useEffect(() => {
    if (target.zoom == null) map.panTo(target.center);
    else map.flyTo(target.center, target.zoom, { duration: 0.6 });
  }, [map, target]);
  return null;
}