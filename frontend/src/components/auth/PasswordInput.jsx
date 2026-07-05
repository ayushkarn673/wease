import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import AuthInput from "./AuthInput";

export default function PasswordInput({ label = "Password", ...props }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full">
      <AuthInput
        label={label}
        type={showPassword ? "text" : "password"}
        Icon={Lock}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-4 bottom-3 text-slate-400 hover:text-slate-655 dark:text-slate-500 transition-colors"
        title={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}
