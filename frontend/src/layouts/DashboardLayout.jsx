import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AppHeader from "../components/shared/AppHeader";
import BottomNav from "../components/shared/BottomNav";
import RequestAlertsProvider from "../components/worker/RequestAlertsProvider";

// App shell: the top bar and the tab bar are fixed, and only the content between them scrolls. The page
// itself never scrolls, so phone browsers' bounce at the top or bottom of a page can't move the bars.
export default function DashboardLayout() {
  const content = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("app-shell");
    return () => root.classList.remove("app-shell");
  }, []);

  // Each page opens at the top, as it would with normal page scrolling.
  useEffect(() => {
    content.current?.scrollTo(0, 0);
  }, [pathname]);

  return (
    <RequestAlertsProvider>
      <div className="fixed inset-0 flex flex-col bg-surface">
        <AppHeader />
        <main ref={content} className="min-h-0 flex-1 overflow-y-auto overscroll-y-none">
          <div className="mx-auto max-w-6xl px-4 pb-8 pt-6 sm:px-6 md:pb-12 md:pt-8">
            <Outlet />
          </div>
        </main>
        <BottomNav />
      </div>
    </RequestAlertsProvider>
  );
}
