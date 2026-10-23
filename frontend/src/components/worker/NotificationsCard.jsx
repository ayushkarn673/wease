import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BellOff, BellRing, Loader2 } from "lucide-react";
import { disablePush, enablePush, getPushSubscription, pushSupport } from "@/lib/push";

const HINT = {
  blocked: "Notifications are blocked for Wease. Allow them in your browser's site settings for this site, then reload.",
  "ios-install": "On iPhone: tap Share, then “Add to Home Screen”. Open Wease from your Home Screen and turn notifications on there.",
  unsupported: "This browser can't show notifications. Use Chrome on Android or a computer browser.",
};

// Lets a professional turn on phone/computer notifications for new booking requests on this device.
export default function NotificationsCard() {
  const [support] = useState(pushSupport);
  const [state, setState] = useState(support === "ok" ? "checking" : "unavailable");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (support !== "ok") return;
    getPushSubscription()
      .then((subscription) => setState(subscription && Notification.permission === "granted" ? "on" : "off"))
      .catch(() => setState("off"));
  }, [support]);

  async function turnOn() {
    setBusy(true);
    try {
      await enablePush();
      setState("on");
      toast.success("Notifications are on", { description: "You'll be notified of new booking requests on this device." });
    } catch (err) {
      toast.error("Couldn't turn on notifications", { description: err?.message });
    } finally {
      setBusy(false);
    }
  }

  async function turnOff() {
    setBusy(true);
    await disablePush();
    setState("off");
    setBusy(false);
  }

  if (state === "checking") return null;
  const on = state === "on";

  return (
    <div className={`flex flex-col gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center ${on ? "border-emerald-200 bg-emerald-50/60" : "border-amber-200 bg-amber-50/70"}`}>
      <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${on ? "bg-emerald-600 text-white" : "bg-amber-500 text-white"}`}>
        {on ? <BellRing className="size-5" /> : <BellOff className="size-5" />}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-neutral-900">{on ? "Notifications are on" : "Get notified of new requests"}</p>
        <p className="mt-0.5 text-sm text-neutral-600">
          {on
            ? "This device gets a notification as soon as a customer books you, even when Wease is closed."
            : support === "ok"
              ? "Get a notification on this phone as soon as a customer books you, even when Wease is closed."
              : HINT[support]}
        </p>
      </div>
      {support === "ok" && (
        <button
          type="button"
          onClick={on ? turnOff : turnOn}
          disabled={busy}
          className={
            on
              ? "inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold text-neutral-600 hover:bg-white disabled:opacity-60"
              : "inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-brand-700 px-5 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-60"
          }
        >
          {busy && <Loader2 className="size-4 animate-spin" />}
          {on ? "Turn off" : "Turn on notifications"}
        </button>
      )}
    </div>
  );
}
