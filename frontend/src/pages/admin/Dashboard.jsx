import { ShieldCheck } from "lucide-react";
import PageHeader from "../../components/shared/PageHeader";
import { EmptyState } from "../../components/shared/States";

// Rendered inside DashboardLayout via the router (the layout renders an <Outlet/>).
export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader title="Admin overview" description="Platform moderation and reporting." />
      <EmptyState
        icon={ShieldCheck}
        title="Admin tools are on the way"
        description="User management, worker verification and reports will appear here once the admin API is available."
      />
    </div>
  );
}
