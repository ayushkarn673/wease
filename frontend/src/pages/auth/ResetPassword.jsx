import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AlertCircle, CheckCircle2, KeyRound, Loader2 } from "lucide-react";
import AuthLayout from "../../layouts/AuthLayout";
import PasswordInput from "../../components/auth/PasswordInput";
import { resetPassword } from "../../services/authService";
import { getErrorMessage } from "@/lib/format";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const next = {};
    if (password.length < 6) next.password = "Use at least 6 characters";
    if (confirm !== password) next.confirm = "Passwords don't match";
    setErrors(next);
    if (Object.keys(next).length) return;

    setSaving(true);
    try {
      await resetPassword(token, password);
      setDone(true);
    } catch (err) {
      setErrors({ server: getErrorMessage(err) });
    } finally {
      setSaving(false);
    }
  }

  if (!token) {
    return (
      <AuthLayout>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">This reset link is incomplete</h1>
        <p className="mt-3 text-sm text-neutral-600">Open the link from your email again, or request a new one.</p>
        <Link to="/forgot-password" className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white hover:bg-brand-700">
          Request a new link
        </Link>
      </AuthLayout>
    );
  }

  if (done) {
    return (
      <AuthLayout>
        <span className="flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="size-6" />
        </span>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">Password updated</h1>
        <p className="mt-3 text-sm text-neutral-600">You can now log in with your new password.</p>
        <Link to="/login" className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white hover:bg-brand-700">
          Log in
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
        <KeyRound className="size-6" />
      </span>
      <h1 className="mt-6 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">Choose a new password</h1>
      <p className="mt-2 text-sm text-neutral-500">Make it at least 6 characters.</p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
        {errors.server && (
          <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span>
              {errors.server}{" "}
              <Link to="/forgot-password" className="font-semibold underline">Request a new link</Link>
            </span>
          </div>
        )}
        <PasswordInput
          label="New password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        <PasswordInput
          label="Confirm new password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          error={errors.confirm}
        />
        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-brand-600 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-60"
        >
          {saving && <Loader2 className="size-4 animate-spin" />}
          {saving ? "Saving…" : "Update password"}
        </button>
      </form>
    </AuthLayout>
  );
}
