import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app mount, try to restore the session.
  // The accessToken cookie is sent automatically (withCredentials).
  // If it's expired, the axios interceptor will silently refresh it first.
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const res = await api.get("/auth/me");

      // Normalise the user object so both user.id and user._id work.
      // The backend returns _id; we expose id as an alias for convenience.
      setUser({
        ...res.data.user,
        id: res.data.user._id,
      });
    } catch (error) {
      // 401 means no valid session — just clear state, no need to log
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Tell the server to delete the Session document and clear cookies.
      // This is important — without it the refresh token stays valid on
      // the server even after the user "logs out" on the client.
      await api.post("/auth/logout");
    } catch (_) {
      // If the request fails (e.g. already logged out), just continue
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
