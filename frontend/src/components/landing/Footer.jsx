import { Link } from "react-router-dom";
import { PROFESSIONS } from "@/lib/format";
import BrandLogo from "../shared/BrandLogo";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <BrandLogo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-neutral-500">
              Wease connects you with local electricians, plumbers, carpenters, painters and more. Book in minutes and
              track every job in one place.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-neutral-900">Services</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-neutral-500">
              {PROFESSIONS.slice(0, 5).map((p) => (
                <li key={p.value}>
                  <Link to={`/workers?profession=${p.value}`} className="transition hover:text-neutral-900">
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-neutral-900">Company</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-neutral-500">
              <li><Link to="/about" className="transition hover:text-neutral-900">About</Link></li>
              <li><Link to="/contact" className="transition hover:text-neutral-900">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-neutral-100 pt-6 text-sm text-neutral-400 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Wease. All rights reserved.</p>
          <p>Made for local services in India.</p>
        </div>
      </div>
    </footer>
  );
}
