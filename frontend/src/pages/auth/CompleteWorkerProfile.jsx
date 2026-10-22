import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Briefcase, CheckCircle2, Loader2, MapPin, PenTool } from "lucide-react";
import { cn } from "@/lib/utils";
import { PROFESSIONS, getErrorMessage } from "@/lib/format";
import { textareaClassName } from "@/lib/styles";
import AuthLayout from "../../layouts/AuthLayout";
import AuthInput from "../../components/auth/AuthInput";
import { createWorkerProfile } from "../../services/workerService";

export default function CompleteWorkerProfile() {
  const [step, setStep] = useState(1);
  const [profession, setProfession] = useState("");
  const [experience, setExperience] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState({ latitude: null, longitude: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Location is optional. If the browser can't provide it we store nothing rather than a guess.
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (position) => setCoords({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
      () => {}
    );
  }, []);

  const goToDetails = () => {
    const next = {};
    if (!profession) next.profession = "Choose the service you offer";
    if (experience === "" || isNaN(experience) || Number(experience) < 0 || Number(experience) > 50) {
      next.experience = "Enter your experience in years (0–50)";
    }
    setErrors(next);
    if (Object.keys(next).length === 0) setStep(2);
  };

  const submitProfile = async () => {
    const next = {};
    if (bio.trim().length < 20) next.bio = "Write at least 20 characters about your work";
    if (!skills.trim()) next.skills = "List a few key skills";
    if (!address.trim()) next.address = "Enter the area you serve";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setIsSubmitting(true);
    try {
      await createWorkerProfile({
        profession,
        experience: parseInt(experience, 10),
        bio: `${bio.trim()} | Skills: ${skills.trim()}`,
        address: address.trim(),
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
      setStep(3);
    } catch (error) {
      setErrors({ server: getErrorMessage(error, "We couldn't save your profile. Please try again.") });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-8 flex gap-2" aria-hidden="true">
        {[1, 2, 3].map((n) => (
          <span key={n} className={cn("h-1.5 flex-1 rounded-full transition-colors", step >= n ? "bg-brand-600" : "bg-neutral-200")} />
        ))}
      </div>

      {step === 1 && (
        <>
          <p className="text-sm font-medium text-brand-600">Step 1 of 2</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">What do you do?</h1>
          <p className="mt-2 text-sm text-neutral-500">Customers search by service, so choose the one you're best at.</p>

          <div className="mt-8 space-y-5">
            <div>
              <p className="mb-2 text-sm font-medium text-neutral-700">Service</p>
              <div className="grid grid-cols-2 gap-2">
                {PROFESSIONS.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setProfession(value)}
                    aria-pressed={profession === value}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition",
                      profession === value
                        ? "border-brand-600 bg-brand-50/60 text-brand-700 ring-1 ring-brand-600"
                        : "border-neutral-200 text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50"
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    {label}
                  </button>
                ))}
              </div>
              {errors.profession && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.profession}</p>}
            </div>

            <div>
              <AuthInput
                label="Experience (years)"
                inputMode="numeric"
                placeholder="5"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                Icon={Briefcase}
                error={errors.experience}
              />
            </div>

            <button
              type="button"
              onClick={goToDetails}
              className="h-11 w-full rounded-full bg-brand-600 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Continue
            </button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <p className="text-sm font-medium text-brand-600">Step 2 of 2</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">Tell customers about you</h1>
          <p className="mt-2 text-sm text-neutral-500">A clear description helps customers choose you.</p>

          <div className="mt-8 space-y-5">
            {errors.server && (
              <div role="alert" className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                {errors.server}
              </div>
            )}

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-neutral-700">About your work</span>
              <textarea
                rows={4}
                maxLength={800}
                placeholder="e.g. Licensed electrician with 6 years of experience in home wiring, fan and light installation, and switchboard repairs."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className={textareaClassName}
              />
              {errors.bio && <span className="mt-1.5 block text-xs font-medium text-red-600">{errors.bio}</span>}
            </label>

            <AuthInput
              label="Key skills"
              placeholder="e.g. Wiring, MCB fitting, Inverter installation"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              Icon={PenTool}
              error={errors.skills}
            />
            <AuthInput
              label="Service area"
              placeholder="e.g. Kothrud, Pune"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              Icon={MapPin}
              error={errors.address}
            />

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={isSubmitting}
                className="h-11 flex-1 rounded-lg border border-neutral-200 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:opacity-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={submitProfile}
                disabled={isSubmitting}
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-brand-600 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
              >
                {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                {isSubmitting ? "Saving…" : "Finish setup"}
              </button>
            </div>
          </div>
        </>
      )}

      {step === 3 && (
        <div className="text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="size-7" />
          </span>
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-neutral-900">You're all set!</h1>
          <p className="mt-2 text-sm leading-relaxed text-neutral-500">
            Your profile is live. Customers can now find you and send booking requests.
          </p>
          <button
            type="button"
            onClick={() => navigate("/worker/dashboard", { replace: true })}
            className="mt-8 h-11 w-full rounded-full bg-brand-600 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Go to dashboard
          </button>
        </div>
      )}
    </AuthLayout>
  );
}
