import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";
function Login() {
  const { setUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      setUser(res.data.user);
      navigate("/");
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  return (
    <div className='login flex'>
      <h1 className='text-3xl font-bold underline'>Login</h1>

      <form className='flex f-form' onSubmit={handleSubmit}>
        <div className='form-group'>
          <label for='email'> Email</label>
          <input
            type='email'
            id='email'
            value={email}
            name='email'
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Enter email......'
          />
        </div>
        <div className='form-group'>
          <label for='password'> Password</label>
          <input
            type='password'
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Enter password......'
          />
        </div>
        <button type='submit' className='save-btn'>
          Login
        </button>
      </form>
      <label htmlFor=''>
        Don't have an account?{" "}
        <Link to='/signup' className='text-blue-600 bold'>
          Sign up for Free
        </Link>
      </label>
    </div>
  );
}

export default Login;
