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
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/complete-worker-profile" element={<CompleteWorkerProfile />} />

      {/* Protected + Role-based routes */}
      <Route path="/customer/dashboard" element={
        <ProtectedRoute>
          <RoleRoute role="CUSTOMER">
            <CustomerDashboard />
          </RoleRoute>
        </ProtectedRoute>
      } />
      <Route path="/customer/workers" element={
        <ProtectedRoute>
          <RoleRoute role="CUSTOMER">
            <Workers />
          </RoleRoute>
        </ProtectedRoute>
      } />
      <Route path="/worker/dashboard" element={
        <ProtectedRoute>
          <RoleRoute role="WORKER">
            <WorkerDashboard />
          </RoleRoute>
        </ProtectedRoute>
      } />
      <Route path="/admin/dashboard" element={
        <ProtectedRoute>
          <RoleRoute role="ADMIN">
            <AdminDashboard />
          </RoleRoute>
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/booking/:id" element={
        <ProtectedRoute>
          <BookingDetails />
        </ProtectedRoute>
      } />

      <Route path="*" element={<div className="min-h-screen flex items-center justify-center font-bold text-slate-850 dark:text-slate-250">404 - Not Found</div>} />
    </Routes>
  );
}
