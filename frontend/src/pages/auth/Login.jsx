import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowRight } from "lucide-react";
import { login } from "../../services/authService";
import { saveAuth } from "../../utils/auth";
import AuthLayout from "../../layouts/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import AuthInput from "../../components/auth/AuthInput";
import PasswordInput from "../../components/auth/PasswordInput";
import GoogleButton from "../../components/auth/GoogleButton";
import AuthDivider from "../../components/auth/AuthDivider";
import { Button } from "@/components/ui/Button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await login({ email, password });

      saveAuth(response);

      console.log("Login success:", response);

      // Route by role
      const role = response.role;
      if (role === "WORKER") {
        navigate("/worker-dashboard");
      } else {
        navigate("/customer-dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      const data = error.response?.data;
      if (data?.message) {
        setErrors({ server: data.message });
      } else if (error.response?.status === 403 || error.response?.status === 401) {
        setErrors({ server: "Invalid email or password." });
      } else {
        setErrors({ server: "Unable to connect to server. Make sure the backend is running." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome back 👋
          </h2>
          <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-455">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        <GoogleButton label="Continue with Google" />

        <AuthDivider />

        <form onSubmit={handleLogin} className="space-y-4">
          {errors.server && (
            <div className="flex items-start gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
              <span className="text-red-500 mt-0.5">⚠</span>
              <p className="text-sm text-red-600 dark:text-red-400 font-semibold">{errors.server}</p>
            </div>
          )}

          <AuthInput
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            Icon={Mail}
            error={errors.email}
          />

          <PasswordInput
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />

          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-transform pt-1 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
            {!loading && <ArrowRight size={18} />}
          </Button>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
