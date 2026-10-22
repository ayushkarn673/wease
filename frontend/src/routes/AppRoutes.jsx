import { Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Home from "../pages/Home";
import About from "../pages/About";
import Services from "../pages/Services";
import Contact from "../pages/Contact";
import NotFound from "../pages/NotFound";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import VerifyEmail from "../pages/auth/VerifyEmail";
import CompleteWorkerProfile from "../pages/auth/CompleteWorkerProfile";
import CustomerDashboard from "../pages/customer/Dashboard";
import Workers from "../pages/customer/Workers";
import WorkerDetails from "../pages/customer/WorkerDetails";
import MyBookings from "../pages/customer/MyBookings";
import BookingDetails from "../pages/customer/BookingDetails";
import CustomerProfile from "../pages/customer/Profile";
import WorkerDashboard from "../pages/worker/Dashboard";
import WorkerProfile from "../pages/worker/Profile";
import AdminDashboard from "../pages/admin/Dashboard";
import Firms from "../pages/firms/Firms";
import FirmDetails from "../pages/firms/FirmDetails";
import FirmDashboard from "../pages/firm/Dashboard";
import FirmProfile from "../pages/firm/Profile";
import CompleteFirmProfile from "../pages/auth/CompleteFirmProfile";
import CrewRequestDetails from "../pages/crew/CrewRequestDetails";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import { useAuth } from "../context/AuthContext";
import { homePathFor } from "@/lib/format";

function RoleShell({ role }) {
  return (
    <ProtectedRoute>
      <RoleRoute role={role}>
        <DashboardLayout />
      </RoleRoute>
    </ProtectedRoute>
  );
}

// The start page: the app itself, open to everyone. Professionals and admins go to their own dashboards.
function StartPage() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-brand-600" aria-label="Loading" />
      </div>
    );
  }
  if (user && user.role !== "CUSTOMER") return <Navigate to={homePathFor(user.role)} replace />;
  return <CustomerDashboard />;
}

function ProfileRedirect() {
  const { user } = useAuth();
  if (user?.role === "WORKER") return <Navigate to="/worker/profile" replace />;
  if (user?.role === "CUSTOMER") return <Navigate to="/customer/profile" replace />;
  if (user?.role === "FIRM") return <Navigate to="/firm/profile" replace />;
  return <Navigate to="/admin/dashboard" replace />;
}

// Older customer-only addresses now live at the shared ones.
function RedirectToWorkers() {
  const { search } = useLocation();
  return <Navigate to={`/workers${search}`} replace />;
}

function RedirectToWorker() {
  const { id } = useParams();
  return <Navigate to={`/workers/${id}`} replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* The app: browsing is open to everyone, booking asks the visitor to log in */}
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<StartPage />} />
        <Route path="/workers" element={<Workers />} />
        <Route path="/workers/:id" element={<WorkerDetails />} />
        <Route path="/firms" element={<Firms />} />
        <Route path="/firms/:id" element={<FirmDetails />} />
      </Route>

      {/* Marketing pages */}
      <Route path="/welcome" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      {/* Opened from links in emails; they work whether or not the visitor is signed in. */}
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route
        path="/complete-worker-profile"
        element={
          <ProtectedRoute>
            <RoleRoute role="WORKER">
              <CompleteWorkerProfile />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/complete-firm-profile"
        element={
          <ProtectedRoute>
            <RoleRoute role="FIRM">
              <CompleteFirmProfile />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* Customer app */}
      <Route path="/customer/dashboard" element={<Navigate to="/" replace />} />
      <Route path="/customer/workers" element={<RedirectToWorkers />} />
      <Route path="/customer/worker/:id" element={<RedirectToWorker />} />
      <Route element={<RoleShell role="CUSTOMER" />}>
        <Route path="/customer/bookings" element={<MyBookings />} />
        <Route path="/customer/profile" element={<CustomerProfile />} />
      </Route>

      {/* Worker app */}
      <Route element={<RoleShell role="WORKER" />}>
        <Route path="/worker/dashboard" element={<WorkerDashboard />} />
        <Route path="/worker/profile" element={<WorkerProfile />} />
      </Route>

      {/* Labour firm app */}
      <Route element={<RoleShell role="FIRM" />}>
        <Route path="/firm/dashboard" element={<FirmDashboard />} />
        <Route path="/firm/profile" element={<FirmProfile />} />
      </Route>

      {/* Admin */}
      <Route element={<RoleShell role="ADMIN" />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Route>

      {/* Shared signed-in pages (access is checked by the backend) */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/booking/:id" element={<BookingDetails />} />
        <Route path="/crew/:id" element={<CrewRequestDetails />} />
        <Route path="/profile" element={<ProfileRedirect />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
