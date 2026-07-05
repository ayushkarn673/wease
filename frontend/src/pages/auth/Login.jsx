import AuthLayout from "../../layouts/AuthLayout";
import GoogleButton from "../../components/auth/GoogleButton";
import AuthDivider from "../../components/auth/AuthDivider";
import AuthInput from "../../components/auth/AuthInput";

export default function Login() {
  return (
    <AuthLayout>

      <h1 className="text-4xl font-bold text-slate-900">
        Welcome Back 👋
      </h1>

      <p className="mt-3 text-slate-500">
        Login to continue using Wease.
      </p>

      <div className="mt-8">

        <GoogleButton />

        <AuthDivider />

        <div className="space-y-5">

          <AuthInput
            label="Email"
            type="email"
            placeholder="Enter your email"
          />

          <AuthInput
            label="Password"
            type="password"
            placeholder="Enter your password"
          />

          <button
            className="
            w-full
            rounded-2xl
            bg-blue-600
            py-3
            text-white
            font-semibold
            transition
            hover:bg-blue-700"
          >
            Login
          </button>

        </div>

      </div>

    </AuthLayout>
  );
}
