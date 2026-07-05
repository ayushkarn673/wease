import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-md"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-blue-500/20 transition-transform group-hover:scale-105">
            W
          </div>

          <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Wease
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 font-medium">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="text-slate-700 dark:text-slate-350 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Buttons */}
        <div className="hidden md:flex items-center gap-5">
          <Link
            to="/login"
            className="font-medium text-slate-700 dark:text-slate-355 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white px-5 py-3 rounded-xl transition duration-300 font-semibold shadow-md shadow-blue-600/10 hover:scale-[1.02] active:scale-[0.98]"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-lg"
          >
            <div className="flex flex-col p-6 gap-5 font-semibold text-slate-700 dark:text-slate-300">
              {navLinks.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className="hover:text-blue-600 transition"
                >
                  {item.name}
                </Link>
              ))}

              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="text-center py-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="text-center py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-md shadow-blue-600/10"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
