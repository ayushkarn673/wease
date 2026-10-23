import { useEffect, useState } from "react";
import { AlertCircle, ArrowLeft, Loader2, Phone, User } from "lucide-react";
import { sendOtp, verifyOtp } from "../../services/authService";
import { getErrorMessage } from "@/lib/format";
import AuthInput from "./AuthInput";

// Phone number → 6-digit code → (only for a new number) name. In "signup" mode the name is asked up
// front; in "login" mode only if the number has no account yet. `role` applies to new accounts.
export default function PhoneOtpForm({ mode = "login", role, onAuthenticated }) {
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [sentTo, setSentTo] = useState("");
  const [resendIn, setResendIn] = useState(0);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const askNameFirst = mode === "signup";

  useEffect(() => {
    if (resendIn <= 0) return undefined;
    const id = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [resendIn]);

  const digits = phone.replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, "");

  async function send(e) {
    e?.preventDefault();
    const next = {};
    if (askNameFirst && !name.trim()) next.name = "Enter your full name";
    if (!/^[6-9]\d{9}$/.test(digits)) next.phone = "Enter a valid 10-digit mobile number";
    setErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    try {
      const res = await sendOtp(digits);
      setSentTo(res.phone);
      setResendIn(res.resendInSeconds ?? 30);
      setCode("");
      setStep("code");
    } catch (err) {
      setErrors({ server: getErrorMessage(err) });
    } finally {
      setBusy(false);
    }
  }

  async function verify(e) {
    e?.preventDefault();
    if (!/^\d{6}$/.test(code)) return setErrors({ code: "Enter the 6-digit code" });
    if (step === "name" && !name.trim()) return setErrors({ name: "Enter your full name" });
    setErrors({});
    setBusy(true);
    try {
      const withName = askNameFirst || step === "name";
      onAuthenticated(await verifyOtp({ phone: digits, code, fullName: withName ? name.trim() : undefined, role }));
    } catch (err) {
      if (err?.response?.status === 404 && err.response.data?.error === "NEW_ACCOUNT") {
        setStep("name");
      } else {
        setErrors({ server: getErrorMessage(err) });
      }
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      {errors.server && (
        <div role="alert" className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {errors.server}
        </div>
      )}

      {step === "phone" && (
        <form onSubmit={send} noValidate className="space-y-4">
          {askNameFirst && (
            <AuthInput label="Full name" autoComplete="name" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} Icon={User} error={errors.name} />
          )}
          <div>
            <span className="mb-1.5 block text-sm font-medium text-neutral-700">Mobile number</span>
            <div className={`flex h-11 items-center rounded-lg border bg-white focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/10 ${errors.phone ? "border-red-300" : "border-neutral-200"}`}>
              <span className="flex h-full items-center gap-1.5 border-r border-neutral-200 px-3 text-sm font-medium text-neutral-600">
                <Phone className="size-4 text-neutral-400" />
                +91
              </span>
              <input
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                maxLength={14}
                placeholder="98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                aria-label="Mobile number"
                className="h-full min-w-0 flex-1 rounded-r-lg bg-transparent px-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
              />
            </div>
            {errors.phone && <span className="mt-1.5 block text-xs font-medium text-red-600">{errors.phone}</span>}
          </div>
          <button type="submit" disabled={busy} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-brand-700 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-60">
            {busy && <Loader2 className="size-4 animate-spin" />}
            Send code
          </button>
        </form>
      )}

      {(step === "code" || step === "name") && (
        <form onSubmit={verify} noValidate className="space-y-4">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="text-neutral-600">
              Code sent to <span className="font-semibold text-neutral-900">{sentTo}</span>
            </span>
            <button type="button" onClick={() => { setStep("phone"); setErrors({}); }} className="inline-flex items-center gap-1 font-semibold text-brand-700 hover:text-brand-800">
              <ArrowLeft className="size-3.5" />
              Change
            </button>
          </div>

          <div>
            <span className="mb-1.5 block text-sm font-medium text-neutral-700">6-digit code</span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              aria-label="6-digit code"
              autoFocus
              className={`h-12 w-full rounded-lg border bg-white px-4 text-center text-xl font-semibold tracking-[0.5em] text-neutral-900 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 ${errors.code ? "border-red-300" : "border-neutral-200"}`}
            />
            {errors.code && <span className="mt-1.5 block text-xs font-medium text-red-600">{errors.code}</span>}
          </div>

          {step === "name" && (
            <div className="rounded-xl bg-brand-50 p-3.5">
              <p className="mb-2 text-sm text-brand-900">This number is new to Wease. What&apos;s your name?</p>
              <AuthInput label="Full name" autoComplete="name" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} Icon={User} error={errors.name} />
            </div>
          )}

          <button type="submit" disabled={busy} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-brand-700 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-60">
            {busy && <Loader2 className="size-4 animate-spin" />}
            {step === "name" || askNameFirst ? "Verify & create account" : "Verify & continue"}
          </button>

          <p className="text-center text-sm text-neutral-500">
            Didn&apos;t get it?{" "}
            {resendIn > 0 ? (
              <span>Resend in {resendIn}s</span>
            ) : (
              <button type="button" onClick={send} disabled={busy} className="font-semibold text-brand-700 hover:text-brand-800">
                Resend code
              </button>
            )}
          </p>
        </form>
      )}
    </div>
  );
}
