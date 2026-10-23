import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { disablePush } from "@/lib/push";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  const login = (data) => {
    const nextUser = {
      fullName: data.fullName,
      email: data.email,
      role: data.role,
      emailVerified: data.emailVerified,
      city: data.city ?? null,
      phone: data.phone ?? null,
    };

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(nextUser));

    setToken(data.token);
    setUser(nextUser);
  };

  // Merge changes into the signed-in user (e.g. after verifying the email address).
  const updateUser = useCallback((patch) => {
    setUser((current) => {
      if (!current) return current;
      const next = { ...current, ...patch };
      localStorage.setItem("user", JSON.stringify(next));
      return next;
    });
  }, []);

  const logout = () => {
    // This device stops getting the signed-out person's notifications (e.g. on a shared phone).
    disablePush(localStorage.getItem("token"));
    localStorage.clear();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        updateUser,
        logout,
        loading,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
