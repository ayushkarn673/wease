import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function CallToAction() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="flex flex-col gap-6 rounded-3xl bg-brand-700 px-6 py-10 text-white sm:px-10 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Are you a skilled professional?</h2>
          <p className="mt-2 text-white/75">
            Get booking requests from customers near you. Set your own rates and choose the jobs you take.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to="/register?role=worker"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-brand-800 transition hover:bg-brand-50"
          >
            Join as a professional
            <ArrowRight className="size-4" />
          </Link>
          <Link
            to="/workers"
            className="inline-flex h-12 items-center justify-center rounded-full border border-white/30 px-6 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Book a service
          </Link>
        </div>
      </div>
    </section>
  );
}
