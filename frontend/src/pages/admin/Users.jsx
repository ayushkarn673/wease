import MainLayout from "../../layouts/MainLayout";
import { Container } from "@/components/ui/Container";

export default function AdminUsers() {
  return (
    <MainLayout>
      <Container className="py-12">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">User Management</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">View, audit, and moderate standard client accounts.</p>
      </Container>
    </MainLayout>
  );
}
