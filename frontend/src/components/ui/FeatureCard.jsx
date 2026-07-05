import { motion } from "framer-motion";

export default function FeatureCard({
  Icon,
  title,
  description,
  color,
}) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.25 }}
      className="group rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm hover:shadow-xl dark:hover:shadow-none"
    >
      <div
        className={`h-16 w-16 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg`}
      >
        <Icon size={30} />
      </div>

      <h3 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">
        {title}
      </h3>

      <p className="mt-4 leading-7 text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </motion.div>
  );
}
