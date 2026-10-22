import { Outlet } from "react-router-dom";
import AppHeader from "../components/shared/AppHeader";
import BottomNav from "../components/shared/BottomNav";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-surface">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6 md:pb-12 md:pt-8">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
