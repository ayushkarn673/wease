import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { homePathFor } from "@/lib/format";

export default function RoleRoute({ role, children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Signed in with a different role: send them to their own home instead of the landing page.
  return user.role === role ? children : <Navigate to={homePathFor(user.role)} replace />;
}
