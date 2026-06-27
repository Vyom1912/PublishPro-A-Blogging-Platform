import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import InputBox from "../../components/InputBox/InputBox";

function SignUp() {
  const { setUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/register", { name, email, password });
      setUser(res.data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex formBox">
      <h1>Create an account</h1>

      <form className="flex formContainer" onSubmit={handleSubmit}>
        <InputBox
          label="Name"
          type="text"
          id="signup-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
        />

        <InputBox
          label="Email"
          type="email"
          id="signup-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />

        <InputBox
          label="Password"
          type="password"
          id="signup-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Choose a strong password"
        />

        {error && <p style={{ color: "#c0392b", textAlign: "left" }}>{error}</p>}

        <button type="submit" className="inputBtn" disabled={loading}>
          {loading ? "Creating account…" : "Sign Up"}
        </button>
      </form>

      <p style={{ fontSize: "0.92rem", color: "var(--mid-dark)" }}>
        Already have an account?{" "}
        <Link
          to="/login"
          style={{ color: "var(--dark)", fontWeight: 600, textDecoration: "underline" }}>
          Login
        </Link>
      </p>
    </div>
  );
}

export default SignUp;
