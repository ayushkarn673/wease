import { ArrowRight, CheckCircle, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20 pt-32 pb-24">
      {/* Background Blur */}
      <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-blue-200/40 dark:bg-blue-900/10 blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-200/40 dark:bg-cyan-900/10 blur-3xl opacity-30"></div>

      <div className="mx-auto flex max-w-7xl flex-col items-center gap-16 px-6 lg:flex-row">
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex-1"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 shadow-sm">
            <CheckCircle className="h-4 w-4 text-green-650 dark:text-green-500" />
            <span className="text-sm font-medium text-slate-800 dark:text-slate-350">
              Trusted by 15,000+ customers
            </span>
          </div>

          <h1 className="text-5xl font-extrabold leading-tight text-slate-900 dark:text-white lg:text-7xl tracking-tight">
            Find Trusted
            <br />
            <span className="text-blue-600 dark:text-blue-400">Workers</span>
            <br />
            Near You.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-650 dark:text-slate-400">
            Book verified carpenters, painters, electricians, plumbers,
            cleaners and skilled workers within minutes.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <button 
              onClick={() => navigate("/register")}
              className="flex items-center gap-2 rounded-2xl bg-blue-600 px-7 py-4 font-semibold text-white transition hover:scale-105 hover:bg-blue-700 shadow-md shadow-blue-600/10"
            >
              Find Worker
              <ArrowRight size={18} />
            </button>

            <button 
              onClick={() => navigate("/register")}
              className="rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 px-7 py-4 font-semibold text-slate-800 dark:text-slate-300 transition hover:border-blue-600 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400"
            >
              Become a Worker
            </button>
          </div>

          <div className="mt-12 flex gap-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">15K+</h2>
              <p className="text-slate-500 dark:text-slate-400">Workers</p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">50K+</h2>
              <p className="text-slate-500 dark:text-slate-400">Bookings</p>
            </div>

            <div>
              <h2 className="flex items-center gap-1 text-3xl font-bold text-slate-900 dark:text-white">
                4.9
                <Star className="fill-yellow-400 text-yellow-400" size={22} />
              </h2>
              <p className="text-slate-500 dark:text-slate-400">Average Rating</p>
            </div>
          </div>
        </motion.div>

        {/* Right */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="relative flex flex-1 justify-center"
        >
          {/* Main Card */}
          <div className="w-full max-w-md rounded-[32px] bg-white dark:bg-slate-900 p-8 shadow-2xl shadow-slate-100/50 dark:shadow-none border border-slate-100 dark:border-slate-800/80">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700"
              alt="Worker"
              className="h-72 w-full rounded-3xl object-cover"
            />

            <div className="mt-6">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Rahul Sharma</h3>

              <p className="mt-1 text-slate-500 dark:text-slate-450">
                Professional Carpenter
              </p>

              <div className="mt-4 flex items-center justify-between">
                <span className="rounded-full bg-green-100 dark:bg-green-950 px-3 py-1 text-sm font-semibold text-green-700 dark:text-green-400">
                  Verified
                </span>

                <span className="font-bold text-blue-650 dark:text-blue-400">
                  ₹499 / Visit
                </span>
              </div>
            </div>
          </div>

          {/* Floating Rating */}
          <div className="absolute -left-5 top-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-5 py-3 shadow-xl dark:shadow-none text-slate-855 dark:text-slate-200 font-semibold flex items-center gap-1">
            ⭐ 4.9 Rating
          </div>

          {/* Floating Badge */}
          <div className="absolute -right-6 bottom-12 rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-xl shadow-blue-600/10">
            Available Now
          </div>
        </motion.div>
      </div>
    </section>
  );
}
