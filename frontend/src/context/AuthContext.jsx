import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

// ---------------------------------------------------------------------------
// normaliseUser — ensures user.id and user._id are always the same string.
// Login/register return { id } without _id.
// getMe returns the full Mongoose doc which has _id but id may be missing.
// This function covers all cases so the rest of the app can use either field.
// ---------------------------------------------------------------------------
export const normaliseUser = (raw) => {
  if (!raw) return null;
  const id = String(raw._id || raw.id);
  return { ...raw, _id: id, id };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(normaliseUser(res.data.user));
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (_) {}
    setUser(null);
  };

  // Block rendering until the session restore check is complete.
  // This prevents protected pages from briefly flashing or redirecting
  // to /login on a page refresh before /auth/me has responded.
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          fontSize: "1.2rem",
          color: "#555",
        }}>
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser: (raw) => setUser(normaliseUser(raw)),
        loading,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
