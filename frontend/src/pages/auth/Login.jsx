import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, Loader2, Mail } from "lucide-react";
import { login as authLogin } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage, homePathFor } from "@/lib/format";
import AuthLayout from "../../layouts/AuthLayout";
import AuthInput from "../../components/auth/AuthInput";
import PasswordInput from "../../components/auth/PasswordInput";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Where the visitor was before being asked to log in (e.g. a worker they wanted to book).
  const from = location.state?.from;

  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Enter a valid email address";
    if (!password) newErrors.password = "Password is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      const response = await authLogin({ email: email.trim(), password });
      login(response);
      const canReturn = from && response.role === "CUSTOMER";
      navigate(canReturn ? from : homePathFor(response.role), { replace: true });
    } catch (error) {
      setErrors({ server: getErrorMessage(error, "Invalid email or password.") });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">Welcome back</h1>
      <p className="mt-2 text-sm text-neutral-500">
        {from ? "Log in to continue booking." : "Log in to manage your bookings."}
      </p>

      <form onSubmit={handleLogin} noValidate className="mt-8 space-y-5">
        {errors.server && (
          <div role="alert" className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            {errors.server}
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
          error={errors.email}
        />

        <div>
          <PasswordInput
            label="Password"
            autoComplete="current-password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />
          <div className="mt-2 text-right">
            <Link to="/forgot-password" className="text-sm font-medium text-brand-600 hover:text-brand-700">
              Forgot password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-brand-600 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
        >
          {loading && <Loader2 className="size-4 animate-spin" />}
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-neutral-500">
        New to Wease?{" "}
        <Link to="/register" state={location.state} className="font-semibold text-brand-600 hover:text-brand-700">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
