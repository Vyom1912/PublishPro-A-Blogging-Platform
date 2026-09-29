import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import InputBox from "../../components/InputBox/InputBox";
import "./ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex formBox'>
      <h1>Reset your password</h1>
      <p className='form-intro'>
        Enter your email and we&apos;ll send you a reset link.
      </p>

      <form className='flex formContainer' onSubmit={handleSubmit}>
        <InputBox
          label='Email'
          type='email'
          id='forgot-email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='you@example.com'
          autoComplete='email'
          inputMode='email'
          required
        />

        {message && <p className='success-text'>{message}</p>}
        {error && <p className='error-text'>{error}</p>}

        <button type='submit' className='inputBtn' disabled={loading}>
          {loading ? "Sending…" : "Send Reset Link"}
        </button>
      </form>

      <p className='form-footer-link'>
        <Link to='/login'>← Back to login</Link>
      </p>
    </div>
  );
}

export default ForgotPassword;
