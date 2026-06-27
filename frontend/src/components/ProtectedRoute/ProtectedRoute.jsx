import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * ProtectedRoute — wraps routes that require authentication.
 * While auth is loading (on refresh) it renders nothing so there's no
 * premature redirect to /login before the /auth/me check completes.
 * Once loading is done: authenticated → render child routes, guest → /login.
 */
function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) return null; // wait for session restore before deciding

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
