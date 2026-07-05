import { ArrowRight, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function CallToAction() {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 p-12 lg:p-20 text-white shadow-2xl"
        >

          {/* Background Blur */}
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl"></div>

          <div className="relative z-10 max-w-3xl">

            <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold tracking-wide">
              Start Today
            </span>

            <h2 className="mt-6 text-4xl md:text-6xl font-bold leading-tight tracking-tight">
              Find Skilled Workers
              <br />
              Within Minutes.
            </h2>

            <p className="mt-6 text-lg text-blue-100 max-w-xl leading-relaxed font-medium">
              From home repairs to construction projects,
              Wease connects you with verified professionals
              you can trust.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">

              <button
                onClick={() => navigate("/register")}
                className="flex items-center gap-2 rounded-2xl bg-white px-7 py-4 font-semibold text-blue-700 transition hover:scale-105 shadow-md shadow-slate-900/10 hover:shadow-lg active:scale-98"
              >
                Find Worker
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() => navigate("/register")}
                className="flex items-center gap-2 rounded-2xl border border-white/30 px-7 py-4 font-semibold transition hover:bg-white/10 active:scale-98"
              >
                <Briefcase size={18} />
                Become a Worker
              </button>

            </div>

          </div>

        </motion.div>

      </div>
    </section>
  );
}
