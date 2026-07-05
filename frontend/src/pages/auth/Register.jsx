import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, ArrowRight } from "lucide-react";
import AuthLayout from "../../layouts/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import AuthInput from "../../components/auth/AuthInput";
import PasswordInput from "../../components/auth/PasswordInput";
import RoleSelector from "../../components/auth/RoleSelector";
import GoogleButton from "../../components/auth/GoogleButton";
import AuthDivider from "../../components/auth/AuthDivider";
import { Button } from "@/components/ui/Button";

export default function Register() {
  const [role, setRole] = useState("customer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!name) {
      newErrors.name = "Full name is required";
    }

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    // Success routing flow:
    if (role === "worker") {
      navigate("/complete-worker-profile");
    } else {
      navigate("/verify-email");
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Create account
          </h2>
          <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-455">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        {/* Role Selection */}
        <div className="mb-6">
          <RoleSelector value={role} onChange={setRole} />
        </div>

        <GoogleButton onClick={() => navigate("/verify-email")} label="Continue with Google" />

        <AuthDivider />

        <form onSubmit={handleRegister} className="space-y-4">
          <AuthInput
            label="Full Name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            Icon={User}
            error={errors.name}
          />

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

          <p className="text-[11px] text-slate-455 dark:text-slate-500 leading-relaxed font-semibold">
            By creating an account, you agree to our{" "}
            <span className="text-slate-700 dark:text-slate-450 underline cursor-pointer">Terms of Service</span> and{" "}
            <span className="text-slate-700 dark:text-slate-450 underline cursor-pointer">Privacy Policy</span>.
          </p>

          <Button
            type="submit"
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-transform pt-1"
          >
            Create Account
            <ArrowRight size={18} />
          </Button>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
