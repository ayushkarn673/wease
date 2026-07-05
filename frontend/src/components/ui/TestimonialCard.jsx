import { Star, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function TestimonialCard({
  image,
  name,
  city,
  review,
  rating,
}) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.25 }}
      className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-xl dark:hover:shadow-none"
    >
      <div className="flex items-center gap-4">
        <img
          src={image}
          alt={name}
          className="h-16 w-16 rounded-full object-cover border border-slate-100 dark:border-slate-800"
        />

        <div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">{name}</h3>

          <p className="text-slate-500 dark:text-slate-400 text-sm">{city}</p>
        </div>
      </div>

      <div className="mt-5 flex">
        {Array.from({ length: rating }).map((_, i) => (
          <Star
            key={i}
            size={18}
            className="fill-yellow-400 text-yellow-400"
          />
        ))}
      </div>

      <p className="mt-5 leading-7 text-slate-600 dark:text-slate-300">
        "{review}"
      </p>

      <div className="mt-6 flex items-center gap-2 text-green-605 dark:text-green-400 font-medium">
        <BadgeCheck size={18} />
        Verified Booking
      </div>
    </motion.div>
  );
}
