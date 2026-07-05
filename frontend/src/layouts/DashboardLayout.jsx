import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LayoutDashboard, User, LogOut, ShieldCheck, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function DashboardLayout({ children, userType = "customer" }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Mock logout
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row text-slate-900 dark:text-white">
      
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between bg-slate-900 text-white px-6 py-4 border-b border-slate-800">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-lg">
            W
          </div>
          <span className="text-xl font-bold tracking-tight">Wease</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1 rounded-md text-slate-400 hover:text-white"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white flex flex-col border-r border-slate-800 transform md:translate-x-0 md:static transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-slate-800 hidden md:flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-650 flex items-center justify-center font-bold text-lg shadow-md transition-transform group-hover:scale-105">
              W
            </div>
            <span className="text-xl font-bold tracking-tight">Wease</span>
          </Link>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          <Link
            to={`/${userType}/dashboard`}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition font-semibold"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
          
          <Link
            to="/profile"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition font-semibold"
          >
            <User size={18} />
            Profile
          </Link>

          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition font-semibold"
          >
            <Home size={18} />
            Landing Page
          </Link>
        </nav>

        {/* Sidebar Footer / Logout */}
        <div className="p-6 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition font-semibold"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Backdrop overlay for mobile menu */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
        />
      )}

      {/* Content pane */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
      
    </div>
  );
}
