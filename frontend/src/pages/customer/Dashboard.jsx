import DashboardLayout from "../../layouts/DashboardLayout";
import { Container } from "@/components/ui/Container";

export default function CustomerDashboard() {
  return (
    <DashboardLayout userType="customer">
      <Container className="py-12">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Customer Dashboard</h1>
        <p className="mt-2 text-slate-650 dark:text-slate-400">Welcome to your dashboard. Book a service and track progress.</p>
      </Container>
    </DashboardLayout>
  );
}
