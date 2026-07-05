import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">

          {/* Logo Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-650 font-extrabold text-xl shadow-lg shadow-blue-500/10">
                W
              </div>

              <div>
                <h2 className="text-2xl font-bold tracking-tight">Wease</h2>
                <p className="text-slate-400 text-xs mt-0.5 font-medium">Work Made Easy</p>
              </div>
            </div>

            <p className="mt-6 max-w-md leading-7 text-slate-400 font-medium">
              Wease helps customers connect with trusted
              professionals for home services quickly,
              safely and conveniently.
            </p>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-semibold mb-5 text-slate-200">Company</h3>
            <ul className="space-y-3 text-slate-400 font-medium">
              <li>
                <Link to="/about" className="hover:text-blue-400 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <span className="cursor-not-allowed hover:text-slate-505 transition-colors">
                  Careers
                </span>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <span className="cursor-not-allowed hover:text-slate-505 transition-colors">
                  Blog
                </span>
              </li>
            </ul>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="font-semibold mb-5 text-slate-200">Services</h3>
            <ul className="space-y-3 text-slate-400 font-medium">
              {["Carpenter", "Painter", "Electrician", "Plumber"].map((srv) => (
                <li key={srv}>
                  <Link to={`/customer/workers?service=${srv}`} className="hover:text-blue-400 transition-colors">
                    {srv}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Column */}
          <div>
            <h3 className="font-semibold mb-5 text-slate-200">Follow Us</h3>
            <div className="flex gap-4">
              {/* Facebook Inline SVG */}
              <a
                href="#"
                className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-405 hover:text-white hover:bg-slate-800 transition-all flex items-center justify-center"
                title="Facebook"
              >
                <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>

              {/* Instagram Inline SVG */}
              <a
                href="#"
                className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-405 hover:text-white hover:bg-slate-800 transition-all flex items-center justify-center"
                title="Instagram"
              >
                <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>

              {/* Linkedin Inline SVG */}
              <a
                href="#"
                className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-405 hover:text-white hover:bg-slate-800 transition-all flex items-center justify-center"
                title="LinkedIn"
              >
                <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>

              {/* Twitter Inline SVG */}
              <a
                href="#"
                className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-405 hover:text-white hover:bg-slate-800 transition-all flex items-center justify-center"
                title="Twitter"
              >
                <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-16 border-t border-slate-900 pt-8 text-center text-slate-500 text-sm font-medium">
          © 2026 Wease. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
