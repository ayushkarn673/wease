import { useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { PROFESSIONS, getErrorMessage } from "@/lib/format";
import { CITIES } from "@/lib/cities";
import { inputClassName, textareaClassName } from "@/lib/styles";
import { FormField, FormSection } from "../shared/FormField";

const GSTIN = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
const PHONE = /^(\+91[- ]?)?[6-9]\d{9}$/;

function toForm(firm) {
  return {
    companyName: firm?.companyName ?? "",
    contactPerson: firm?.contactPerson ?? "",
    phone: firm?.phone ?? "",
    city: firm?.city ?? CITIES[0],
    address: firm?.address ?? "",
    gstin: firm?.gstin ?? "",
    teamSize: firm?.teamSize != null ? String(firm.teamSize) : "",
    about: firm?.about ?? "",
    coverage: firm?.coverage ?? "HOME_CITY",
    serviceCities: firm?.coverage === "SELECTED_CITIES" ? firm.coveredCities : [firm?.city ?? CITIES[0]],
    rates: firm?.rates?.length
      ? firm.rates.map((r) => ({ key: crypto.randomUUID(), profession: r.profession, dailyRate: String(r.dailyRate) }))
      : [{ key: crypto.randomUUID(), profession: "LABOURER", dailyRate: "" }],
  };
}

// Company details and the daily rate per worker for each skill the firm supplies.
// `onSubmit(payload)` must return a promise; server errors are shown on the form.
export default function FirmProfileForm({ firm, submitLabel, onSubmit }) {
  const [form, setForm] = useState(() => toForm(firm));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function updateRate(key, field, value) {
    setForm((f) => ({ ...f, rates: f.rates.map((r) => (r.key === key ? { ...r, [field]: value } : r)) }));
    setErrors((e) => ({ ...e, rates: undefined }));
  }

  const usedSkills = new Set(form.rates.map((r) => r.profession));

  function validate() {
    const next = {};
    if (!form.companyName.trim()) next.companyName = "Enter your company name";
    if (!form.contactPerson.trim()) next.contactPerson = "Enter a contact person";
    if (!PHONE.test(form.phone.trim())) next.phone = "Enter a valid 10-digit mobile number";
    if (!form.address.trim()) next.address = "Enter your office or yard address";
    if (form.gstin.trim() && !GSTIN.test(form.gstin.trim())) next.gstin = "Enter a valid 15-character GSTIN, or leave it empty";
    const team = Number(form.teamSize);
    if (!Number.isInteger(team) || team < 1 || team > 10000) next.teamSize = "Enter how many workers you can supply";
    if (form.coverage === "SELECTED_CITIES" && form.serviceCities.length === 0) next.serviceCities = "Choose at least one city";
    if (form.rates.length === 0) next.rates = "Add at least one skill";
    else if (new Set(form.rates.map((r) => r.profession)).size !== form.rates.length) next.rates = "Each skill can only be listed once";
    else if (form.rates.some((r) => !(Number(r.dailyRate) >= 100 && Number(r.dailyRate) <= 100000)))
      next.rates = "Daily rates must be between ₹100 and ₹1,00,000 per worker";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await onSubmit({
        companyName: form.companyName.trim(),
        contactPerson: form.contactPerson.trim(),
        phone: form.phone.trim(),
        city: form.city,
        address: form.address.trim(),
        gstin: form.gstin.trim() || null,
        teamSize: Number(form.teamSize),
        about: form.about.trim() || null,
        coverage: form.coverage,
        serviceCities: form.coverage === "SELECTED_CITIES" ? form.serviceCities : [],
        rates: form.rates.map((r) => ({ profession: r.profession, dailyRate: Number(r.dailyRate) })),
      });
    } catch (err) {
      const data = err?.response?.data;
      if (data && typeof data === "object" && !data.message) {
        const rateError = Object.entries(data).find(([key]) => key.startsWith("rates"));
        setErrors({ ...data, ...(rateError && { rates: rateError[1] }) });
      }
      else setErrors({ server: getErrorMessage(err) });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {errors.server && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errors.server}</p>}

      <FormSection title="Company" description="How customers see your firm.">
        <FormField label="Company name" error={errors.companyName}>
          <input maxLength={120} value={form.companyName} onChange={(e) => update("companyName", e.target.value)} placeholder="e.g. Shree Ganesh Labour Contractors" className={inputClassName} />
        </FormField>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Team size" hint="Workers you can supply" error={errors.teamSize}>
            <input type="number" min="1" inputMode="numeric" value={form.teamSize} onChange={(e) => update("teamSize", e.target.value)} className={inputClassName} />
          </FormField>
          <FormField label="GSTIN (optional)" error={errors.gstin}>
            <input maxLength={15} value={form.gstin} onChange={(e) => update("gstin", e.target.value.toUpperCase())} placeholder="27ABCDE1234F1Z5" className={cn(inputClassName, "uppercase")} />
          </FormField>
        </div>
        <FormField label="About (optional)" error={errors.about}>
          <textarea rows={3} maxLength={1000} value={form.about} onChange={(e) => update("about", e.target.value)} placeholder="e.g. Loading, shifting and construction labour for homes, shops and sites." className={textareaClassName} />
        </FormField>
      </FormSection>

      <FormSection title="Contact & location" description="Your phone is shared with a customer only after you accept their request.">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Contact person" error={errors.contactPerson}>
            <input maxLength={100} value={form.contactPerson} onChange={(e) => update("contactPerson", e.target.value)} className={inputClassName} />
          </FormField>
          <FormField label="Mobile number" error={errors.phone}>
            <input type="tel" inputMode="tel" maxLength={15} value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="98765 43210" className={inputClassName} />
          </FormField>
        </div>
        <div className="grid gap-5 sm:grid-cols-[180px_1fr]">
          <FormField label="City" error={errors.city}>
            <select value={form.city} onChange={(e) => update("city", e.target.value)} className={inputClassName}>
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Office / yard address" error={errors.address}>
            <input maxLength={255} value={form.address} onChange={(e) => update("address", e.target.value)} className={inputClassName} />
          </FormField>
        </div>

        <fieldset>
          <legend className="text-sm font-medium text-neutral-700">Where do you supply crews?</legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {[
              { value: "HOME_CITY", title: `All of ${form.city}`, hint: "Anywhere in your home city" },
              { value: "SELECTED_CITIES", title: "Selected cities", hint: "Choose one or more cities" },
            ].map((option) => (
              <label
                key={option.value}
                className={cn(
                  "flex cursor-pointer gap-3 rounded-xl border p-3.5 transition",
                  form.coverage === option.value ? "border-brand-600 bg-brand-50/50 ring-1 ring-brand-600" : "border-neutral-200 hover:border-neutral-300"
                )}
              >
                <input
                  type="radio"
                  name="coverage"
                  checked={form.coverage === option.value}
                  onChange={() => update("coverage", option.value)}
                  className="mt-1 accent-brand-700"
                />
                <span>
                  <span className="block text-sm font-semibold text-neutral-900">{option.title}</span>
                  <span className="text-xs text-neutral-500">{option.hint}</span>
                </span>
              </label>
            ))}
          </div>
          {form.coverage === "SELECTED_CITIES" && (
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {CITIES.map((c) => {
                const checked = form.serviceCities.includes(c);
                return (
                  <label key={c} className={cn("flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm", checked ? "border-brand-600 bg-brand-50/50 font-medium text-brand-800" : "border-neutral-200 text-neutral-700")}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => update("serviceCities", checked ? form.serviceCities.filter((x) => x !== c) : [...form.serviceCities, c])}
                      className="accent-brand-700"
                    />
                    {c}
                  </label>
                );
              })}
            </div>
          )}
          {errors.serviceCities && <p className="mt-1.5 text-xs font-medium text-red-600">{typeof errors.serviceCities === "string" ? errors.serviceCities : "Check the cities"}</p>}
        </fieldset>
      </FormSection>

      <FormSection title="Skills & daily rates" description="What you charge per worker per day. Customers see the estimate before they send a request.">
        <ul className="space-y-3">
          {form.rates.map((rate) => (
            <li key={rate.key} className="flex items-center gap-2">
              <select
                value={rate.profession}
                onChange={(e) => updateRate(rate.key, "profession", e.target.value)}
                aria-label="Skill"
                className={cn(inputClassName, "flex-1")}
              >
                {PROFESSIONS.map((p) => (
                  <option key={p.value} value={p.value} disabled={p.value !== rate.profession && usedSkills.has(p.value)}>
                    {p.label}
                  </option>
                ))}
              </select>
              <label className="flex w-40 shrink-0 items-center gap-1.5 text-sm text-neutral-500">
                ₹
                <input
                  type="number"
                  min="100"
                  inputMode="numeric"
                  value={rate.dailyRate}
                  onChange={(e) => updateRate(rate.key, "dailyRate", e.target.value)}
                  placeholder="700"
                  aria-label="Daily rate per worker"
                  className={inputClassName}
                />
                <span className="whitespace-nowrap text-xs">/day</span>
              </label>
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, rates: f.rates.filter((r) => r.key !== rate.key) }))}
                disabled={form.rates.length === 1}
                aria-label="Remove skill"
                className="flex size-9 shrink-0 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-red-600 disabled:opacity-30"
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
        {errors.rates && <p className="text-xs font-medium text-red-600">{typeof errors.rates === "string" ? errors.rates : "Check the skills and rates"}</p>}
        {form.rates.length < 8 && usedSkills.size < PROFESSIONS.length && (
          <button
            type="button"
            onClick={() =>
              setForm((f) => ({
                ...f,
                rates: [...f.rates, { key: crypto.randomUUID(), profession: PROFESSIONS.find((p) => !usedSkills.has(p.value)).value, dailyRate: "" }],
              }))
            }
            className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-brand-700 hover:bg-brand-50"
          >
            <Plus className="size-4" />
            Add a skill
          </button>
        )}
      </FormSection>

      <div className="flex justify-end">
        <button type="submit" disabled={saving} className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-700 px-6 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-60">
          {saving && <Loader2 className="size-4 animate-spin" />}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
