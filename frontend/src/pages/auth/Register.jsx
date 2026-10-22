import { useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { AlertCircle, Loader2, Mail, User } from "lucide-react";
import { register } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "@/lib/format";
import AuthLayout from "../../layouts/AuthLayout";
import AuthInput from "../../components/auth/AuthInput";
import PasswordInput from "../../components/auth/PasswordInput";
import RoleSelector from "../../components/auth/RoleSelector";

export default function Register() {
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState(() => {
    const requested = searchParams.get("role");
    return requested === "worker" || requested === "firm" ? requested : "customer";
  });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Full name is required";
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Enter a valid email address";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Use at least 6 characters";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      const response = await register({
        fullName: name.trim(),
        email: email.trim(),
        password,
        phone: null,
        role: role.toUpperCase(),
      });
      login(response);

      if (role === "worker") {
        navigate("/complete-worker-profile", { replace: true });
      } else if (role === "firm") {
        navigate("/complete-firm-profile", { replace: true });
      } else {
        navigate(location.state?.from || "/", { replace: true });
      }
    } catch (error) {
      setErrors({ server: getErrorMessage(error, "Registration failed. Please try again.") });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">Create your account</h1>
      <p className="mt-2 text-sm text-neutral-500">It only takes a minute.</p>

      <form onSubmit={handleRegister} noValidate className="mt-8 space-y-5">
        <RoleSelector value={role} onChange={setRole} />

        {errors.server && (
          <div role="alert" className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            {errors.server}
          </div>
        )}

        <AuthInput
          label="Full name"
          autoComplete="name"
          placeholder="Your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          Icon={User}
          error={errors.name}
        />
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
        <PasswordInput
          label="Password"
          autoComplete="new-password"
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-brand-600 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
        >
          {loading && <Loader2 className="size-4 animate-spin" />}
          {loading ? "Creating account…" : role === "worker" ? "Continue to profile setup" : "Create account"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-neutral-500">
        Already have an account?{" "}
        <Link to="/login" state={location.state} className="font-semibold text-brand-600 hover:text-brand-700">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
