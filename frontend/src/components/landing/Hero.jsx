import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BadgeIndianRupee, CalendarCheck2, CheckCircle2, ListChecks } from "lucide-react";
import { PROFESSIONS } from "@/lib/format";
import { MARKETING_PHOTOS, unsplashUrl } from "@/lib/media";
import SearchCard from "./SearchCard";

const POPULAR = ["ELECTRICIAN", "PLUMBER", "PAINTER", "CLEANER"];

const VALUE_PROPS = [
  { icon: BadgeIndianRupee, title: "Upfront pricing", text: "See the visiting charge before you book" },
  { icon: CalendarCheck2, title: "Your schedule", text: "Choose the date and time that suits you" },
  { icon: ListChecks, title: "Clear tracking", text: "Follow every job from request to done" },
];

export default function Hero() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-12 pt-10 sm:px-6 sm:pt-16 lg:grid-cols-[1.1fr_1fr] lg:pb-20">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <p className="text-sm font-semibold text-brand-700">Home services in your city</p>
          <h1 className="mt-3 text-4xl font-bold leading-[1.1] tracking-tight text-neutral-900 sm:text-5xl lg:text-[3.4rem]">
            Skilled professionals for every job around your home
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-neutral-600">
            Compare experienced electricians, plumbers, carpenters and more — then book a visit at a time that works
            for you.
          </p>

          <div className="mt-8 max-w-2xl">
            <SearchCard />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-neutral-500">Popular:</span>
            {POPULAR.map((value) => (
              <Link
                key={value}
                to={`/workers?profession=${value}`}
                className="rounded-full border border-neutral-200 px-3 py-1 font-medium text-neutral-700 transition hover:border-brand-300 hover:text-brand-700"
              >
                {PROFESSIONS.find((p) => p.value === value).label}
              </Link>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="relative hidden lg:block"
        >
          <div className="grid grid-cols-2 gap-4">
            <img
              src={unsplashUrl(MARKETING_PHOTOS.painting, 700)}
              alt="Painter rolling fresh paint onto a wall"
              className="row-span-2 h-[26rem] w-full rounded-3xl object-cover"
            />
            <img
              src={unsplashUrl(MARKETING_PHOTOS.electrician, 500)}
              alt="Electrician installing wiring"
              className="h-[12.5rem] w-full rounded-3xl object-cover"
            />
            <img
              src={unsplashUrl(MARKETING_PHOTOS.cleaning, 500)}
              alt="Cleaner mopping a living room floor"
              className="h-[12.5rem] w-full rounded-3xl object-cover"
            />
          </div>
          {/* A sample of the booking status UI customers see — illustrative, not a real booking. */}
          <div className="absolute -bottom-6 -left-8 flex items-center gap-3 rounded-2xl bg-white p-4 pr-6 shadow-xl shadow-neutral-900/10 ring-1 ring-neutral-900/5">
            <span className="flex size-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="size-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-neutral-900">Booking confirmed</p>
              <p className="text-xs text-neutral-500">Your professional accepted the request</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="border-y border-neutral-200 bg-neutral-50/60">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:grid-cols-3 sm:px-6">
          {VALUE_PROPS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-brand-700 ring-1 ring-neutral-200">
                <Icon className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-neutral-900">{title}</p>
                <p className="text-sm text-neutral-500">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
