import { motion } from "framer-motion";

// Fades and lifts content into view once. `index` staggers items in a list or grid.
export default function Reveal({ children, index = 0, className }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, ease: "easeOut", delay: Math.min(index, 8) * 0.05 }}
    >
      {children}
    </motion.div>
  );
}
