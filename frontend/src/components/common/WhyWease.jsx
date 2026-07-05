import { ShieldCheck, Clock, CircleDollarSign, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";

export default function WhyWease() {
  const points = [
    {
      title: "Fully Verified Pros",
      desc: "Every worker undergoes rigorous background checks and credential verification, ensuring your home is always in safe, trusted hands.",
      icon: ShieldCheck,
      color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "Book in Minutes",
      desc: "No more endless phone tags. Browse local professionals, compare transparent ratings, and schedule work instantly through our platform.",
      icon: Clock,
      color: "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20",
    },
    {
      title: "Upfront Transparent Pricing",
      desc: "See clear quotes and hourly rates before booking. Pay securely online only after the job is completed to your satisfaction.",
      icon: CircleDollarSign,
      color: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20",
    },
    {
      title: "Satisfaction Guarantee",
      desc: "Our support team is here for you 24/7. We stand behind our work, ensuring every single service call meets premium standards.",
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20",
    },
  ];

  return (
    <section id="about" className="py-20 sm:py-24 bg-slate-50/50 dark:bg-slate-950/20">
      <Container>
        {/* Section Header */}
        <SectionTitle
          title="Why Choose Wease?"
          subtitle="We bring trust, simplicity, and premium quality back to local home services."
          align="center"
        />

        {/* Features Grid */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {points.map((point, index) => {
            const Icon = point.icon;
            return (
              <div
                key={index}
                className="group relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                {/* Icon Container */}
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${point.color} mb-6`}>
                  <Icon className="size-6" />
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                  {point.title}
                </h3>

                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {point.desc}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
