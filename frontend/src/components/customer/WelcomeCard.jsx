import { useAuth } from "../../context/AuthContext";

export default function WelcomeCard() {
  const { user } = useAuth();

  return (
    <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white shadow-lg shadow-blue-500/20">
      <h2 className="text-3xl font-bold">
        Welcome back, {user?.fullName}! 👋
      </h2>

      <p className="mt-3 text-blue-100 text-lg">
        Find trusted workers near you in just a few clicks.
      </p>
    </div>
  );
}
