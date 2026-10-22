import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "../../context/AuthContext";
import { homePathFor } from "@/lib/format";
import BrandLogo from "../shared/BrandLogo";
import CitySelector from "../shared/CitySelector";

const NAV_LINKS = [
  { to: "/workers", label: "Find professionals" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <div className="flex items-center gap-3 sm:gap-5">
          <BrandLogo />
          {(!user || user.role === "CUSTOMER") && <CitySelector className="hidden sm:inline-flex" />}
        </div>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium transition",
                  isActive ? "text-brand-700" : "text-neutral-600 hover:text-neutral-900"
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <Link
              to={homePathFor(user.role)}
              className="inline-flex h-10 items-center rounded-full bg-brand-700 px-5 text-sm font-semibold text-white transition hover:bg-brand-800"
            >
              Go to dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="inline-flex h-10 items-center rounded-full px-4 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100">
                Log in
              </Link>
              <Link
                to="/register"
                className="inline-flex h-10 items-center rounded-full bg-brand-700 px-5 text-sm font-semibold text-white transition hover:bg-brand-800"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-full p-2 text-neutral-700 hover:bg-neutral-100 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-neutral-200 bg-white px-4 pb-5 pt-3 md:hidden">
          {(!user || user.role === "CUSTOMER") && <CitySelector className="mb-3 sm:hidden" />}
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {user ? (
              <Link to={homePathFor(user.role)} className="col-span-2 rounded-full bg-brand-700 py-2.5 text-center text-sm font-semibold text-white">
                Go to dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="rounded-full border border-neutral-200 py-2.5 text-center text-sm font-semibold text-neutral-700">
                  Log in
                </Link>
                <Link to="/register" className="rounded-full bg-brand-700 py-2.5 text-center text-sm font-semibold text-white">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
