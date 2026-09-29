import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * ProtectedRoute — wraps routes that require authentication.
 * While auth is loading (on refresh) it shows a small loader so there's no
 * premature redirect to /login before the /auth/me check completes.
 * Once loading is done: authenticated → render child routes, guest → /login.
 * The current location is passed along so login can send the user back here.
 */
function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p className='page-loading'>Loading…</p>;

  return user ? (
    <Outlet />
  ) : (
    <Navigate to='/login' replace state={{ from: location }} />
  );
}

export default ProtectedRoute;
