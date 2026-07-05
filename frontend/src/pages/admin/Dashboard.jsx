import DashboardLayout from "../../layouts/DashboardLayout";
import { Container } from "@/components/ui/Container";

export default function AdminDashboard() {
  return (
    <DashboardLayout userType="admin">
      <Container className="py-12">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Control Center</h1>
        <p className="mt-2 text-slate-650 dark:text-slate-400">Moderation dashboard and analytics monitoring panel.</p>
      </Container>
    </DashboardLayout>
  );
}
