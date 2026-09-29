import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import InputBox from "../../components/InputBox/InputBox";
import "../Login/Login.css";

const MIN_PASSWORD_LENGTH = 8;

function SignUp() {
  const { setUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/register", { name, email, password });
      setUser(res.data.user);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex formBox login'>
      <h1>Create an account</h1>

      <form className='flex formContainer' onSubmit={handleSubmit}>
        <InputBox
          label='Name'
          id='signup-name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder='Your full name'
          autoComplete='name'
          required
        />

        <InputBox
          label='Email'
          type='email'
          id='signup-email'
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
          id='signup-password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Choose a strong password'
          autoComplete='new-password'
          required
        />
        <p className='field-hint'>At least {MIN_PASSWORD_LENGTH} characters.</p>

        {error && <p className='error-text'>{error}</p>}

        <button type='submit' className='inputBtn' disabled={loading}>
          {loading ? "Creating account…" : "Sign Up"}
        </button>
      </form>

      <p className='login-footer'>
        Already have an account?{" "}
        <Link to='/login' state={location.state}>
          Login
        </Link>
      </p>
    </div>
  );
}

export default SignUp;
