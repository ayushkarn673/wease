import WelcomeCard from "../../components/customer/WelcomeCard";
import WorkerGrid from "../../components/customer/WorkerGrid";

export default function CustomerDashboard() {
  return (
    <div className="space-y-8">
      <WelcomeCard />
      <WorkerGrid />
    </div>
  );
}
