import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Services from "../pages/Services";
import Contact from "../pages/Contact";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import VerifyEmail from "../pages/auth/VerifyEmail";
import CompleteWorkerProfile from "../pages/auth/CompleteWorkerProfile";
import CustomerDashboard from "../pages/customer/Dashboard";
import Workers from "../pages/customer/Workers";
import WorkerDashboard from "../pages/worker/Dashboard";
import AdminDashboard from "../pages/admin/Dashboard";
import Profile from "../pages/Profile";
import BookingDetails from "../pages/BookingDetails";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/complete-worker-profile" element={<CompleteWorkerProfile />} />
      <Route path="/customer/dashboard" element={<CustomerDashboard />} />
      <Route path="/customer/workers" element={<Workers />} />
      <Route path="/worker/dashboard" element={<WorkerDashboard />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/booking/:id" element={<BookingDetails />} />
      <Route path="*" element={<div className="min-h-screen flex items-center justify-center font-bold text-slate-850 dark:text-slate-250">404 - Not Found</div>} />
    </Routes>
  );
}
