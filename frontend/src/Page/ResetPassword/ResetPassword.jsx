import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

function ResetPassword() {
  const { setUser } = useAuth();
  const { token } = useParams();

  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Submitting...");
      const { data } = await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        {
          password,
        },
      );
      setMessage(data.message);

      localStorage.removeItem("token");
      setUser(null);

      navigate("/login");
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Reset Password</h2>

      <input
        type='password'
        placeholder='New Password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type='submit'>Reset Password</button>

      {message && <p>{message}</p>}
    </form>
  );
}

export default ResetPassword;
