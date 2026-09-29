import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import InputBox from "../../components/InputBox/InputBox";
import "../ForgotPassword/ForgotPassword.css";

const MIN_PASSWORD_LENGTH = 8;

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
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post(`/auth/reset-password/${token}`, {
        password,
      });
      setMessage(`${data.message}. Taking you to login…`);
      setUser(null);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex formBox'>
      <h1>Set new password</h1>

      <form className='flex formContainer' onSubmit={handleSubmit}>
        <InputBox
          label='New Password'
          type='password'
          id='reset-password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
          autoComplete='new-password'
        />
        <InputBox
          label='Confirm Password'
          type='password'
          id='reset-confirm'
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder='Re-enter new password'
          autoComplete='new-password'
        />

        {error && <p className='error-text'>{error}</p>}
        {message && <p className='success-text'>{message}</p>}

        <button type='submit' className='inputBtn' disabled={loading || Boolean(message)}>
          {loading ? "Saving…" : "Reset Password"}
        </button>
      </form>

      <p className='form-footer-link'>
        <Link to='/forgot-password'>Link expired? Request a new one</Link>
      </p>
    </div>
  );
}

export default ResetPassword;
