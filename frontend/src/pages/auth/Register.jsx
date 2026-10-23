import { useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { AlertCircle, ArrowLeft, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { pathAfterAuth } from "@/lib/format";
import { ACCOUNT_TYPES } from "@/lib/accountTypes";
import AuthLayout from "../../layouts/AuthLayout";
import AccountTypeChooser from "../../components/auth/AccountTypeChooser";
import GoogleSignInButton from "../../components/auth/GoogleSignInButton";
import PhoneOtpForm from "../../components/auth/PhoneOtpForm";
import EmailSignupForm from "../../components/auth/EmailSignupForm";

// Step 1: choose how you'll use Wease (customer, professional or labour firm).
// Step 2: create the login with Google, a phone code, or email + password.
// The choice lives in ?role=, so links like /register?role=worker open step 2 directly and Back works.
export default function Register() {
  const [searchParams, setSearchParams] = useSearchParams();
  const accountKey = searchParams.get("role");
  const account = ACCOUNT_TYPES[accountKey];
  const location = useLocation();

  const choose = (key) => setSearchParams({ role: key }, { state: location.state });
  const changeType = () => setSearchParams({}, { state: location.state });

  return (
    <AuthLayout accountType={account ? accountKey : "customer"}>
      {account ? (
        <SignupStep key={accountKey} accountKey={accountKey} account={account} onChangeType={changeType} />
      ) : (
        <>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">Join Wease</h1>
          <p className="mt-2 text-sm text-neutral-500">How do you want to use Wease?</p>
          <div className="mt-8">
            <AccountTypeChooser onChoose={choose} />
          </div>
        </>
      )}

      <p className="mt-8 text-center text-sm text-neutral-500">
        Already have an account?{" "}
        <Link to="/login" state={location.state} className="font-semibold text-brand-600 hover:text-brand-700">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}

function SignupStep({ accountKey, account, onChangeType }) {
  const [error, setError] = useState("");
  const [useEmail, setUseEmail] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { icon: Icon, short, title, subtitle, next, role } = account;

  function finish(response) {
    login(response);
    navigate(pathAfterAuth(response, location.state?.from), { replace: true });
  }

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onChangeType}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-500 hover:text-neutral-800"
        >
          <ArrowLeft className="size-4" />
          Change account type
        </button>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-800">
          <Icon className="size-3.5" />
          {short}
        </span>
      </div>

      <h1 className="mt-6 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">{title}</h1>
      <p className="mt-2 text-sm text-neutral-500">{subtitle}</p>

      {next && (
        <ol className="mt-5 grid grid-cols-2 gap-2 text-xs font-medium">
          <li className="flex items-center gap-2 rounded-lg bg-brand-50 px-3 py-2 text-brand-900">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-700 text-[11px] font-bold text-white">1</span>
            Create your login
          </li>
          <li className="flex items-center gap-2 rounded-lg bg-neutral-50 px-3 py-2 text-neutral-500">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-[11px] font-bold text-neutral-600">2</span>
            Set up your {accountKey === "firm" ? "firm" : "profile"}
          </li>
        </ol>
      )}

      <div className="mt-6 space-y-5">
        {error && (
          <div role="alert" className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            {error}
          </div>
        )}

        <GoogleSignInButton text="signup_with" role={role} onAuthenticated={finish} onError={setError} />

        <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-wide text-neutral-400">
          <span className="h-px flex-1 bg-neutral-200" />
          {useEmail ? "or with email" : "or with your phone"}
          <span className="h-px flex-1 bg-neutral-200" />
        </div>

        {useEmail ? (
          <EmailSignupForm role={role} onAuthenticated={finish} />
        ) : (
          <PhoneOtpForm mode="signup" role={role} onAuthenticated={finish} />
        )}

        <button
          type="button"
          onClick={() => setUseEmail((v) => !v)}
          className="block w-full text-center text-sm font-semibold text-brand-700 hover:text-brand-800"
        >
          {useEmail ? "Sign up with your phone number instead" : "Sign up with email and password"}
        </button>

        <p className="flex items-start gap-2 rounded-lg bg-neutral-50 p-3 text-xs leading-relaxed text-neutral-500">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-brand-600" />
          {next
            ? `After this, you'll add ${next}.`
            : useEmail
              ? "We'll email you a link to confirm your address. You can use Wease straight away."
              : "We'll send a one-time code to your phone to confirm it's yours."}
        </p>
      </div>
    </>
  );
}
