import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Logout() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    localStorage.removeItem("token");
    setUser(null);

    navigate("/login");
  }, []);

  return null;
}

export default Logout;
