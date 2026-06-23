import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import "./SignUp.css";
import InputBox from "../../components/InputBox/InputBox";

function SignUp() {
  const { setUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // if (password.length < 8) {
    //   setError("Password must be at least 8 characters");
    //   return;
    // }

    try {
      const res = await api.post("/auth/register", { name, email, password });

      // Server sets httpOnly cookies on register — same as login flow
      setUser(res.data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className='formBox flex' style={{ marginTop: "40px" }}>
      <h1 className='text-3xl font-bold underline'>Sign Up</h1>

      <form className='flex formContainer' onSubmit={handleSubmit}>
        <InputBox
          label='Name'
          type='text'
          id='name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder='Enter Name...'
        />

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

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type='submit' className='inputBtn'>
          Sign Up
        </button>
      </form>
      <label>
        Already have an account?{" "}
        <Link to='/login' className='text-blue-600 bold'>
          Login
        </Link>
      </label>
    </div>
  );
}

export default SignUp;
