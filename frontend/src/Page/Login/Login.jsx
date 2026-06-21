import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
// import "./Login.css";
import InputBox from "../../components/InputBox/InputBox";

function Login() {
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });

      // The server sets accessToken and refreshToken as httpOnly cookies.
      // We only store the non-sensitive user data in React state.
      // There is NO token in localStorage — the cookie is the credential.
      setUser(res.data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className='formBox flex'>
      <h1 className='text-3xl font-bold underline'>Login</h1>

      <form className='flex formContainer' onSubmit={handleSubmit}>
        <InputBox
          label='Email'
          type='email'
          id='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Enter email...'
        />

        <InputBox
          label='Password'
          type='password'
          id='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Enter password...'
        />

        {error && (
          <p className='error-msg' style={{ color: "red" }}>
            {error}
          </p>
        )}

        <label htmlFor=''>
          <Link to='/forgot-password'>Forgot Password?</Link>
        </label>

        <button type='submit' className='inputBtn'>
          Login
        </button>
      </form>

      <label htmlFor=''>
        Don&apos;t have an account?{" "}
        <Link to='/signup' className='text-blue-600 bold'>
          Sign up for Free
        </Link>
      </label>
    </div>
  );
}

export default Login;
