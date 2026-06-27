import { useState } from "react";
import api from "../../api/axios";
import { InputBox } from "../../components";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMessage(res.data.message);
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex formBox">
      <h1>Reset your password</h1>
      <p style={{ color: "var(--mid-dark)", textAlign: "left", width: "100%" }}>
        Enter your email and we&apos;ll send you a reset link.
      </p>

      <form className="flex formContainer" onSubmit={handleSubmit}>
        <InputBox
          label="Email"
          type="email"
          id="forgot-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />

        {message && (
          <p style={{ color: "var(--mid-dark)", textAlign: "left" }}>{message}</p>
        )}

        <button type="submit" className="inputBtn" disabled={loading}>
          {loading ? "Sending…" : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;
