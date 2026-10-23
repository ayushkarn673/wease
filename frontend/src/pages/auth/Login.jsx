import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, ChevronRight, Loader2, Mail } from "lucide-react";
import { login as authLogin } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage, pathAfterAuth } from "@/lib/format";
import { ACCOUNT_TYPES, ACCOUNT_TYPE_KEYS } from "@/lib/accountTypes";
import AuthLayout from "../../layouts/AuthLayout";
import AuthInput from "../../components/auth/AuthInput";
import PasswordInput from "../../components/auth/PasswordInput";
import GoogleSignInButton from "../../components/auth/GoogleSignInButton";
import PhoneOtpForm from "../../components/auth/PhoneOtpForm";

// Log in with Google, a phone code, or (for accounts that have one) email + password.
export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [usePassword, setUsePassword] = useState(false);
  const [error, setError] = useState("");

  // Where the visitor was before being asked to log in (e.g. a professional they wanted to book).
  const from = location.state?.from;

  function finish(response) {
    login(response);
    navigate(pathAfterAuth(response, from), { replace: true });
  }

  return (
    <AuthLayout>
      <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">Welcome back</h1>
      <p className="mt-2 text-sm text-neutral-500">{from ? "Log in to continue booking." : "Log in to manage your bookings."}</p>

      <div className="mt-8 space-y-5">
        {error && (
          <div role="alert" className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            {error}
          </div>
        )}

        <GoogleSignInButton onAuthenticated={finish} onError={setError} />

        <Divider>{usePassword ? "or with email" : "or with your phone"}</Divider>

        {usePassword ? <PasswordLogin onAuthenticated={finish} /> : <PhoneOtpForm mode="login" onAuthenticated={finish} />}

        <button
          type="button"
          onClick={() => setUsePassword((v) => !v)}
          className="block w-full text-center text-sm font-semibold text-brand-700 hover:text-brand-800"
        >
          {usePassword ? "Use your phone number instead" : "Log in with email and password"}
        </button>
      </div>

      <div className="mt-10 border-t border-neutral-100 pt-6">
        <p className="text-center text-sm font-semibold text-neutral-900">New to Wease? Join as a…</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {ACCOUNT_TYPE_KEYS.map((key) => {
            const { icon: Icon, short } = ACCOUNT_TYPES[key];
            return (
              <Link
                key={key}
                to={`/register?role=${key}`}
                state={location.state}
                className="group flex items-center gap-2.5 rounded-xl border border-neutral-200 px-3 py-2.5 text-sm font-semibold text-neutral-800 transition hover:border-brand-500 hover:bg-brand-50/60 sm:flex-col sm:gap-1.5 sm:py-3 sm:text-center"
              >
                <Icon className="size-5 shrink-0 text-brand-700" />
                <span className="flex-1">{short}</span>
                <ChevronRight className="size-4 text-neutral-300 group-hover:text-brand-700 sm:hidden" />
              </Link>
            );
          })}
        </div>
      </div>
    </AuthLayout>
  );
}

function Divider({ children }) {
  return (
    <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-wide text-neutral-400">
      <span className="h-px flex-1 bg-neutral-200" />
      {children}
      <span className="h-px flex-1 bg-neutral-200" />
    </div>
  );
}

function PasswordLogin({ onAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    const next = {};
    if (!email) next.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) next.email = "Enter a valid email address";
    if (!password) next.password = "Password is required";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      onAuthenticated(await authLogin({ email: email.trim(), password }));
    } catch (error) {
      setErrors({ server: getErrorMessage(error, "Invalid email or password.") });
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleLogin} noValidate className="space-y-4">
      {errors.server && (
        <div role="alert" className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {errors.server}
        </div>
      )}
      <AuthInput label="Email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} Icon={Mail} error={errors.email} />
      <div>
        <PasswordInput label="Password" autoComplete="current-password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
        <div className="mt-2 text-right">
          <Link to="/forgot-password" className="text-sm font-medium text-brand-600 hover:text-brand-700">
            Forgot password?
          </Link>
        </div>
      </div>
      <button type="submit" disabled={loading} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-brand-700 text-sm font-semibold text-white transition hover:bg-brand-800 disabled:opacity-60">
        {loading && <Loader2 className="size-4 animate-spin" />}
        {loading ? "Logging in…" : "Log in"}
      </button>
    </form>
  );
}
