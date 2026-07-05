import {
  Search,
  UserRoundCheck,
  CalendarCheck,
  BadgeCheck,
} from "lucide-react";

import StepCard from "../ui/StepCard";

const steps = [
  {
    number: "01",
    Icon: Search,
    title: "Search",
    description:
      "Choose the service you need and enter your location.",
  },
  {
    number: "02",
    Icon: UserRoundCheck,
    title: "Choose Worker",
    description:
      "Compare ratings, experience, pricing and reviews.",
  },
  {
    number: "03",
    Icon: CalendarCheck,
    title: "Book Instantly",
    description:
      "Select a suitable time and confirm your booking.",
  },
  {
    number: "04",
    Icon: BadgeCheck,
    title: "Get Work Done",
    description:
      "Track your worker, complete the job and leave a review.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-slate-50 dark:bg-slate-950/20 py-24 border-b border-slate-200/55 dark:border-slate-900">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="text-center">
          <span className="rounded-full bg-blue-100 dark:bg-blue-900/35 px-4 py-2 text-sm font-semibold text-blue-700 dark:text-blue-400">
            Simple Process
          </span>

          <h2 className="mt-6 text-5xl font-bold text-slate-900 dark:text-white">
            How Wease Works
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-500 dark:text-slate-400">
            Book a trusted worker in four simple steps.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step) => (
            <StepCard key={step.number} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
}
