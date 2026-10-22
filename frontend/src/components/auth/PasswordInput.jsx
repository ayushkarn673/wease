import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import AuthInput from "./AuthInput";

export default function PasswordInput({ label = "Password", error, ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <AuthInput
      label={label}
      type={visible ? "text" : "password"}
      Icon={Lock}
      error={error}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="rounded-lg p-2 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-600"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      }
      {...props}
    />
  );
}
