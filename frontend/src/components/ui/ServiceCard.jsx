import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function ServiceCard({
  title,
  description,
  workers,
  Icon,
}) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.25 }}
      className="group cursor-pointer rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-2xl"
    >
      {/* Icon */}
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/10">
        <Icon size={30} />
      </div>

      {/* Content */}
      <div className="mt-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>

      {/* Bottom */}
      <div className="mt-8 flex items-center justify-between">
        <div>
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {workers}+
          </p>

          <p className="text-sm text-slate-500 dark:text-slate-450">
            Workers Available
          </p>
        </div>

        <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-3 text-slate-700 dark:text-slate-300 transition-all group-hover:bg-blue-600 dark:group-hover:bg-blue-600 group-hover:text-white">
          <ArrowRight
            size={20}
            className="transition-transform group-hover:translate-x-1"
          />
        </div>
      </div>
    </motion.div>
  );
}
