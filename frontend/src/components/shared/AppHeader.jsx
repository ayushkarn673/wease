import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "../../context/AuthContext";
import { displayEmail, homePathFor } from "@/lib/format";
import BrandLogo from "./BrandLogo";
import CitySelector from "./CitySelector";
import UserAvatar from "./UserAvatar";
import { NAV, REQUESTS_PATH, ROLE_LABEL } from "./navigation";
import { usePendingRequests } from "../../context/requests";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const PROFILE_PATH = { CUSTOMER: "/customer/profile", WORKER: "/worker/profile", FIRM: "/firm/profile" };

// White app bar. Page links show here on desktop; phones use the BottomNav. Visitors who aren't signed in
// see Log in / Sign up instead of the account menu.
export default function AppHeader() {
  const { user, logout } = useAuth();
  const pending = usePendingRequests();
  const navigate = useNavigate();
  const location = useLocation();
  const links = (user ? NAV[user.role] : NAV.GUEST.slice(0, 3)) ?? [];
  const profilePath = PROFILE_PATH[user?.role];

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:gap-8 sm:px-6">
        {/* On very small phones only the logo mark shows, so Log in and Sign up both fit. */}
        <BrandLogo to={homePathFor(user?.role)} nameClassName={user ? undefined : "max-[359px]:hidden"} />

        <nav className="hidden h-full items-center gap-1 md:flex" aria-label="Main">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                cn(
                  "relative flex h-full items-center px-3 text-sm font-medium transition",
                  isActive
                    ? "text-brand-700 after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-brand-700"
                    : "text-neutral-600 hover:text-neutral-900"
                )
              }
            >
              {link.label}
              {link.to === REQUESTS_PATH && pending > 0 && (
                <span className="ml-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-[11px] font-bold text-white">
                  {pending}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {(!user || user.role === "CUSTOMER") && <CitySelector compact={!user} />}
          {!user && (
            <>
              <Link
                to="/login"
                state={{ from: location.pathname + location.search }}
                className="inline-flex h-9 shrink-0 items-center rounded-full px-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100 sm:px-3"
              >
                Log in
              </Link>
              <Link
                to="/register"
                state={{ from: location.pathname + location.search }}
                className="inline-flex h-9 shrink-0 items-center rounded-full bg-brand-700 px-3.5 text-sm font-semibold text-white transition hover:bg-brand-800 sm:px-4"
              >
                Sign up
              </Link>
            </>
          )}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-2 transition hover:bg-neutral-100">
                  <UserAvatar name={user.fullName} size="sm" />
                  <span className="hidden text-left sm:block">
                    <span className="block max-w-40 truncate text-sm font-semibold text-neutral-900">{user.fullName}</span>
                    <span className="block text-xs text-neutral-500">{ROLE_LABEL[user.role]}</span>
                  </span>
                  <ChevronDown className="size-4 text-neutral-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <p className="truncate text-sm font-medium text-neutral-900">{user.fullName}</p>
                  <p className="truncate text-xs text-neutral-500">{displayEmail(user.email) ?? user.phone ?? ""}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {profilePath && (
                  <DropdownMenuItem onSelect={() => navigate(profilePath)}>
                    <UserRound className="size-4" />
                    Profile settings
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onSelect={handleLogout} className="text-red-600 focus:text-red-600">
                  <LogOut className="size-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
