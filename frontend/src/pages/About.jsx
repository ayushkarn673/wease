import { Link } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import PublicHeader from "../components/shared/PublicHeader";
import HowItWorks from "../components/landing/HowItWorks";

export default function About() {
  return (
    <PublicLayout>
      <PublicHeader eyebrow="About Wease" title="Work made easy" />
      <section className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8">
          <div className="max-w-3xl space-y-4 leading-relaxed text-neutral-600">
            <p>
              Finding a reliable electrician, plumber or carpenter usually means asking around and hoping for the best.
              Wease makes it simpler: browse local professionals, compare their experience and visiting charges, and send
              a booking request for the time that suits you.
            </p>
            <p>
              For skilled professionals, Wease is a straightforward way to get work from nearby customers — with control
              over your rates, your availability and the jobs you accept.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/workers" className="inline-flex h-11 items-center rounded-full bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700">
              Find a professional
            </Link>
          </div>
        </div>
      </section>
      <div className="pb-16">
        <HowItWorks />
      </div>
    </PublicLayout>
  );
}
