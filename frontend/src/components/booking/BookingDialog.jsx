import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Banknote, CalendarDays, Clock, CreditCard, Crosshair, Info, Loader2, MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createBooking } from "../../services/bookingService";
import { formatVisitCharge, getErrorMessage, professionLabel, todayIso, visitPolicy } from "@/lib/format";
import UserAvatar from "../shared/UserAvatar";
import LocationPickerDialog from "../map/LocationPickerDialog";
import { useCity } from "../../context/city";
import { SERVICE_RADIUS_KM, distanceKm, formatKm } from "@/lib/geo";

const EMPTY = { bookingDate: "", bookingTime: "", serviceAddress: "", description: "" };

export default function BookingDialog({ worker, open, onOpenChange }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const { location } = useCity();
  // Where the work is. Starts from the visitor's chosen location, if they set one.
  const [pin, setPin] = useState(() => location ?? null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const pinKm = pin && worker.hasServiceArea ? distanceKm(pin.lat, pin.lng, worker.approxLatitude, worker.approxLongitude) : null;

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate() {
    const next = {};
    if (!form.bookingDate) next.bookingDate = "Choose a date";
    else if (form.bookingDate < todayIso()) next.bookingDate = "Date can't be in the past";
    if (!form.bookingTime) next.bookingTime = "Choose a time";
    if (!form.serviceAddress.trim()) next.serviceAddress = "Enter the address where the work is needed";
    if (form.description.trim().length < 10) next.description = "Describe the job in at least 10 characters";
    if (!pin) next.pin = "Pin the service location on the map";
    // The shown base is rounded to ~1 km, so allow a little slack; the server checks the exact distance.
    else if (pinKm != null && pinKm > SERVICE_RADIUS_KM + 1)
      next.pin = `This spot is about ${formatKm(pinKm)} from ${worker.fullName}. They serve within ${SERVICE_RADIUS_KM} km.`;
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const booking = await createBooking({
        workerProfileId: worker.id,
        bookingDate: form.bookingDate,
        bookingTime: form.bookingTime.length === 5 ? `${form.bookingTime}:00` : form.bookingTime,
        serviceAddress: form.serviceAddress.trim(),
        serviceLatitude: pin.lat,
        serviceLongitude: pin.lng,
        description: form.description.trim(),
        paymentMethod: "CASH",
      });
      toast.success("Booking request sent", {
        description: `${worker.fullName} will confirm shortly.`,
      });
      setForm(EMPTY);
      onOpenChange(false);
      navigate(`/booking/${booking.bookingId}`);
    } catch (err) {
      toast.error("Couldn't send your request", { description: getErrorMessage(err) });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(value) => !submitting && onOpenChange(value)}>
      <DialogContent className="max-h-[92vh] overflow-y-auto p-0 sm:max-w-lg">
        <DialogHeader className="border-b border-neutral-100 p-6 pb-5">
          <div className="flex items-center gap-3">
            <UserAvatar name={worker.fullName} src={worker.profilePhoto} seed={worker.id} />
            <div className="min-w-0">
              <DialogTitle className="text-lg font-semibold text-neutral-900">Book {worker.fullName}</DialogTitle>
              <DialogDescription className="mt-1">
                {professionLabel(worker.profession)} · visiting charge {formatVisitCharge(worker.visitingCharge)}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="space-y-5 p-6 pt-1">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Date" icon={CalendarDays} error={errors.bookingDate}>
              <input
                type="date"
                min={todayIso()}
                value={form.bookingDate}
                onChange={(e) => update("bookingDate", e.target.value)}
                className={inputClass(errors.bookingDate)}
              />
            </Field>
            <Field label="Preferred time" icon={Clock} error={errors.bookingTime}>
              <input
                type="time"
                value={form.bookingTime}
                onChange={(e) => update("bookingTime", e.target.value)}
                className={inputClass(errors.bookingTime)}
              />
            </Field>
          </div>

          <Field label="Service address" icon={MapPin} error={errors.serviceAddress}>
            <input
              type="text"
              placeholder="House no., street, area, city"
              value={form.serviceAddress}
              onChange={(e) => update("serviceAddress", e.target.value)}
              className={inputClass(errors.serviceAddress)}
            />
          </Field>

          <div>
            <div className={`flex items-center gap-3 rounded-lg border p-3 ${errors.pin ? "border-red-300" : "border-neutral-200"}`}>
              <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${pin ? "bg-blue-50 text-blue-700" : "bg-neutral-100 text-neutral-400"}`}>
                <Crosshair className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-neutral-900">{pin ? pin.label : "Service location not pinned"}</p>
                <p className="text-xs text-neutral-500">
                  {pinKm != null ? `About ${formatKm(pinKm)} from ${worker.fullName.split(" ")[0]}` : "Needed so the professional can find you"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="h-9 shrink-0 rounded-full border border-neutral-300 px-3.5 text-sm font-semibold text-neutral-800 hover:border-brand-600 hover:text-brand-700"
              >
                {pin ? "Change" : "Pin on map"}
              </button>
            </div>
            {errors.pin && <span className="mt-1.5 block text-xs font-medium text-red-600">{errors.pin}</span>}
          </div>

          <LocationPickerDialog
            open={pickerOpen}
            onOpenChange={setPickerOpen}
            initial={pin}
            title="Where is the work?"
            description={`${worker.fullName} serves within ${SERVICE_RADIUS_KM} km of their base.`}
            confirmLabel="Use this spot"
            onConfirm={(value) => {
              setPin(value);
              if (!form.serviceAddress.trim()) update("serviceAddress", value.label);
              setErrors((prev) => ({ ...prev, pin: undefined }));
            }}
          />

          <Field label="What do you need done?" error={errors.description}>
            <textarea
              rows={4}
              maxLength={1000}
              placeholder="e.g. Kitchen tap is leaking and the sink drains slowly."
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              className={inputClass(errors.description, true)}
            />
          </Field>

          <section className="rounded-xl border border-neutral-200 p-4">
            <p className="text-sm font-semibold text-neutral-900">Price terms</p>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-neutral-500">Visiting charge</dt>
                <dd className="font-semibold text-neutral-900">{formatVisitCharge(worker.visitingCharge)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-neutral-500">Repair</dt>
                <dd className="text-right font-medium text-neutral-900">Itemised quote after inspection</dd>
              </div>
            </dl>
            {Number(worker.visitingCharge) > 0 && (
              <p className="mt-3 flex gap-2 rounded-lg bg-neutral-50 p-3 text-xs leading-relaxed text-neutral-600">
                <Info className="mt-0.5 size-3.5 shrink-0 text-neutral-400" />
                {visitPolicy(worker.visitingChargePolicy).description}
              </p>
            )}
          </section>

          <fieldset>
            <legend className="mb-2 text-sm font-medium text-neutral-700">Payment</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border-2 border-brand-600 bg-brand-50/50 p-3">
                <input type="radio" name="payment" value="CASH" checked readOnly className="mt-1 accent-brand-700" />
                <span>
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-neutral-900">
                    <Banknote className="size-4" /> Cash
                  </span>
                  <span className="text-xs text-neutral-500">Pay the professional after the job</span>
                </span>
              </label>
              <label className="flex cursor-not-allowed items-start gap-3 rounded-xl border border-neutral-200 p-3 opacity-60">
                <input type="radio" name="payment" value="ONLINE" disabled className="mt-1" />
                <span>
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-neutral-900">
                    <CreditCard className="size-4" /> UPI / card
                  </span>
                  <span className="text-xs text-neutral-500">Coming soon</span>
                </span>
              </label>
            </div>
          </fieldset>

          <p className="text-xs leading-relaxed text-neutral-500">
            By sending this request you agree to the visiting charge above. No repair work is charged until you
            approve the professional&apos;s quote.
          </p>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
              className="h-11 rounded-full border border-neutral-200 px-5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-700 px-6 text-sm font-semibold text-white transition hover:bg-brand-800 disabled:opacity-60"
            >
              {submitting && <Loader2 className="size-4 animate-spin" />}
              {submitting ? "Sending request…" : "Send booking request"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function inputClass(error, multiline = false) {
  return [
    "w-full rounded-lg border bg-white px-3.5 text-sm text-neutral-900 placeholder:text-neutral-400 transition outline-none",
    "focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10",
    multiline ? "resize-none py-2.5" : "h-11",
    error ? "border-red-300" : "border-neutral-200",
  ].join(" ");
}

function Field({ label, icon: Icon, error, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-neutral-700">
        {Icon && <Icon className="size-4 text-neutral-400" />}
        {label}
      </span>
      {children}
      {error && <span className="mt-1.5 block text-xs font-medium text-red-600">{error}</span>}
    </label>
  );
}
