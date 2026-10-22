import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createCrewRequest } from "../../services/crewService";
import { formatCurrency, getErrorMessage, professionLabel, todayIso } from "@/lib/format";
import { inputClassName, textareaClassName } from "@/lib/styles";
import { FormField } from "../shared/FormField";
import FirmAvatar from "./FirmAvatar";
import { useCity } from "../../context/city";

// Customer asks a firm for N workers of one skill for N days, and sees the estimate before sending.
export default function CrewRequestDialog({ firm, profession, open, onOpenChange }) {
  const navigate = useNavigate();
  const { city } = useCity();
  const cities = firm.coveredCities?.length ? firm.coveredCities : [firm.city];
  const [form, setForm] = useState(() => ({
    profession: profession && firm.rates.some((r) => r.profession === profession) ? profession : firm.rates[0]?.profession ?? "",
    workers: "2",
    days: "1",
    startDate: "",
    reportingTime: "09:00",
    siteCity: cities.includes(city) ? city : cities[0],
    siteAddress: "",
    description: "",
  }));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const rate = Number(firm.rates.find((r) => r.profession === form.profession)?.dailyRate ?? 0);
  const workers = Number(form.workers);
  const days = Number(form.days);
  const validCounts = Number.isInteger(workers) && workers >= 1 && Number.isInteger(days) && days >= 1;
  const estimate = validCounts ? rate * workers * days : 0;

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate() {
    const next = {};
    if (!form.profession) next.profession = "Choose a skill";
    if (!Number.isInteger(workers) || workers < 1 || workers > 200) next.workers = "1 to 200 workers";
    if (!Number.isInteger(days) || days < 1 || days > 60) next.days = "1 to 60 days";
    if (!form.startDate) next.startDate = "Choose a start date";
    else if (form.startDate < todayIso()) next.startDate = "Date can't be in the past";
    if (!form.reportingTime) next.reportingTime = "Choose a time";
    if (!form.siteCity) next.siteCity = "Choose the site's city";
    if (!form.siteAddress.trim()) next.siteAddress = "Enter the site address";
    if (form.description.trim().length < 10) next.description = "Describe the work in at least 10 characters";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const created = await createCrewRequest({
        firmId: firm.id,
        profession: form.profession,
        workers,
        days,
        startDate: form.startDate,
        reportingTime: form.reportingTime.length === 5 ? `${form.reportingTime}:00` : form.reportingTime,
        siteCity: form.siteCity,
        siteAddress: form.siteAddress.trim(),
        description: form.description.trim(),
      });
      toast.success("Crew request sent", { description: `${firm.companyName} will confirm shortly.` });
      onOpenChange(false);
      navigate(`/crew/${created.id}`);
    } catch (err) {
      toast.error("Couldn't send your request", { description: getErrorMessage(err) });
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !saving && onOpenChange(v)}>
      <DialogContent className="max-h-[92vh] overflow-y-auto p-0 sm:max-w-lg">
        <DialogHeader className="border-b border-neutral-100 p-6 pb-5">
          <div className="flex items-center gap-3">
            <FirmAvatar name={firm.companyName} size="sm" />
            <div className="min-w-0">
              <DialogTitle className="text-lg font-semibold text-neutral-900">Request a crew</DialogTitle>
              <DialogDescription className="mt-0.5 truncate">{firm.companyName} · {firm.city}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="space-y-4 p-6 pt-1">
          <FormField label="Skill needed" error={errors.profession}>
            <select value={form.profession} onChange={(e) => update("profession", e.target.value)} className={inputClassName}>
              {firm.rates.map((r) => (
                <option key={r.profession} value={r.profession}>
                  {professionLabel(r.profession)} — {formatCurrency(r.dailyRate)} per worker per day
                </option>
              ))}
            </select>
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Workers" error={errors.workers}>
              <input type="number" min="1" max="200" inputMode="numeric" value={form.workers} onChange={(e) => update("workers", e.target.value)} className={inputClassName} />
            </FormField>
            <FormField label="Days" error={errors.days}>
              <input type="number" min="1" max="60" inputMode="numeric" value={form.days} onChange={(e) => update("days", e.target.value)} className={inputClassName} />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Start date" error={errors.startDate}>
              <input type="date" min={todayIso()} value={form.startDate} onChange={(e) => update("startDate", e.target.value)} className={inputClassName} />
            </FormField>
            <FormField label="Reporting time" error={errors.reportingTime}>
              <input type="time" value={form.reportingTime} onChange={(e) => update("reportingTime", e.target.value)} className={inputClassName} />
            </FormField>
          </div>

          <FormField label="Site city" hint={`${firm.companyName} supplies crews in ${cities.join(", ")}`} error={errors.siteCity}>
            <select value={form.siteCity} onChange={(e) => update("siteCity", e.target.value)} className={inputClassName}>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Site address" error={errors.siteAddress}>
            <input type="text" maxLength={255} placeholder="Plot / building, street, area, city" value={form.siteAddress} onChange={(e) => update("siteAddress", e.target.value)} className={inputClassName} />
          </FormField>

          <FormField label="What's the work?" error={errors.description}>
            <textarea rows={3} maxLength={1000} placeholder="e.g. Shifting cement bags and bricks to the 2nd floor for a renovation." value={form.description} onChange={(e) => update("description", e.target.value)} className={textareaClassName} />
          </FormField>

          <div className="rounded-xl bg-brand-50 p-4">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm text-brand-900">
                {validCounts ? `${workers} ${workers === 1 ? "worker" : "workers"} × ${days} ${days === 1 ? "day" : "days"} × ${formatCurrency(rate)}` : "Estimate"}
              </span>
              <span className="text-xl font-bold text-brand-900">{formatCurrency(estimate)}</span>
            </div>
            <p className="mt-1 text-xs text-brand-900/70">
              The firm can only bill less than this (if fewer worker-days are used), never more. Pay the firm after the work.
            </p>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => onOpenChange(false)} disabled={saving} className="h-11 rounded-full border border-neutral-200 px-5 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-700 px-6 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-60">
              {saving && <Loader2 className="size-4 animate-spin" />}
              Send request
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}