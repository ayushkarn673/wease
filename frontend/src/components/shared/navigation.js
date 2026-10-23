import { Building2, CalendarDays, Home, LayoutDashboard, Search, ShieldCheck, UserRound } from "lucide-react";

// Signed-in navigation per role. Used by the top bar (desktop) and the bottom bar (mobile).
export const NAV = {
  CUSTOMER: [
    { to: "/", label: "Home", icon: Home },
    { to: "/workers", label: "Find", icon: Search },
    { to: "/firms", label: "Firms", icon: Building2 },
    { to: "/customer/bookings", label: "Bookings", icon: CalendarDays },
    { to: "/customer/profile", label: "Profile", icon: UserRound },
  ],
  WORKER: [
    { to: "/worker/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/worker/profile", label: "Profile", icon: UserRound },
  ],
  FIRM: [
    { to: "/firm/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/firm/profile", label: "Company", icon: Building2 },
  ],
  ADMIN: [{ to: "/admin/dashboard", label: "Overview", icon: ShieldCheck }],
  // Visitors who aren't signed in. Bookings and Account lead to the login page.
  GUEST: [
    { to: "/", label: "Home", icon: Home },
    { to: "/workers", label: "Find", icon: Search },
    { to: "/firms", label: "Firms", icon: Building2 },
    { to: "/customer/bookings", label: "Bookings", icon: CalendarDays },
    { to: "/login", label: "Log in", icon: UserRound },
  ],
};

// Where a professional answers booking requests; shows the count of waiting requests in the menus.
export const REQUESTS_PATH = "/worker/dashboard";

export const ROLE_LABEL = { CUSTOMER: "Customer", WORKER: "Professional", FIRM: "Labour firm", ADMIN: "Admin" };
