import { useEffect, useRef } from "react";

// Calls `callback` every `intervalMs` while the page is on screen, and straight away when the tab or
// window comes back into view, so both sides of a booking see each other's changes without
// reloading. Nothing runs while the tab is hidden or `enabled` is false, and a slow request is never
// overlapped by the next one.
export function usePolling(callback, intervalMs, enabled = true) {
  const latest = useRef(callback);
  useEffect(() => {
    latest.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return undefined;
    let busy = false;

    async function tick() {
      if (busy || document.visibilityState !== "visible") return;
      busy = true;
      try {
        await latest.current();
      } catch {
        // A failed background refresh keeps the current data; the next tick tries again.
      } finally {
        busy = false;
      }
    }

    const timer = setInterval(tick, intervalMs);
    const onVisible = () => document.visibilityState === "visible" && tick();
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", tick);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", tick);
    };
  }, [intervalMs, enabled]);
}
