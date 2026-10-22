import { useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Loader2, MailWarning } from "lucide-react";
import AuthLayout from "../../layouts/AuthLayout";
import { verifyEmail } from "../../services/authService";
import { useAsync } from "../../hooks/useAsync";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage, homePathFor } from "@/lib/format";

// Opened from the link in the verification email (/verify-email?token=...).
export default function VerifyEmail() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const { user, updateUser } = useAuth();

  // Tokens are single-use, so this must run once per token: both dependencies are stable.
  const loader = useCallback(async () => {
    if (!token) throw new Error("missing token");
    const result = await verifyEmail(token);
    // Clears the "verify your email" banner if this browser is signed in.
    updateUser({ emailVerified: true });
    return result;
  }, [token, updateUser]);
  const { status, error } = useAsync(loader);

  const continuePath = user ? homePathFor(user.role) : "/login";

  return (
    <AuthLayout>
      {status === "loading" && (
        <div className="flex items-center gap-3 text-neutral-600">
          <Loader2 className="size-5 animate-spin text-brand-600" />
          Confirming your email…
        </div>
      )}

      {status === "ready" && (
        <>
          <span className="flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="size-6" />
          </span>
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">Email verified</h1>
          <p className="mt-3 text-sm text-neutral-600">Thanks — your email address is confirmed.</p>
          <Link to={continuePath} className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white hover:bg-brand-700">
            {user ? "Continue" : "Log in"}
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <span className="flex size-12 items-center justify-center rounded-full bg-amber-50 text-amber-600">
            <MailWarning className="size-6" />
          </span>
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">Link not valid</h1>
          <p className="mt-3 text-sm text-neutral-600">
            {token ? getErrorMessage(error) : "This verification link is incomplete."} You can send a new link from
            the banner at the top of your dashboard.
          </p>
          <Link to={continuePath} className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white hover:bg-brand-700">
            {user ? "Go to dashboard" : "Log in"}
          </Link>
        </>
      )}
    </AuthLayout>
  );
}
