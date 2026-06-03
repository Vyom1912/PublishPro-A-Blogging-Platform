import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

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
    <div>
      <h1 className='text-3xl font-bold underline'>Login</h1>

      <form className='w-full max-w-sm' onSubmit={handleSubmit}>
        <div className='form-group'>
          <label for='email'> Email</label>
          <input
            type='email'
            id='email'
            value={email}
            name='email'
            onChange={(e) => setEmail(e.target.value)}
            className='form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
            placeholder='Enter email'
          />
        </div>
        <div className='form-group'>
          <label for='password'> Password</label>
          <input
            type='password'
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
            placeholder='Enter password'
          />
        </div>
        <button
          type='submit'
          className='px-6 py-2.5 bg-blue-600 text-white font-medium text-sm leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out'>
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
