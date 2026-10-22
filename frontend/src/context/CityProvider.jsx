import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";
import { CityContext } from "./city";
import { updateCity } from "../services/userService";
import { getErrorMessage } from "@/lib/format";

const STORAGE_KEY = "wease.city";
const LOCATION_KEY = "wease.location";

// The visitor's pinned location stays in this browser only (it is never saved to their account).
function readLocation() {
  try {
    const saved = JSON.parse(localStorage.getItem(LOCATION_KEY));
    return saved && Number.isFinite(saved.lat) && Number.isFinite(saved.lng) ? saved : null;
  } catch {
    return null;
  }
}

function readGuestCity() {
  try {
    return localStorage.getItem(STORAGE_KEY) || null;
  } catch {
    return null;
  }
}

// The city a visitor is browsing in. Signed-in customers keep it on their account so it follows them
// across devices; everyone else keeps it in this browser.
export default function CityProvider({ children }) {
  const { user, updateUser } = useAuth();
  const [guestCity, setGuestCity] = useState(readGuestCity);
  const [saving, setSaving] = useState(false);
  const [location, setLocationState] = useState(readLocation);
  const isCustomer = user?.role === "CUSTOMER";
  const city = isCustomer ? user.city ?? null : guestCity;

  const setCity = useCallback(
    async (next) => {
      const value = next || null;
      if (isCustomer) {
        setSaving(true);
        try {
          const updated = await updateCity(value);
          updateUser({ city: updated.city ?? null });
        } catch (err) {
          toast.error("Couldn't change your city", { description: getErrorMessage(err) });
        } finally {
          setSaving(false);
        }
        return;
      }
      setGuestCity(value);
      try {
        if (value) localStorage.setItem(STORAGE_KEY, value);
        else localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Storage unavailable (private mode); the choice still applies for this visit.
      }
    },
    [isCustomer, updateUser]
  );

  const setLocation = useCallback((next) => {
    setLocationState(next || null);
    try {
      if (next) localStorage.setItem(LOCATION_KEY, JSON.stringify({ lat: next.lat, lng: next.lng, label: next.label }));
      else localStorage.removeItem(LOCATION_KEY);
    } catch {
      // Storage unavailable; the location still applies for this visit.
    }
  }, []);

  const value = useMemo(() => ({ city, setCity, saving, location, setLocation }), [city, setCity, saving, location, setLocation]);
  return <CityContext.Provider value={value}>{children}</CityContext.Provider>;
}