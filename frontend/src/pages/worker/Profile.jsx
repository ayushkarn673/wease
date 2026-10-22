import { useState } from "react";
import { useAsync } from "../../hooks/useAsync";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ExternalLink, Loader2 } from "lucide-react";
import { getUserProfile, updateUserProfile } from "../../services/userService";
import { getWorkerProfile, updateWorkerProfile } from "../../services/workerService";
import { useAuth } from "../../context/AuthContext";
import { PROFESSIONS, getErrorMessage, professionLabel } from "@/lib/format";
import { inputClassName, textareaClassName } from "@/lib/styles";
import PageHeader from "../../components/shared/PageHeader";
import UserAvatar from "../../components/shared/UserAvatar";
import { FormField, FormSection } from "../../components/shared/FormField";
import { EmptyState, ErrorState, Skeleton } from "../../components/shared/States";

async function loadProfiles() {
  const [user, worker] = await Promise.all([getUserProfile(), getWorkerProfile()]);
  return { user, worker };
}

export default function WorkerProfile() {
  const { status: loadStatus, data, error, reload } = useAsync(loadProfiles);
  const status = loadStatus === "error" && error?.response?.status === 404 ? "noprofile" : loadStatus;

  if (status === "noprofile") {
    return (
      <EmptyState
        title="You haven't set up your professional profile"
        description="Add your service, experience and rates so customers can book you."
        action={
          <Link to="/complete-worker-profile" className="inline-flex h-10 items-center rounded-full bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700">
            Set up profile
          </Link>
        }
        className="py-16"
      />
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        title="My profile"
        description="This is what customers see when they find you."
        actions={
          data?.worker?.id && (
            <Link
              to={`/workers/${data.worker.id}`}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              <ExternalLink className="size-4" />
              View public profile
            </Link>
          )
        }
      />

      {status === "loading" && (
        <div className="space-y-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-96" />
        </div>
      )}
      {status === "error" && <ErrorState message="We couldn't load your profile." onRetry={reload} />}
      {status === "ready" && <WorkerProfileForm user={data.user} worker={data.worker} />}
    </div>
  );
}

function WorkerProfileForm({ user, worker }) {
  const { login } = useAuth();
  const [form, setForm] = useState({
    fullName: user.fullName || "",
    email: user.email || "",
    phone: user.phone || "",
    profession: worker.profession || "",
    experience: worker.experience ?? "",
    bio: worker.bio || "",
    address: worker.address || "",
    // Not editable here, but sent back so saving doesn't erase stored coordinates.
    latitude: worker.latitude ?? "",
    longitude: worker.longitude ?? "",
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function validate() {
    const next = {};
    if (!form.fullName.trim()) next.fullName = "Full name is required";
    if (!form.phone.trim()) next.phone = "Phone number is required so customers can reach you";
    else if (form.phone.trim().length > 15) next.phone = "Phone number must be at most 15 characters";
    if (!form.profession) next.profession = "Choose your main service";
    if (form.experience === "" || Number(form.experience) < 0) next.experience = "Enter your years of experience";
    if (!form.address.trim()) next.address = "Enter the area you serve";
    if (!form.bio.trim()) next.bio = "Tell customers about your work";
    else if (form.bio.length > 1000) next.bio = "Keep it under 1,000 characters";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const updatedUser = await updateUserProfile({ fullName: form.fullName.trim(), phone: form.phone.trim() });
      await updateWorkerProfile({
        profession: form.profession,
        experience: Number(form.experience),
        bio: form.bio.trim(),
        address: form.address.trim(),
        latitude: form.latitude !== "" ? Number(form.latitude) : null,
        longitude: form.longitude !== "" ? Number(form.longitude) : null,
      });

      // Keep the header name in sync with the saved profile.
      const saved = JSON.parse(localStorage.getItem("user") || "{}");
      login({ ...saved, fullName: updatedUser.fullName, token: localStorage.getItem("token") });

      toast.success("Profile updated");
    } catch (err) {
      toast.error("Couldn't save your profile", { description: getErrorMessage(err) });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <FormSection title="Personal information" description="Your contact details for customers you work with.">
        <div className="flex items-center gap-4">
          <UserAvatar name={form.fullName} size="lg" />
          <div>
            <p className="font-medium text-neutral-900">{form.fullName || "Your name"}</p>
            <p className="text-sm text-neutral-500">{professionLabel(form.profession) || "Professional"}</p>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Full name" error={errors.fullName}>
            <input name="fullName" value={form.fullName} onChange={handleChange} autoComplete="name" className={inputClassName} />
          </FormField>
          <FormField label="Phone number" error={errors.phone}>
            <input name="phone" type="tel" value={form.phone} onChange={handleChange} autoComplete="tel" className={inputClassName} />
          </FormField>
        </div>
        <FormField label="Email" hint="Email can't be changed.">
          <input value={form.email} disabled className={inputClassName} />
        </FormField>
      </FormSection>

      <FormSection title="Professional details" description="Help customers decide if you're the right fit.">
        <div className="grid gap-5 sm:grid-cols-3">
          <FormField label="Main service" error={errors.profession}>
            <select name="profession" value={form.profession} onChange={handleChange} className={inputClassName}>
              <option value="">Select…</option>
              {PROFESSIONS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Experience (years)" error={errors.experience}>
            <input name="experience" type="number" min="0" max="60" value={form.experience} onChange={handleChange} className={inputClassName} />
          </FormField>
        </div>
        <FormField label="Service area" error={errors.address} hint="City or locality where you take jobs.">
          <input name="address" value={form.address} onChange={handleChange} placeholder="e.g. Kothrud, Pune" className={inputClassName} />
        </FormField>
        <FormField label="About you" error={errors.bio} hint={`${form.bio.length}/1000 characters`}>
          <textarea
            name="bio"
            rows={5}
            maxLength={1000}
            value={form.bio}
            onChange={handleChange}
            placeholder="Your specialities, certifications, and the kind of jobs you do best."
            className={textareaClassName}
          />
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
