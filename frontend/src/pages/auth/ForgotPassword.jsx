import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, Send } from "lucide-react";
import AuthLayout from "../../layouts/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import AuthInput from "../../components/auth/AuthInput";
import { Button } from "@/components/ui/Button";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleReset = (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email is required");
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setSubmitted(true);
  };

  return (
    <AuthLayout>
      <AuthCard>
        {/* Back Link */}
        <button
          onClick={() => navigate("/login")}
          className="inline-flex items-center gap-1 text-sm font-semibold text-slate-550 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-6 transition"
        >
          <ArrowLeft size={16} />
          Back to Sign In
        </button>

        {!submitted ? (
          <>
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Forgot password?
              </h2>
              <p className="mt-2 text-sm font-semibold text-slate-550 dark:text-slate-455">
                No worries! Enter your email and we'll send you link instructions to reset it.
              </p>
            </div>

            {/* Email form */}
            <form onSubmit={handleReset} className="space-y-6">
              <AuthInput
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                Icon={Mail}
                error={error}
              />

              <Button
                type="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-transform"
              >
                Send Reset Link
                <Send size={16} />
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md shadow-green-500/10">
              <Send size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Check your email
            </h2>
            <p className="mt-3 text-sm font-semibold text-slate-500 dark:text-slate-455 leading-relaxed">
              We have sent a reset password link to <span className="text-slate-800 dark:text-slate-205 font-bold">{email}</span>. Please click the link inside to set a new password.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-8 text-sm font-bold text-blue-650 dark:text-blue-400 hover:underline"
            >
              Resend email link
            </button>
          </div>
        )}
      </AuthCard>
    </AuthLayout>
  );
}
