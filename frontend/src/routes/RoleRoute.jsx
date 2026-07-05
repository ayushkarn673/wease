import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RoleRoute({ role, children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return user.role === role
    ? children
    : <Navigate to="/" replace />;
}
