import { testimonials } from "../../data/testimonials";
import TestimonialCard from "../ui/TestimonialCard";

export default function Testimonials() {
  return (
    <section className="bg-slate-50 dark:bg-slate-950/20 py-24 border-b border-slate-200/55 dark:border-slate-900">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <span className="rounded-full bg-blue-100 dark:bg-blue-900/35 px-4 py-2 text-sm font-semibold text-blue-700 dark:text-blue-400">
            Testimonials
          </span>

          <h2 className="mt-6 text-5xl font-bold text-slate-900 dark:text-white">
            What Our Customers Say
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-slate-500 dark:text-slate-400">
            Thousands of customers trust Wease to connect them with skilled professionals.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item) => (
            <TestimonialCard key={item.id} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
