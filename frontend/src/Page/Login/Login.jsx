import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";
import InputBox from "../../components/InputBox/InputBox";

function Login() {
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Send the user back to the page that asked them to log in
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      setUser(res.data.user);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex formBox login'>
      <h1>Welcome back</h1>

      <form className='flex formContainer' onSubmit={handleSubmit}>
        <InputBox
          label='Email'
          type='email'
          id='login-email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='you@example.com'
          autoComplete='email'
          inputMode='email'
          required
        />

        <InputBox
          label='Password'
          type='password'
          id='login-password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Enter your password'
          required
        />

        {error && <p className='error-text'>{error}</p>}

        <div className='forgot-password-link'>
          <Link to='/forgot-password'>Forgot password?</Link>
        </div>

        <button type='submit' className='inputBtn' disabled={loading}>
          {loading ? "Signing in…" : "Login"}
        </button>
      </form>

      <p className='login-footer'>
        Don&apos;t have an account?{" "}
        <Link to='/signup' state={location.state}>
          Sign up for free
        </Link>
      </p>
    </div>
  );
}

export default Login;
