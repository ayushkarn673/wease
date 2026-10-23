import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { googleLogin } from "../../services/authService";
import { getErrorMessage } from "@/lib/format";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
let scriptPromise = null;

// Google's own sign-in script, loaded once.
function loadGoogleScript() {
  if (window.google?.accounts?.id) return Promise.resolve();
  scriptPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = resolve;
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("Couldn't load Google sign-in"));
    };
    document.head.appendChild(script);
  });
  return scriptPromise;
}

// Google's official "Continue with Google" button. The ID token it returns is verified by our server.
// `role` is used only if this creates a new account.
export default function GoogleSignInButton({ role, text = "continue_with", onAuthenticated, onError }) {
  const container = useRef(null);
  const latest = useRef({ role, onAuthenticated, onError });
  const [status, setStatus] = useState(CLIENT_ID ? "loading" : "off");
  const [busy, setBusy] = useState(false);

  // The Google callback is created once, so read the newest props through a ref.
  useEffect(() => {
    latest.current = { role, onAuthenticated, onError };
  });

  useEffect(() => {
    if (!CLIENT_ID) return undefined;
    let cancelled = false;
    loadGoogleScript()
      .then(() => {
        if (cancelled || !container.current) return;
        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: async ({ credential }) => {
            setBusy(true);
            try {
              latest.current.onAuthenticated(await googleLogin({ credential, role: latest.current.role }));
            } catch (err) {
              latest.current.onError(getErrorMessage(err, "Google sign-in failed. Please try again."));
            } finally {
              setBusy(false);
            }
          },
        });
        window.google.accounts.id.renderButton(container.current, {
          theme: "outline",
          size: "large",
          shape: "pill",
          text,
          logo_alignment: "center",
          width: Math.min(400, Math.max(220, container.current.offsetWidth || 320)),
        });
        setStatus("ready");
      })
      .catch(() => !cancelled && setStatus("error"));
    return () => {
      cancelled = true;
    };
  }, [text]);

  if (status === "off" || status === "error") {
    return (
      <div>
        <button
          type="button"
          disabled
          className="inline-flex h-11 w-full cursor-not-allowed items-center justify-center gap-2.5 rounded-full border border-neutral-200 bg-white text-sm font-semibold text-neutral-400"
        >
          <GoogleMark />
          {text === "signup_with" ? "Sign up with Google" : "Continue with Google"}
        </button>
        <p className="mt-1.5 text-center text-xs text-neutral-400">
          {status === "off" ? "Google sign-in isn't set up yet." : "Couldn't load Google sign-in. Check your connection."}
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-11 justify-center">
      <div ref={container} className="w-full [&>div]:mx-auto" />
      {(status === "loading" || busy) && (
        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-white/80">
          <Loader2 className="size-5 animate-spin text-neutral-500" aria-label="Loading" />
        </span>
      )}
    </div>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px] opacity-50" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.2-2.1 3.5-5.1 3.5-8.7z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.1-4 1.1-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.4 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.4a12 12 0 0 0 0 10.8l4-3.1z" />
      <path fill="#EA4335" d="M12 4.8c1.7 0 3.3.6 4.5 1.8l3.4-3.4A12 12 0 0 0 1.4 6.6l4 3.1C6.3 6.9 8.9 4.8 12 4.8z" />
    </svg>
  );
}