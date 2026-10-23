import { useEffect, useRef, useState } from "react";

export const PULL_TRIGGER = 70; // how far (after resistance) the content must be pulled to refresh
const PULL_MAX = 110;
const MIN_SPIN_MS = 700; // keep the spinner up long enough to be seen

// Pull-to-refresh for a scrolling area on touch screens: at the very top, drag down and let go past
// PULL_TRIGGER, and `onRefresh` runs. Sideways swipes (e.g. the category chips) and maps are ignored.
// Returns how far the content is pulled, whether a finger is pulling, and whether it's refreshing.
export function usePullToRefresh(ref, onRefresh) {
  const [pull, setPull] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const latest = useRef(onRefresh);
  useEffect(() => {
    latest.current = onRefresh;
  }, [onRefresh]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    // startY: null when not tracking; mode: decided after the first few pixels ("pull" or "ignore").
    const s = { startX: 0, startY: null, mode: null, pull: 0, busy: false };

    const reset = () => {
      s.startY = null;
      s.mode = null;
      s.pull = 0;
      setPull(0);
      setDragging(false);
    };

    const onStart = (e) => {
      if (s.busy || el.scrollTop > 0 || e.touches.length !== 1 || e.target.closest?.(".leaflet-container")) return;
      s.startX = e.touches[0].clientX;
      s.startY = e.touches[0].clientY;
      s.mode = null;
    };

    const onMove = (e) => {
      if (s.startY == null) return;
      const dx = e.touches[0].clientX - s.startX;
      const dy = e.touches[0].clientY - s.startY;
      if (!s.mode) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
        s.mode = dy > Math.abs(dx) && el.scrollTop <= 0 ? "pull" : "ignore";
        if (s.mode === "pull") setDragging(true);
      }
      if (s.mode !== "pull") return;
      e.preventDefault(); // the page mustn't scroll while it's being pulled
      s.pull = Math.max(0, Math.min(PULL_MAX, dy * 0.5));
      setPull(s.pull);
    };

    const onEnd = async () => {
      if (s.startY == null) return;
      const ready = s.mode === "pull" && s.pull >= PULL_TRIGGER;
      if (!ready) return reset();
      s.startY = null;
      s.mode = null;
      s.busy = true;
      setDragging(false);
      setPull(PULL_TRIGGER * 0.8);
      setRefreshing(true);
      try {
        await Promise.all([latest.current(), new Promise((r) => setTimeout(r, MIN_SPIN_MS))]);
      } finally {
        s.busy = false;
        setRefreshing(false);
        reset();
      }
    };

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onEnd);
    el.addEventListener("touchcancel", reset);
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
      el.removeEventListener("touchcancel", reset);
    };
  }, [ref]);

  return { pull, dragging, refreshing };
}
