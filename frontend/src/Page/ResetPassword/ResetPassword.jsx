import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { InputBox } from "../../components";
function ResetPassword() {
  const { setUser } = useAuth();
  const { token } = useParams();

  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await api.post(
        `/auth/reset-password/${token}`,
        { password },
      );
      setMessage(data.message);
      setUser(null);
      navigate("/login");
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className='login edit-password flex'>
      <h1 className='text-3xl font-bold underline'>Reset Password</h1>

      <form onSubmit={handleSubmit} className='flex f-form'>
        <InputBox
          label='Enter new Password'
          type='password'
          id='new-password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Enter new Password...'
        />
        <button type='submit' className='save-btn'>
          submit
        </button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}

export default ResetPassword;
