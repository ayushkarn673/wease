import { toast } from "sonner";
import { useAsync } from "../../hooks/useAsync";
import { getOwnFirm, updateFirmProfile } from "../../services/firmService";
import HeroPanel from "../../components/shared/HeroPanel";
import FirmProfileForm from "../../components/firm/FirmProfileForm";
import { ErrorState, Skeleton } from "../../components/shared/States";

export default function FirmProfile() {
  const { status, data: firm, reload, setData } = useAsync(getOwnFirm);

  async function save(payload) {
    const updated = await updateFirmProfile(payload);
    setData(updated);
    toast.success("Company profile saved", { description: "New rates apply to new requests only." });
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <HeroPanel>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Company profile</h1>
        <p className="mt-1 text-sm text-white/70">What customers see on your firm's page.</p>
      </HeroPanel>
      {status === "loading" && <Skeleton className="h-96" />}
      {status === "error" && <ErrorState message="We couldn't load your company profile." onRetry={reload} />}
      {status === "ready" && <FirmProfileForm key={firm.id} firm={firm} submitLabel="Save changes" onSubmit={save} />}
    </div>
  );
}