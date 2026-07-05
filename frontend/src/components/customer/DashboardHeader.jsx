import { Link, useNavigate } from "react-router-dom";
import { Bell, Menu, Search } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function DashboardHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        <div className="flex items-center gap-3">
          <button className="lg:hidden text-slate-600 dark:text-slate-400">
            <Menu size={22} />
          </button>

          <Link to="/" className="text-2xl font-bold text-blue-600">
            Wease
          </Link>
        </div>

        <div className="hidden md:flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-2 w-96">
          <Search size={18} className="text-slate-400" />
          <input
            className="ml-3 w-full bg-transparent outline-none text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
            placeholder="Search workers..."
          />
        </div>

        <div className="flex items-center gap-4">

          <button className="relative text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition">
            <Bell size={22} />
            <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500"></span>
          </button>

          <div className="text-right hidden sm:block">
            <p className="font-semibold text-slate-900 dark:text-white text-sm">{user?.fullName}</p>
            <p className="text-xs text-slate-500">{user?.role}</p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl bg-red-500 px-4 py-2 text-sm text-white font-semibold hover:bg-red-600 transition"
          >
            Logout
          </button>

        </div>
      </div>
    </header>
  );
}
