// Address search via OpenStreetMap's Nominatim. Its usage policy allows at most one request per second
// and no search-as-you-type, so callers search only when the user submits.
const NOMINATIM = "https://nominatim.openstreetmap.org";

function shortLabel(place) {
  const a = place.address ?? {};
  const area = a.suburb || a.neighbourhood || a.village || a.town || a.city_district || a.road;
  const city = a.city || a.town || a.county || a.state_district;
  return [area, city].filter(Boolean).filter((v, i, arr) => arr.indexOf(v) === i).join(", ") || place.display_name?.split(",").slice(0, 2).join(",");
}

export async function searchPlaces(query) {
  const params = new URLSearchParams({ q: query, format: "jsonv2", countrycodes: "in", limit: "5", addressdetails: "1", "accept-language": "en" });
  const res = await fetch(`${NOMINATIM}/search?${params}`);
  if (!res.ok) throw new Error("Address search is unavailable right now.");
  const places = await res.json();
  return places.map((p) => ({ lat: Number(p.lat), lng: Number(p.lon), label: shortLabel(p), full: p.display_name }));
}

export async function describePlace(lat, lng) {
  const params = new URLSearchParams({ lat, lon: lng, format: "jsonv2", zoom: "16", addressdetails: "1", "accept-language": "en" });
  const res = await fetch(`${NOMINATIM}/reverse?${params}`);
  if (!res.ok) return null;
  const place = await res.json();
  return place?.address ? shortLabel(place) : null;
}