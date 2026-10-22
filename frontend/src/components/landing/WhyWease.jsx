import { Check } from "lucide-react";
import { MARKETING_PHOTOS, unsplashUrl } from "@/lib/media";

const POINTS = [
  "Browse professionals without creating an account",
  "See experience, service area and the visiting charge up front",
  "Book for a date and time that suits you",
  "Cancel easily while a booking is pending or confirmed",
  "Track every request from one bookings page",
];

export default function WhyWease() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-14 sm:px-6">
      <div className="grid items-center gap-8 overflow-hidden rounded-3xl bg-white ring-1 ring-neutral-900/5 lg:grid-cols-2">
        <img
          src={unsplashUrl(MARKETING_PHOTOS.carpentry, 900)}
          alt="Carpenter sanding a wooden surface"
          loading="lazy"
          className="h-64 w-full object-cover lg:h-full lg:min-h-[26rem]"
        />
        <div className="px-6 pb-8 lg:py-10 lg:pr-12">
          <p className="text-sm font-semibold text-brand-700">Why Wease</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
            Hiring help for your home, without the guesswork
          </h2>
          <ul className="mt-6 space-y-3.5">
            {POINTS.map((point) => (
              <li key={point} className="flex gap-3 text-neutral-700">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-700 text-white">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
