import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { createFirmProfile } from "../../services/firmService";
import BrandLogo from "../../components/shared/BrandLogo";
import FirmProfileForm from "../../components/firm/FirmProfileForm";

// Onboarding for a new labour firm: company details and daily rates.
export default function CompleteFirmProfile() {
  const navigate = useNavigate();

  async function create(payload) {
    await createFirmProfile(payload);
    toast.success("Your firm is live", { description: "Customers can now find you and request crews." });
    navigate("/firm/dashboard", { replace: true });
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-neutral-200/80 bg-white">
        <div className="mx-auto flex h-16 max-w-4xl items-center px-4 sm:px-6">
          <BrandLogo to="/" />
        </div>
      </header>
      <main className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6">
        <div>
          <p className="text-sm font-medium text-brand-700">Set up your firm</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">Tell customers about your team</h1>
          <p className="mt-2 text-sm text-neutral-500">List the skills you supply and your daily rate per worker. You can change these any time.</p>
        </div>
        <FirmProfileForm submitLabel="Create firm profile" onSubmit={create} />
      </main>
    </div>
  );
}