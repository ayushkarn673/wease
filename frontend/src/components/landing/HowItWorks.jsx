import { CalendarCheck2, CircleCheckBig, Search } from "lucide-react";
import SectionHeader from "../shared/SectionHeader";

const STEPS = [
  {
    icon: Search,
    title: "Find the right professional",
    description: "Browse by service and compare experience, location and visiting charges.",
  },
  {
    icon: CalendarCheck2,
    title: "Request a booking",
    description: "Pick a date and time, add your address and describe the job.",
  },
  {
    icon: CircleCheckBig,
    title: "Get the job done",
    description: "Follow the status from your bookings page until the work is complete.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-4 pt-14 sm:px-6">
      <SectionHeader title="How it works" />
      <ol className="grid gap-4 md:grid-cols-3">
        {STEPS.map(({ icon: Icon, title, description }, index) => (
          <li key={title} className="rounded-2xl bg-white p-6 ring-1 ring-neutral-900/5">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                <Icon className="size-5" />
              </span>
              <span className="text-sm font-semibold text-neutral-400">Step {index + 1}</span>
            </div>
            <h3 className="mt-4 font-semibold text-neutral-900">{title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">{description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
