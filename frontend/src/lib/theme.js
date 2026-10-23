import { useSyncExternalStore } from "react";

// Appearance: "system" follows the device's light/dark setting; "light" and "dark" fix it on this device.
// The first paint is handled by the script in index.html (same key and rules); this keeps it in sync after.
export const THEME_KEY = "wease-theme";
export const THEME_CHOICES = ["system", "light", "dark"];

const darkMedia = () => window.matchMedia("(prefers-color-scheme: dark)");
const listeners = new Set();

export function getThemePref() {
  try {
    const value = localStorage.getItem(THEME_KEY);
    return THEME_CHOICES.includes(value) ? value : "system";
  } catch {
    return "system";
  }
}

const isDark = (pref) => pref === "dark" || (pref === "system" && darkMedia().matches);

export function setThemePref(pref) {
  try {
    if (pref === "system") localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, pref);
  } catch {
    // Storage blocked (e.g. private mode): the choice still applies until the page is closed.
  }
  const dark = isDark(pref);
  document.documentElement.classList.toggle("dark", dark);
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute("content", dark ? "#121a18" : "#ffffff"));
  listeners.forEach((notify) => notify());
}

function subscribe(notify) {
  listeners.add(notify);
  const media = darkMedia();
  media.addEventListener("change", notify);
  return () => {
    listeners.delete(notify);
    media.removeEventListener("change", notify);
  };
}

// The chosen setting: "system" | "light" | "dark".
export const useThemePref = () => useSyncExternalStore(subscribe, getThemePref, () => "system");

// What's actually showing: "light" or "dark".
export const useResolvedTheme = () => useSyncExternalStore(subscribe, () => (isDark(getThemePref()) ? "dark" : "light"), () => "light");
