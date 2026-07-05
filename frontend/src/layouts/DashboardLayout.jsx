import { Outlet } from "react-router-dom";
import DashboardHeader from "../components/customer/DashboardHeader";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <DashboardHeader />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
