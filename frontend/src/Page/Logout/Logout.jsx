import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Logout() {
  const navigate    = useNavigate();
  const { logout }  = useAuth();

  useEffect(() => {
    // Clear auth token and user state via the shared logout helper
    logout();
    // Also clear sessionStorage so view-dedup keys don't linger
    sessionStorage.clear();
    navigate("/login", { replace: true });
  }, []);

  return null;
}

export default Logout;
