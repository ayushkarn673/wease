import { useState } from "react";
import { toast } from "sonner";
import { Loader2, XCircle } from "lucide-react";
import { cancelBooking } from "../../services/bookingService";
import { getErrorMessage } from "@/lib/format";

// Lets the customer cancel a booking that is still pending or confirmed, with a confirmation step.
export default function CancelBookingCard({ booking, onCancelled }) {
  const [confirming, setConfirming] = useState(false);
  const [saving, setSaving] = useState(false);
  const confirmed = booking.status === "ACCEPTED";

  async function handleCancel() {
    setSaving(true);
    try {
      const updated = await cancelBooking(booking.bookingId);
      toast.success("Booking cancelled");
      onCancelled(updated);
    } catch (err) {
      toast.error("Couldn't cancel the booking", { description: getErrorMessage(err) });
      setSaving(false);
      setConfirming(false);
    }
  }

  return (
    <div className="rounded-2xl border border-neutral-200/80 bg-white p-5">
      {confirming ? (
        <>
          <p className="font-semibold text-neutral-900">Cancel this booking?</p>
          <p className="mt-1 text-sm text-neutral-500">
            {confirmed
              ? `${booking.workerName} has already confirmed this job. They will see it as cancelled.`
              : "Your request will be withdrawn."}
          </p>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={saving}
              className="h-10 flex-1 rounded-full bg-surface text-sm font-medium text-neutral-700 hover:bg-neutral-200"
            >
              Keep booking
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-red-600 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
            >
              {saving && <Loader2 className="size-4 animate-spin" />}
              Yes, cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm text-neutral-500">Plans changed?</p>
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="mt-2 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full border border-red-200 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            <XCircle className="size-4" />
            Cancel booking
          </button>
        </>
      )}
    </div>
  );
}
