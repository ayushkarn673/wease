import DashboardLayout from "../../layouts/DashboardLayout";
import { Container } from "@/components/ui/Container";

export default function WorkerDashboard() {
  return (
    <DashboardLayout userType="worker">
      <Container className="py-12">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Worker Dashboard</h1>
        <p className="mt-2 text-slate-650 dark:text-slate-400">Welcome to your worker panel. Manage schedules and profile visibility.</p>
      </Container>
    </DashboardLayout>
  );
}
