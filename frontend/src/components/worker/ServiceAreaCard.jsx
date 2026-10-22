import { useState } from "react";
import { toast } from "sonner";
import { Crosshair, MapPinned } from "lucide-react";
import { updateWorkerLocation } from "../../services/workerService";
import { getErrorMessage } from "@/lib/format";
import { SERVICE_RADIUS_KM } from "@/lib/geo";
import ServiceAreaMap from "../map/ServiceAreaMap";
import LocationPickerDialog from "../map/LocationPickerDialog";

// The worker's base location and 10 km service area. Customers searching by location only find
// professionals who have set this.
export default function ServiceAreaCard({ profile, onSaved }) {
  const [open, setOpen] = useState(false);
  const hasBase = profile.latitude != null && profile.longitude != null;

  async function save(value) {
    try {
      const updated = await updateWorkerLocation(value);
      onSaved(updated);
      toast.success("Service area saved", { description: `You'll get requests within ${SERVICE_RADIUS_KM} km of ${value.label}.` });
    } catch (err) {
      toast.error("Couldn't save your location", { description: getErrorMessage(err) });
    }
  }

  return (
    <section className="rounded-2xl border border-neutral-200/80 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <MapPinned className="size-5" />
          </span>
          <div>
            <p className="font-semibold text-neutral-900">Your service area</p>
            {hasBase ? (
              <p className="text-sm text-neutral-500">Customers within {SERVICE_RADIUS_KM} km of your base can find and book you.</p>
            ) : (
              <p className="text-sm text-amber-700">
                Set your base location — customers searching near them can&apos;t find you until you do.
              </p>
            )}
            <p className="mt-0.5 text-xs text-neutral-400">Customers only see your area to about 1 km, never your exact location.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-neutral-300 px-3.5 text-sm font-semibold text-neutral-800 hover:border-brand-600 hover:text-brand-700"
        >
          <Crosshair className="size-3.5" />
          {hasBase ? "Change" : "Set base"}
        </button>
      </div>

      {hasBase && (
        <div className="mt-4">
          <ServiceAreaMap lat={profile.latitude} lng={profile.longitude} className="h-56" />
        </div>
      )}

      <LocationPickerDialog
        open={open}
        onOpenChange={setOpen}
        initial={hasBase ? { lat: profile.latitude, lng: profile.longitude, label: profile.address } : null}
        title="Set your base location"
        description={`Usually your home or shop. You'll serve customers within ${SERVICE_RADIUS_KM} km of it.`}
        confirmLabel="Save base location"
        onConfirm={save}
      />
    </section>
  );
}
