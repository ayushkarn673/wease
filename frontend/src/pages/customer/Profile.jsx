import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { getUserProfile, updateUserProfile } from "../../services/userService";
import { useAuth } from "../../context/AuthContext";
import { useAsync } from "../../hooks/useAsync";
import { displayEmail, getErrorMessage } from "@/lib/format";
import { inputClassName } from "@/lib/styles";
import PageHeader from "../../components/shared/PageHeader";
import UserAvatar from "../../components/shared/UserAvatar";
import { FormField, FormSection } from "../../components/shared/FormField";
import { ErrorState, Skeleton } from "../../components/shared/States";

export default function CustomerProfile() {
  const { status, data, reload } = useAsync(getUserProfile);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader title="Profile settings" description="Manage the details professionals see when you book." />
      {status === "loading" && <Skeleton className="h-80" />}
      {status === "error" && <ErrorState message="We couldn't load your profile." onRetry={reload} />}
      {status === "ready" && <ProfileForm initial={data} />}
    </div>
  );
}

function ProfileForm({ initial }) {
  const { login } = useAuth();
  const [form, setForm] = useState({
    fullName: initial.fullName || "",
    email: displayEmail(initial.email) ?? "Not added — you log in with your phone",
    phone: initial.phone || "",
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const next = {};
    if (!form.fullName.trim()) next.fullName = "Full name is required";
    if (!form.phone.trim()) next.phone = "Phone number is required";
    else if (form.phone.trim().length > 15) next.phone = "Phone number must be at most 15 characters";
    setErrors(next);
    if (Object.keys(next).length) return;

    setSaving(true);
    try {
      const updated = await updateUserProfile({ fullName: form.fullName.trim(), phone: form.phone.trim() });

      // Keep the header name in sync with the saved profile.
      const saved = JSON.parse(localStorage.getItem("user") || "{}");
      login({ ...saved, fullName: updated.fullName, token: localStorage.getItem("token") });

      toast.success("Profile updated");
    } catch (err) {
      toast.error("Couldn't save your profile", { description: getErrorMessage(err) });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <FormSection title="Personal information" description="Your name and phone number are shared with professionals you book.">
        <div className="flex items-center gap-4">
          <UserAvatar name={form.fullName} size="lg" />
          <div>
            <p className="font-medium text-neutral-900">{form.fullName || "Your name"}</p>
            <p className="text-sm text-neutral-500">Customer account</p>
          </div>
        </div>
        <FormField label="Full name" error={errors.fullName}>
          <input name="fullName" value={form.fullName} onChange={handleChange} autoComplete="name" className={inputClassName} />
        </FormField>
        <FormField label="Phone number" error={errors.phone} hint="Used by professionals to coordinate the visit.">
          <input
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            autoComplete="tel"
            placeholder="e.g. 98765 43210"
            className={inputClassName}
          />
        </FormField>
        <FormField label="Email" hint="Email can't be changed.">
          <input value={form.email} disabled className={inputClassName} />
        </FormField>
      </FormSection>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-600 px-6 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
        >
          {saving && <Loader2 className="size-4 animate-spin" />}
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
