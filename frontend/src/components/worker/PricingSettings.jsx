import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Pencil, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { updateWorkerPricing } from "../../services/workerService";
import { VISIT_POLICIES, formatVisitCharge, getErrorMessage, visitPolicy } from "@/lib/format";
import { inputClassName } from "@/lib/styles";

// The worker's own visiting charge and how it's billed. Changes apply to new bookings only.
export default function PricingSettings({ profile, onSaved }) {
  const [editing, setEditing] = useState(false);
  const notSet = profile.visitingCharge == null;

  return (
    <section className="rounded-2xl border border-neutral-200/80 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <Tag className="size-5" />
          </span>
          <div>
            <p className="font-semibold text-neutral-900">Your pricing</p>
            {notSet ? (
              <p className="text-sm text-amber-700">No visiting charge set — customers currently see a free visit.</p>
            ) : (
              <p className="text-sm text-neutral-500">
                Visiting charge <span className="font-semibold text-neutral-900">{formatVisitCharge(profile.visitingCharge)}</span> ·{" "}
                {visitPolicy(profile.visitingChargePolicy).label.toLowerCase()}
              </p>
            )}
            <p className="mt-0.5 text-xs text-neutral-400">Repair work is priced per job with a quote after inspection.</p>
          </div>
        </div>
        {!editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-neutral-300 px-3.5 text-sm font-semibold text-neutral-800 hover:border-brand-600 hover:text-brand-700"
          >
            <Pencil className="size-3.5" />
            {notSet ? "Set" : "Edit"}
          </button>
        )}
      </div>

      {editing && (
        <PricingForm
          profile={profile}
          onCancel={() => setEditing(false)}
          onSaved={(updated) => {
            setEditing(false);
            onSaved(updated);
          }}
        />
      )}
    </section>
  );
}

function PricingForm({ profile, onCancel, onSaved }) {
  const [charge, setCharge] = useState(profile.visitingCharge != null ? String(profile.visitingCharge) : "");
  const [policy, setPolicy] = useState(profile.visitingChargePolicy ?? "ADJUST_AGAINST_FINAL_BILL");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const value = Number(charge);
    if (charge === "" || !Number.isFinite(value) || value < 0) return setError("Enter an amount (0 for a free visit)");
    if (value > 5000) return setError("Visiting charge can be at most ₹5,000");
    setError("");
    setSaving(true);
    try {
      const updated = await updateWorkerPricing({ visitingCharge: value, visitingChargePolicy: policy });
      toast.success("Pricing saved", { description: "New bookings will use these terms." });
      onSaved(updated);
    } catch (err) {
      toast.error("Couldn't save pricing", { description: getErrorMessage(err) });
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4 border-t border-neutral-100 pt-5">
      <label className="block max-w-xs">
        <span className="text-sm font-medium text-neutral-700">Visiting charge (₹)</span>
        <span className="block text-xs text-neutral-500">Covers your travel and inspecting the job.</span>
        <input
          type="number"
          min="0"
          max="5000"
          step="1"
          inputMode="numeric"
          value={charge}
          onChange={(e) => setCharge(e.target.value)}
          placeholder="e.g. 150"
          className={cn(inputClassName, "mt-1.5")}
        />
        {error && <span className="mt-1.5 block text-xs font-medium text-red-600">{error}</span>}
      </label>

      <fieldset>
        <legend className="text-sm font-medium text-neutral-700">If the customer goes ahead with the repair</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {Object.entries(VISIT_POLICIES).map(([value, info]) => (
            <label
              key={value}
              className={cn(
                "flex cursor-pointer gap-3 rounded-xl border p-3.5 transition",
                policy === value ? "border-brand-600 bg-brand-50/50 ring-1 ring-brand-600" : "border-neutral-200 hover:border-neutral-300"
              )}
            >
              <input
                type="radio"
                name="policy"
                value={value}
                checked={policy === value}
                onChange={() => setPolicy(value)}
                className="mt-1 accent-brand-700"
              />
              <span>
                <span className="block text-sm font-semibold text-neutral-900">{info.label}</span>
                <span className="text-xs leading-relaxed text-neutral-500">{info.description}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <p className="text-xs text-neutral-500">Customers see these terms before booking. Existing bookings keep the terms they were made with.</p>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} disabled={saving} className="h-10 rounded-full px-4 text-sm font-medium text-neutral-600 hover:bg-neutral-100">
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-brand-700 px-5 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-60"
        >
          {saving && <Loader2 className="size-4 animate-spin" />}
          Save pricing
        </button>
      </div>
    </form>
  );
}
