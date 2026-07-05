import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, CheckCircle2 } from "lucide-react";
import AuthLayout from "../../layouts/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import { Button } from "@/components/ui/Button";

export default function VerifyEmail() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (value, index) => {
    if (isNaN(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next field
    if (value !== "" && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && code[index] === "" && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const otp = code.join("");
    if (otp.length < 6) {
      setError("Please enter the full 6-digit verification code");
      return;
    }

    setError("");
    setVerified(true);
  };

  return (
    <AuthLayout>
      <AuthCard>
        {!verified ? (
          <>
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Verify your email
              </h2>
              <p className="mt-2 text-sm font-semibold text-slate-550 dark:text-slate-455 leading-relaxed">
                We've sent a 6-digit verification code to your email. Enter it below to activate your account.
              </p>
            </div>

            {/* OTP Form */}
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="flex gap-2 justify-between">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInputChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-12 h-14 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950/30 text-center font-extrabold text-xl focus-visible:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white transition-all"
                  />
                ))}
              </div>

              {error && (
                <p className="text-xs text-red-500 font-semibold mt-1">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-transform"
              >
                Verify & Activate
              </Button>
            </form>

            <div className="text-center mt-6">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-455">
                Didn't receive code?{" "}
                <button
                  type="button"
                  onClick={() => setCode(["", "", "", "", "", ""])}
                  className="text-blue-650 dark:text-blue-400 hover:underline font-bold"
                >
                  Resend Code
                </button>
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md shadow-green-500/10">
              <CheckCircle2 size={28} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Account activated!
            </h2>
            <p className="mt-3 text-sm font-semibold text-slate-500 dark:text-slate-455 leading-relaxed">
              Your email has been successfully verified. Welcome to Wease.
            </p>
            <Button
              onClick={() => navigate("/customer/dashboard")}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold mt-8"
            >
              Go to Dashboard
            </Button>
          </div>
        )}
      </AuthCard>
    </AuthLayout>
  );
}
