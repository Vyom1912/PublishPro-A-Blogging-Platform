import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import "../Login/Login.css";

function ForgotPassword() {
  const [email,   setEmail]   = useState("");
  const [msg,     setMsg]     = useState(null);   // { type: "success"|"error", text }
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMsg({ type: "success", text: res.data.message || "Reset link sent! Check your inbox." });
      setEmail("");
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.message || "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card pg-card">
        <div className="auth-logo">PublishPro</div>
        <h1 className="auth-title">Forgot Password</h1>
        <p className="auth-sub">
          Enter your email and we'll send you a reset link.
        </p>

        <form className="pg-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="fp-email">Email address</label>
            <input
              id="fp-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          {msg && (
            <div className={`alert alert-${msg.type}`}>{msg.text}</div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={loading}
          >
            {loading ? "Sending…" : "Send Reset Link"}
          </button>
        </form>

        <p className="auth-switch">
          Remembered it? <Link to="/login">Back to login →</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
