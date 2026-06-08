import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const token = localStorage.getItem("token");

    // No token → not logged in, nothing to do
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await api.get("/auth/me");
      const u   = res.data.user;

      // Normalise: always expose both _id and id as strings
      setUser({
        ...u,
        _id: String(u._id),
        id:  String(u._id),
      });
    } catch (error) {
      const status = error?.response?.status;

      if (status === 401 || status === 403) {
        // Token is invalid or expired — clear it
        localStorage.removeItem("token");
        setUser(null);
      }
      // Any other failure (500, network offline, etc.) keeps the
      // token alive so the user doesn't get silently logged out
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    sessionStorage.clear();   // also clear view-dedup session keys
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
