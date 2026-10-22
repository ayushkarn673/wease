import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "../../context/AuthContext";
import { NAV } from "./navigation";

// Mobile tab bar: icons only, the active tab expands into a teal pill with its label.
export default function BottomNav() {
  const { user } = useAuth();
  const links = (user ? NAV[user.role] : NAV.GUEST) ?? [];
  if (links.length < 2) return null;

  return (
    <nav
      aria-label="Tabs"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white px-4 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-3 md:hidden"
    >
      <ul className="flex items-center justify-around gap-2">
        {links.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === "/"}
              aria-label={label}
              className={({ isActive }) =>
                cn(
                  "flex h-11 items-center gap-2 rounded-full transition",
                  isActive ? "bg-brand-600 px-5 text-white" : "px-3 text-neutral-500 hover:text-neutral-900"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="size-5" />
                  {isActive && <span className="text-sm font-semibold">{label}</span>}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
