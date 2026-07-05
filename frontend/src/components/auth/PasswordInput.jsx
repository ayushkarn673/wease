import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import AuthInput from "./AuthInput";

export default function PasswordInput({ label = "Password", error, ...props }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full flex flex-col items-start">
      <div className="relative w-full">
        <AuthInput
          label={label}
          type={showPassword ? "text" : "password"}
          Icon={Lock}
          error={error}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-[42px] text-slate-400 hover:text-slate-600 dark:text-slate-500 transition-colors"
          title={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}
