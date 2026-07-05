import { Heart, MapPin, Star, BadgeCheck, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

export default function WorkerCard({
  image,
  name,
  profession,
  experience,
  rating,
  reviews,
  price,
  distance,
}) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ duration: 0.25 }}
      className="group overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-2xl dark:hover:shadow-none"
    >
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />

        <button className="absolute right-4 top-4 rounded-full bg-white dark:bg-slate-800 p-2 shadow text-slate-700 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-500 transition-colors">
          <Heart size={18} />
        </button>

        <span className="absolute left-4 top-4 rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
          Available
        </span>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center gap-2">
          <Star
            size={18}
            className="fill-yellow-400 text-yellow-400"
          />

          <span className="font-semibold text-slate-900 dark:text-white">
            {rating}
          </span>

          <span className="text-slate-500 dark:text-slate-400">
            ({reviews})
          </span>
        </div>

        <h3 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
          {name}
        </h3>

        <p className="mt-1 text-blue-600 dark:text-blue-400 font-medium">
          {profession}
        </p>

        <div className="mt-5 space-y-3">
          <div className="flex items-center gap-2 text-slate-650 dark:text-slate-350">
            <Briefcase size={18} className="text-slate-450 dark:text-slate-500" />
            {experience} Years Experience
          </div>

          <div className="flex items-center gap-2 text-slate-655 dark:text-slate-350">
            <MapPin size={18} className="text-slate-455 dark:text-slate-500" />
            {distance} Away
          </div>

          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium">
            <BadgeCheck size={18} />
            Verified Professional
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-805 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ₹{price}
            </h2>

            <p className="text-xs text-slate-500 dark:text-slate-450 font-medium">
              Starting Price
            </p>
          </div>

          <button className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 transition shadow-md shadow-blue-600/10 font-bold">
            View Profile
          </button>
        </div>
      </div>
    </motion.div>
  );
}
