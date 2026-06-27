import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * PublicOnlyRoute — wraps routes that should NOT be accessible when
 * the user is already logged in (login, signup).
 * Redirects authenticated users to home instead.
 */
function PublicOnlyRoute() {
  const { user, loading } = useAuth();

  if (loading) return null; // wait for session restore

  return user ? <Navigate to="/" replace /> : <Outlet />;
}

export default PublicOnlyRoute;
