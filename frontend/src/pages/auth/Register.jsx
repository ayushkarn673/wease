import { useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { AlertCircle, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { pathAfterAuth } from "@/lib/format";
import AuthLayout from "../../layouts/AuthLayout";
import RoleSelector from "../../components/auth/RoleSelector";
import GoogleSignInButton from "../../components/auth/GoogleSignInButton";
import PhoneOtpForm from "../../components/auth/PhoneOtpForm";

// New accounts are created only with Google or a verified phone number.
export default function Register() {
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState(() => {
    const requested = searchParams.get("role");
    return requested === "worker" || requested === "firm" ? requested : "customer";
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  function finish(response) {
    login(response);
    navigate(pathAfterAuth(response, location.state?.from), { replace: true });
  }

  return (
    <AuthLayout>
      <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">Create your account</h1>
      <p className="mt-2 text-sm text-neutral-500">It only takes a minute.</p>

      <div className="mt-8 space-y-5">
        <RoleSelector value={role} onChange={setRole} />

        {error && (
          <div role="alert" className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            {error}
          </div>
        )}

        <GoogleSignInButton text="signup_with" role={role.toUpperCase()} onAuthenticated={finish} onError={setError} />

        <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-wide text-neutral-400">
          <span className="h-px flex-1 bg-neutral-200" />
          or with your phone
          <span className="h-px flex-1 bg-neutral-200" />
        </div>

        <PhoneOtpForm key={role} mode="signup" role={role.toUpperCase()} onAuthenticated={finish} />

        <p className="flex items-start gap-2 rounded-lg bg-neutral-50 p-3 text-xs leading-relaxed text-neutral-500">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-brand-600" />
          Every new account is verified with Google or a one-time code sent to your phone.
        </p>
      </div>

      <p className="mt-8 text-center text-sm text-neutral-500">
        Already have an account?{" "}
        <Link to="/login" state={location.state} className="font-semibold text-brand-600 hover:text-brand-700">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
