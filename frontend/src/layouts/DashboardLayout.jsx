import { useCallback, useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";
import AppHeader from "../components/shared/AppHeader";
import BottomNav from "../components/shared/BottomNav";
import RequestAlertsProvider from "../components/worker/RequestAlertsProvider";
import { PULL_TRIGGER, usePullToRefresh } from "../hooks/usePullToRefresh";

// App shell: the top bar and the tab bar are fixed, and only the content between them scrolls. The page
// itself never scrolls, so phone browsers' bounce at the top or bottom of a page can't move the bars.
// Pulling the content down at the top refreshes the page's data.
export default function DashboardLayout() {
  const content = useRef(null);
  const { pathname } = useLocation();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("app-shell");
    return () => root.classList.remove("app-shell");
  }, []);

  // Each page opens at the top, as it would with normal page scrolling.
  useEffect(() => {
    content.current?.scrollTo(0, 0);
  }, [pathname]);

  // Remounting the page makes it load its data again, like a reload but without restarting the app.
  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);
  const { pull, dragging, refreshing } = usePullToRefresh(content, refresh);

  return (
    <RequestAlertsProvider>
      <div className="fixed inset-0 flex flex-col bg-surface">
        <AppHeader />
        <main ref={content} className="relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-y-none">
          <PullIndicator pull={pull} refreshing={refreshing} />
          <div
            style={pull ? { transform: `translateY(${pull}px)` } : undefined}
            className={cn(!dragging && "transition-transform duration-200 ease-out")}
          >
            <div key={refreshKey} className="mx-auto max-w-6xl px-4 pb-8 pt-6 sm:px-6 md:pb-12 md:pt-8">
              <Outlet />
            </div>
          </div>
        </main>
        <BottomNav />
      </div>
    </RequestAlertsProvider>
  );
}

function PullIndicator({ pull, refreshing }) {
  if (!pull && !refreshing) return null;
  const ready = refreshing || pull >= PULL_TRIGGER;
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center"
      style={{ height: pull, opacity: refreshing ? 1 : Math.min(1, pull / PULL_TRIGGER) }}
      role="status"
      aria-label={refreshing ? "Refreshing" : ready ? "Release to refresh" : "Pull to refresh"}
    >
      <span
        className={cn(
          "mt-auto mb-2 flex size-9 items-center justify-center rounded-full border shadow-sm",
          ready ? "border-brand-600 bg-brand-700 text-white" : "border-neutral-200 bg-white text-neutral-500"
        )}
      >
        <RotateCw
          className={cn("size-4", refreshing && "animate-spin")}
          style={refreshing ? undefined : { transform: `rotate(${pull * 3}deg)` }}
        />
      </span>
    </div>
  );
}
