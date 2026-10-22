import { Link } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";

export default function NotFound() {
  return (
    <PublicLayout>
      <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:py-32">
        <p className="text-sm font-semibold text-brand-600">404</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-neutral-900">Page not found</h1>
        <p className="mt-4 text-neutral-600">The page you're looking for doesn't exist or has moved.</p>
        <div className="mt-8 flex gap-3">
          <Link to="/" className="inline-flex h-11 items-center rounded-full bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700">
            Go home
          </Link>
          <Link to="/workers" className="inline-flex h-11 items-center rounded-full border border-neutral-200 px-5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50">
            Find a professional
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
