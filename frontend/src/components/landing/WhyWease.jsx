import {
  ShieldCheck,
  Clock3,
  CreditCard,
  MapPinned,
} from "lucide-react";

import FeatureCard from "../ui/FeatureCard";

const features = [
  {
    Icon: ShieldCheck,
    title: "Verified Workers",
    description:
      "Every professional is verified before joining Wease.",
    color: "bg-blue-600",
  },
  {
    Icon: Clock3,
    title: "Quick Booking",
    description:
      "Book trusted workers in just a few clicks.",
    color: "bg-green-600",
  },
  {
    Icon: CreditCard,
    title: "Secure Payments",
    description:
      "Pay safely online after the job is completed.",
    color: "bg-purple-600",
  },
  {
    Icon: MapPinned,
    title: "Live Tracking",
    description:
      "Track your worker's location in real time.",
    color: "bg-orange-500",
  },
];

export default function WhyWease() {
  return (
    <section className="py-24 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center">

          <span className="bg-blue-100 dark:bg-blue-900/35 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-semibold">
            Why Wease
          </span>

          <h2 className="mt-6 text-5xl font-bold text-slate-900 dark:text-white">
            Why Choose Wease?
          </h2>

          <p className="mt-5 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            We make finding skilled professionals simple,
            secure and reliable.
          </p>

        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              {...feature}
            />
          ))}

        </div>

      </div>
    </section>
  );
}
