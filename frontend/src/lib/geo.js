// Geography helpers shared by the maps. Professionals serve within SERVICE_RADIUS_KM of their base.
export const SERVICE_RADIUS_KM = 10;

// Approximate city centres, used to place firm coverage and to centre maps.
export const CITY_CENTERS = {
  Pune: [18.5204, 73.8567],
  Mumbai: [19.076, 72.8777],
  Bengaluru: [12.9716, 77.5946],
  Delhi: [28.6139, 77.209],
  Hyderabad: [17.385, 78.4867],
  Chennai: [13.0827, 80.2707],
  Kolkata: [22.5726, 88.3639],
  Ahmedabad: [23.0225, 72.5714],
  Jaipur: [26.9124, 75.7873],
  Lucknow: [26.8467, 80.9462],
};

export const INDIA_CENTER = [22.5, 79];

export function distanceKm(lat1, lng1, lat2, lng2) {
  const rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(lat2 - lat1);
  const dLng = rad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatKm(km) {
  if (km == null) return "";
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
}

export function isInIndia(lat, lng) {
  return lat >= 6 && lat <= 37.5 && lng >= 68 && lng <= 97.5;
}

// Directions in Google Maps (no API key needed). It starts from the phone's current location and shows
// the route, distance and travel time itself; `navigate` starts turn-by-turn navigation straight away.
export function directionsUrl(lat, lng, { navigate = false } = {}) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}${navigate ? "&dir_action=navigate" : ""}`;
}