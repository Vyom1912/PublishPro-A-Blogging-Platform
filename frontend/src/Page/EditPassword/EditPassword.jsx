import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./EditPassword.css";
import InputBox from "../../components/InputBox/InputBox";
import api from "../../api/axios";

const MIN_PASSWORD_LENGTH = 8;

function EditPassword() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (newPassword === currentPassword) {
      setError("The new password must be different from the current one");
      return;
    }

    setLoading(true);
    try {
      const res = await api.put("/users/change-password", {
        currentPassword,
        newPassword,
      });
      alert(res.data.message);
      await logout();
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex formBox edit-password'>
      <h2>Change Password</h2>

      <form className='flex formContainer' onSubmit={handleSubmit}>
        <InputBox
          label='Current Password'
          type='password'
          id='current-password'
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder='Your current password'
          autoComplete='current-password'
        />

        <InputBox
          label='New Password'
          type='password'
          id='new-password'
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
          autoComplete='new-password'
        />

        <InputBox
          label='Confirm Password'
          type='password'
          id='confirm-password'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder='Re-enter new password'
          autoComplete='new-password'
        />

        <div className='password-info'>
          <p>Your password must be at least {MIN_PASSWORD_LENGTH} characters long.</p>
          <p>Mixing upper and lowercase letters, numbers and symbols makes it stronger.</p>
          <p>You&apos;ll be signed out on all devices after changing it.</p>
        </div>

        {error && <p className='error-text'>{error}</p>}

        <button type='submit' className='inputBtn' disabled={loading}>
          {loading ? "Updating…" : "Update Password"}
        </button>
      </form>

      <p className='forgot-link'>
        <Link to='/forgot-password'>Forgot Password?</Link>
      </p>
    </div>
  );
}

export default EditPassword;
