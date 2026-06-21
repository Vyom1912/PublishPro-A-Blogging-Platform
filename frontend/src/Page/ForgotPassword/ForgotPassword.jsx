import { useState } from "react";
import api from "../../api/axios";
import "./ForgotPassword.css";
import { InputBox } from "../../components";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("clicked");
    try {
      const res = await api.post("/auth/forgot-password", {
        email,
      });

      alert(res.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='formBox edit-password flex'>
      <h1 className='text-3xl font-bold underline'>
        Send Request to Email for Reset Password
      </h1>

      <form onSubmit={handleSubmit} className='flex formContainer'>
        <InputBox
          label='Enter Email'
          type='text'
          // id='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Enter Email...'
        />
        <button type='submit' className='inputBtn'>
          Send Reset Link
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;
