import { motion } from "framer-motion";

export default function StepCard({
  number,
  Icon,
  title,
  description,
}) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.25 }}
      className="relative rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm hover:shadow-xl dark:hover:shadow-none"
    >
      {/* Step Number */}
      <div className="absolute -top-4 left-6 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-lg">
        {number}
      </div>

      {/* Icon */}
      <div className="mt-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-900/35 text-blue-600 dark:text-blue-400">
        <Icon size={30} />
      </div>

      <h3 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">
        {title}
      </h3>

      <p className="mt-4 text-slate-500 dark:text-slate-400 leading-7">
        {description}
      </p>
    </motion.div>
  );
}
