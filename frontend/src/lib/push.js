import api from "../services/api";

// Browser side of Web Push: lets a professional get a phone/computer notification for each new booking
// request, even when Wease isn't open. The service worker that shows them is public/sw.js.

const isIos = () => /iphone|ipad|ipod/i.test(navigator.userAgent);

// "ok" | "blocked" (the person said no in the browser) | "ios-install" (iPhone/iPad: only works once
// Wease is added to the Home Screen) | "unsupported"
export function pushSupport() {
  const supported = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
  if (!supported) return isIos() ? "ios-install" : "unsupported";
  return Notification.permission === "denied" ? "blocked" : "ok";
}

export async function getPushSubscription() {
  if (pushSupport() !== "ok") return null;
  const registration = await navigator.serviceWorker.getRegistration();
  return registration ? registration.pushManager.getSubscription() : null;
}

// Must be called from a tap or click: browsers only show the permission prompt then.
export async function enablePush() {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error(
      permission === "denied"
        ? "Notifications are blocked for Wease. Allow them in your browser's site settings, then try again."
        : "Notifications weren't turned on."
    );
  }
  const registration = await navigator.serviceWorker.register("/sw.js");
  await navigator.serviceWorker.ready;
  const { data } = await api.get("/push/public-key");
  const serverKey = base64UrlToBytes(data.publicKey);

  let subscription = await registration.pushManager.getSubscription();
  if (subscription && !sameKey(subscription.options.applicationServerKey, serverKey)) {
    await subscription.unsubscribe(); // made for another server key, e.g. after a database reset
    subscription = null;
  }
  subscription ??= await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: serverKey });
  await api.post("/push/subscriptions", subscription.toJSON());
  return subscription;
}

// Stops notifications on this device. Pass the login token when calling during logout, because the
// stored one is cleared straight away.
export async function disablePush(token) {
  const subscription = await getPushSubscription().catch(() => null);
  if (!subscription) return;
  await api
    .delete("/push/subscriptions", {
      data: { endpoint: subscription.endpoint },
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
    .catch(() => {});
  await subscription.unsubscribe().catch(() => {});
}

function base64UrlToBytes(value) {
  const base64 = (value + "=".repeat((4 - (value.length % 4)) % 4)).replace(/-/g, "+").replace(/_/g, "/");
  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
}

function sameKey(current, wanted) {
  if (!current) return false;
  const a = new Uint8Array(current);
  return a.length === wanted.length && a.every((byte, i) => byte === wanted[i]);
}
