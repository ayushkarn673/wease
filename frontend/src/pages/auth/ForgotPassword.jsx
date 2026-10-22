import { useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, ArrowLeft, KeyRound, Loader2, Mail, MailCheck } from "lucide-react";
import AuthLayout from "../../layouts/AuthLayout";
import AuthInput from "../../components/auth/AuthInput";
import { forgotPassword } from "../../services/authService";
import { getErrorMessage } from "@/lib/format";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Enter a valid email address");
      return;
    }
    setError("");
    setSending(true);
    try {
      await forgotPassword(email.trim());
      setSent(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <AuthLayout>
        <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
          <MailCheck className="size-6" />
        </span>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">Check your email</h1>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600">
          If an account exists for <span className="font-semibold text-neutral-900">{email.trim()}</span>, we've sent a
          link to reset your password. It expires in 30 minutes.
        </p>
        <p className="mt-3 text-sm text-neutral-500">Didn't get it? Check your spam folder or try again in a minute.</p>
        <Link
          to="/login"
          className="mt-8 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-neutral-200 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
        >
          <ArrowLeft className="size-4" />
          Back to log in
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
        <KeyRound className="size-6" />
      </span>
      <h1 className="mt-6 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">Forgot your password?</h1>
      <p className="mt-2 text-sm text-neutral-500">Enter your account email and we'll send you a reset link.</p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
        {error && (
          <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            {error}
          </div>
        )}
        <AuthInput
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          Icon={Mail}
        />
        <button
          type="submit"
          disabled={sending}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-brand-600 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-60"
        >
          {sending && <Loader2 className="size-4 animate-spin" />}
          {sending ? "Sending…" : "Send reset link"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-neutral-500">
        Remembered it?{" "}
        <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">Log in</Link>
      </p>
    </AuthLayout>
  );
}
