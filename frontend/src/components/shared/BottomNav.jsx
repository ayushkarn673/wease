import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "../../context/AuthContext";
import { NAV, REQUESTS_PATH } from "./navigation";
import { usePendingRequests } from "../../context/requests";

// Mobile tab bar at the bottom of the app shell: icons only, each in a fixed spot. The current page's icon
// is highlighted; nothing changes size, so the bar never shifts. Names are read out by screen readers.
export default function BottomNav() {
  const { user } = useAuth();
  const pending = usePendingRequests();
  const links = (user ? NAV[user.role] : NAV.GUEST) ?? [];
  if (links.length < 2) return null;

  return (
    <nav
      aria-label="Tabs"
      className="relative z-40 shrink-0 border-t border-neutral-200 bg-white px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 md:hidden"
    >
      <ul className="flex items-center">
        {links.map(({ to, label, icon: Icon }) => (
          <li key={to} className="flex flex-1 justify-center">
            <NavLink
              to={to}
              end={to === "/"}
              aria-label={label}
              title={label}
              className={({ isActive }) =>
                cn(
                  "relative flex size-12 items-center justify-center rounded-2xl transition-colors active:bg-brand-100",
                  isActive ? "bg-brand-50 text-brand-700 dark:bg-brand-500/25" : "text-neutral-500 hover:text-neutral-900"
                )
              }
            >
              <Icon className="size-6" />
              {to === REQUESTS_PATH && pending > 0 && <CountBadge count={pending} />}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function CountBadge({ count }) {
  return (
    <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
      {count > 9 ? "9+" : count}
    </span>
  );
}
