import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./EditPassword.css";
import { InputBox } from "../../components";
import api from "../../api/axios";

function EditPassword() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Calls PUT /api/users/change-password (or POST /api/auth/change-password)
      // both are wired up. Cookie is sent automatically.
      const res = await api.put("/users/change-password", {
        currentPassword,
        newPassword,
      });

      alert(res.data.message);

      // After a password change all sessions are invalidated on the server.
      // Log out locally too so the UI reflects the cleared state.
      await logout();
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className='formBox edit-password flex'>
      <h1 className='text-3xl font-bold underline'>Change Password</h1>

      <form className='flex formContainer' onSubmit={handleSubmit}>
        <InputBox
          label='Current Password'
          type='password'
          id='current-password'
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder='Enter current password...'
        />

        <InputBox
          label='New Password'
          type='password'
          id='new-password'
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder='Enter new password...'
        />

        <div className='password-info'>
          <p>Password must:</p>
          <ul>
            <li>Be at least 8 characters long</li>
            <li>Contain a number</li>
            <li>Include uppercase and lowercase letters</li>
          </ul>
        </div>
        <InputBox
          label='Confirm Password'
          type='password'
          id='confirm-password'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder='Re-enter new password...'
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type='submit' className='inputBtn'>
          Confirm
        </button>
      </form>
      <label htmlFor=' ' className='forgot-link'>
        <Link to='/forgot-password' className='text-blue-600 bold'>
          Forgot Password?
        </Link>
      </label>
    </div>
  );
}

export default EditPassword;
