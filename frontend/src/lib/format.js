import {
  Hammer,
  Paintbrush,
  Zap,
  Wrench,
  BrickWall,
  Sparkles,
  AirVent,
  HardHat,
} from "lucide-react";

// Single source of truth for the backend Profession enum.
// `tint` gives each service its own colour: `soft` for icon chips, `art` for illustration panels.
export const PROFESSIONS = [
  {
    value: "ELECTRICIAN",
    label: "Electrician",
    icon: Zap,
    description: "Wiring, fixtures, switchboards and repairs",
    tint: { soft: "bg-amber-100 text-amber-700", art: "from-amber-100 via-amber-50 to-yellow-100 text-amber-600" },
  },
  {
    value: "PLUMBER",
    label: "Plumber",
    icon: Wrench,
    description: "Leaks, fittings, taps and pipe work",
    tint: { soft: "bg-sky-100 text-sky-700", art: "from-sky-100 via-sky-50 to-cyan-100 text-sky-600" },
  },
  {
    value: "CARPENTER",
    label: "Carpenter",
    icon: Hammer,
    description: "Furniture, doors, fittings and woodwork",
    tint: { soft: "bg-orange-100 text-orange-700", art: "from-orange-100 via-orange-50 to-amber-100 text-orange-600" },
  },
  {
    value: "PAINTER",
    label: "Painter",
    icon: Paintbrush,
    description: "Interior, exterior and touch-up painting",
    tint: { soft: "bg-rose-100 text-rose-700", art: "from-rose-100 via-rose-50 to-pink-100 text-rose-600" },
  },
  {
    value: "CLEANER",
    label: "Cleaner",
    icon: Sparkles,
    description: "Home and office deep cleaning",
    tint: { soft: "bg-teal-100 text-teal-700", art: "from-teal-100 via-teal-50 to-emerald-100 text-teal-600" },
  },
  {
    value: "AC_TECHNICIAN",
    label: "AC Technician",
    icon: AirVent,
    description: "AC installation, servicing and repair",
    tint: { soft: "bg-cyan-100 text-cyan-700", art: "from-cyan-100 via-cyan-50 to-sky-100 text-cyan-600" },
  },
  {
    value: "MASON",
    label: "Mason",
    icon: BrickWall,
    description: "Brickwork, plastering and tiling",
    tint: { soft: "bg-stone-200 text-stone-700", art: "from-stone-200 via-stone-100 to-orange-50 text-stone-600" },
  },
  {
    value: "LABOURER",
    label: "Labourer",
    icon: HardHat,
    description: "Loading, shifting and general help",
    tint: { soft: "bg-lime-100 text-lime-700", art: "from-lime-100 via-lime-50 to-green-100 text-lime-700" },
  },
];

const PROFESSION_MAP = Object.fromEntries(PROFESSIONS.map((p) => [p.value, p]));

const DEFAULT_TINT = { soft: "bg-brand-50 text-brand-600", art: "from-brand-50 to-brand-100 text-brand-600" };

export function professionTint(value) {
  return PROFESSION_MAP[value]?.tint ?? DEFAULT_TINT;
}

export function professionLabel(value) {
  return PROFESSION_MAP[value]?.label ?? value ?? "";
}

export function professionIcon(value) {
  return PROFESSION_MAP[value]?.icon ?? Wrench;
}

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatCurrency(amount) {
  if (amount === null || amount === undefined || Number.isNaN(Number(amount))) return "—";
  return currencyFormatter.format(Number(amount));
}

// Backend sends LocalDate as "YYYY-MM-DD". Parse as a local date to avoid timezone shifts.
export function formatDate(isoDate, options = { day: "numeric", month: "short", year: "numeric" }) {
  if (!isoDate) return "—";
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-IN", options);
}

// Backend sends LocalTime as "HH:mm[:ss]".
export function formatTime(isoTime) {
  if (!isoTime) return "—";
  const [h, m] = isoTime.split(":").map(Number);
  const date = new Date();
  date.setHours(h, m, 0, 0);
  return date.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
}

export function todayIso() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

export function initials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function firstName(name = "") {
  return name.trim().split(/\s+/)[0] ?? "";
}

// Turns an axios error into a message a person can act on.
export function getErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  if (!error?.response) {
    return "Can't reach the server. Check your connection and try again.";
  }
  const data = error.response.data;
  if (data?.message) return data.message;
  if (data && typeof data === "object") {
    const first = Object.values(data).find((v) => typeof v === "string");
    if (first) return first;
  }
  return fallback;
}

export function homePathFor(role) {
  if (role === "WORKER") return "/worker/dashboard";
  if (role === "FIRM") return "/firm/dashboard";
  if (role === "ADMIN") return "/admin/dashboard";
  return "/";
}

// Profiles live at one address for everyone; the role argument is kept for existing callers.
export function workerDetailsPath(_role, id) {
  return `/workers/${id}`;
}

export const ACTIVE_STATUSES = ["PENDING", "ACCEPTED", "IN_PROGRESS"];
export const CLOSED_STATUSES = ["REJECTED", "CANCELLED"];

// Visiting charge terms, as set by each worker and copied onto each booking.
export const VISIT_POLICIES = {
  ADJUST_AGAINST_FINAL_BILL: {
    label: "Adjusted in the final bill",
    short: "Counts towards the repair bill",
    description: "If you go ahead with the repair, the visiting charge counts towards the bill. If you don't, you pay only the visiting charge.",
  },
  SEPARATE: {
    label: "Charged separately",
    short: "Paid in addition to any repair",
    description: "The visiting charge covers travel and inspection and is paid in addition to any repair work.",
  },
};

export function visitPolicy(value) {
  return VISIT_POLICIES[value] ?? VISIT_POLICIES.ADJUST_AGAINST_FINAL_BILL;
}

// "Free" when the worker hasn't set a visiting charge or set it to zero.
export function formatVisitCharge(amount) {
  return Number(amount) > 0 ? formatCurrency(amount) : "Free";
}

export const QUOTE_ITEM_TYPES = [
  { value: "LABOUR", label: "Labour" },
  { value: "MATERIAL", label: "Material" },
  { value: "OTHER", label: "Other" },
];

// The booking total if `quote` is approved: extra work adds to the approved amounts, a first quote
// sets them. Mirrors the backend BillCalculator.
export function totalIfApproved(bill, quote) {
  const visit = Number(bill?.visitingCharge ?? 0);
  const quoted = (quote.extraWork ? Number(bill?.quoteTotal ?? 0) : 0) + Number(quote.total);
  return bill?.visitingChargePolicy === "SEPARATE" ? visit + quoted : Math.max(visit, quoted);
}

// "All of Pune" or "Pune, Mumbai" for a labour firm's coverage.
export function coverageLabel(firm) {
  const cities = firm?.coveredCities?.length ? firm.coveredCities : [firm?.city].filter(Boolean);
  return firm?.coverage === "SELECTED_CITIES" ? cities.join(", ") : `All of ${cities[0] ?? "their city"}`;
}

// Phone-only accounts have an internal placeholder email; never show it.
export function displayEmail(email) {
  return email && !email.endsWith(".invalid") ? email : null;
}

// Where to go after Google/phone/password sign-in: new professionals and firms finish their profile first.
export function pathAfterAuth(response, from) {
  if (response.newAccount && response.role === "WORKER") return "/complete-worker-profile";
  if (response.newAccount && response.role === "FIRM") return "/complete-firm-profile";
  if (response.role === "CUSTOMER" && from) return from;
  return homePathFor(response.role);
}
