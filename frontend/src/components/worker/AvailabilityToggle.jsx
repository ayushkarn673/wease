import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getErrorMessage } from "@/lib/format";
import { updateAvailability } from "../../services/bookingService";

// Switch bound to real availability (the worker's by default; firms pass their own save function).
// Calls onChange with the saved value.
export default function AvailabilityToggle({ available, onChange, save = updateAvailability, noun = "bookings" }) {
  const [saving, setSaving] = useState(false);

  async function handleToggle() {
    setSaving(true);
    try {
      const profile = await save(!available);
      onChange(profile.available);
      toast.success(profile.available ? `You're now accepting ${noun}` : `You're hidden from new ${noun}`);
    } catch (err) {
      toast.error("Couldn't update availability", { description: getErrorMessage(err) });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <div className="text-right">
        <p className="text-sm font-semibold text-white">{available ? `Accepting ${noun}` : "Not available"}</p>
        <p className="text-xs text-white/70">{available ? "Customers can find you" : "Hidden from search"}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={available}
        aria-label={`Accepting ${noun}`}
        onClick={handleToggle}
        disabled={saving}
        className={cn(
          "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition disabled:opacity-60",
          available ? "bg-emerald-400" : "bg-white/30"
        )}
      >
        <span
          className={cn(
            "inline-block size-5 rounded-full bg-white transition-transform",
            available ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </div>
  );
}
