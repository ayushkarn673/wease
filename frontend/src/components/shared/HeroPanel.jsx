import { cn } from "@/lib/utils";

// Teal page header. On phones it runs edge to edge under the app bar; on larger screens it becomes
// a rounded panel. `image` (a URL) adds a photo that fades into the teal on the right.
export default function HeroPanel({ children, image, className }) {
  return (
    <section
      className={cn(
        "relative -mx-4 -mt-6 overflow-hidden rounded-b-3xl bg-brand-700 px-5 pb-7 pt-7 text-white sm:mx-0 sm:mt-0 sm:rounded-3xl sm:px-10 sm:py-10",
        className
      )}
    >
      {image && (
        <img
          src={image}
          alt=""
          aria-hidden="true"
          className="absolute inset-y-0 right-0 hidden h-full w-[58%] object-cover opacity-90 [mask-image:linear-gradient(to_right,transparent,black_65%)] md:block"
        />
      )}
      <div className="relative">{children}</div>
    </section>
  );
}
