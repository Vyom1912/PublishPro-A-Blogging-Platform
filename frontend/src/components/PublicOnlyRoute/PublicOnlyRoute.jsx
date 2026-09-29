import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * PublicOnlyRoute — wraps routes that should NOT be accessible when
 * the user is already logged in (login, signup).
 * Redirects authenticated users to where they came from, or home.
 */
function PublicOnlyRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p className='page-loading'>Loading…</p>;

  const from = location.state?.from?.pathname || "/";

  return user ? <Navigate to={from} replace /> : <Outlet />;
}

export default PublicOnlyRoute;
