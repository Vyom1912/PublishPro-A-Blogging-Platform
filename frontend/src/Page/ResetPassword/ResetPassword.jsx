import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { BackButton, InputBox } from "../../components";
import "./ResetPassword.css";
function ResetPassword() {
  const { setUser } = useAuth();
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post(`/auth/reset-password/${token}`, {
        password,
      });
      setMessage(data.message);
      setUser(null);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex formBox forgot-password-box'>
      <h1>Set new password</h1>

      <form className='flex formContainer' onSubmit={handleSubmit}>
        <InputBox
          label='New Password'
          type='password'
          id='reset-password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Enter new password'
        />
        <InputBox
          label='Confirm Password'
          type='password'
          id='reset-confirm'
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder='Re-enter new password'
        />

        {error && (
          <p style={{ color: "#c0392b", textAlign: "left" }}>{error}</p>
        )}
        {message && (
          <p style={{ color: "green", textAlign: "left" }}>{message}</p>
        )}

        <button type='submit' className='inputBtn' disabled={loading}>
          {loading ? "Saving…" : "Reset Password"}
        </button>
      </form>
      <BackButton />
    </div>
  );
}

export default ResetPassword;
