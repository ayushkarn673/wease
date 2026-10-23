import { useState } from "react";
import { AlertCircle, Loader2, Mail, User } from "lucide-react";
import { register } from "../../services/authService";
import { getErrorMessage } from "@/lib/format";
import AuthInput from "./AuthInput";
import PasswordInput from "./PasswordInput";

// Name, email and password. `role` is the account type picked above the form.
export default function EmailSignupForm({ role, onAuthenticated }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const next = {};
    if (!name.trim()) next.name = "Enter your full name";
    if (!email.trim()) next.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email.trim())) next.email = "Enter a valid email address";
    if (!password) next.password = "Choose a password";
    else if (password.length < 6) next.password = "Use at least 6 characters";
    if (password && confirm !== password) next.confirm = "Passwords don't match";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      onAuthenticated(await register({ fullName: name.trim(), email: email.trim(), password, role }));
    } catch (error) {
      setErrors({ server: getErrorMessage(error, "Couldn't create your account. Please try again.") });
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {errors.server && (
        <div role="alert" className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {errors.server}
        </div>
      )}
      <AuthInput label="Full name" autoComplete="name" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} Icon={User} error={errors.name} />
      <AuthInput label="Email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} Icon={Mail} error={errors.email} />
      <PasswordInput label="Password" autoComplete="new-password" placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
      <PasswordInput label="Confirm password" autoComplete="new-password" placeholder="Type it again" value={confirm} onChange={(e) => setConfirm(e.target.value)} error={errors.confirm} />
      <button type="submit" disabled={loading} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-brand-700 text-sm font-semibold text-white transition hover:bg-brand-800 disabled:opacity-60">
        {loading && <Loader2 className="size-4 animate-spin" />}
        {loading ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
