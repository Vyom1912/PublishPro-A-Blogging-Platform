import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Logout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const doLogout = async () => {
      // logout() in AuthContext calls POST /api/auth/logout which:
      //   1. Deletes the Session document from MongoDB (invalidates refresh token)
      //   2. Clears the httpOnly cookies on the server
      //   3. Sets user state to null locally
      await logout();
      navigate("/login");
    };

    doLogout();
  }, []);

  return null;
}

export default Logout;
