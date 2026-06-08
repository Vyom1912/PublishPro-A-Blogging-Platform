import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "../Login/Login.css";

function ResetPassword() {
  const { token }   = useParams();
  const navigate    = useNavigate();

  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [showPw,    setShowPw]    = useState(false);
  const [showCf,    setShowCf]    = useState(false);
  const [msg,       setMsg]       = useState(null);
  const [loading,   setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);

    if (password.length < 8) {
      setMsg({ type: "error", text: "Password must be at least 8 characters." });
      return;
    }
    if (password !== confirm) {
      setMsg({ type: "error", text: "Passwords don't match." });
      return;
    }

    setLoading(true);
    try {
      const res = await api.post(`/auth/reset-password/${token}`, { password });
      setMsg({ type: "success", text: res.data.message || "Password reset! You can now log in." });
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.message || "Link expired or invalid." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card pg-card">
        <div className="auth-logo">PublishPro</div>
        <h1 className="auth-title">Set New Password</h1>
        <p className="auth-sub">Choose a strong password for your account.</p>

        <form className="pg-form" onSubmit={handleSubmit}>
          {/* New password */}
          <div className="form-field">
            <label htmlFor="rp-password">New Password</label>
            <div className="rp-input-row">
              <input
                id="rp-password"
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="rp-eye-btn"
                onClick={() => setShowPw((v) => !v)}
                tabIndex={-1}
              >
                {showPw ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Confirm password */}
          <div className="form-field">
            <label htmlFor="rp-confirm">Confirm Password</label>
            <div className="rp-input-row">
              <input
                id="rp-confirm"
                type={showCf ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat new password"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="rp-eye-btn"
                onClick={() => setShowCf((v) => !v)}
                tabIndex={-1}
              >
                {showCf ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Password strength hint */}
          <div className="rp-hint">
            Use at least 8 characters — mix of letters, numbers, and symbols.
          </div>

          {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={loading}
          >
            {loading ? "Saving…" : "Reset Password"}
          </button>
        </form>

        <p className="auth-switch">
          <Link to="/login">← Back to login</Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;
