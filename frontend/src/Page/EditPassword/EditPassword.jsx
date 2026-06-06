import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./EditPassword.css";
import { InputBox } from "../../components";
import api from "../../api/axios";

function EditPassword() {
  const navigate = new useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await api.put(
        "/users/change-password",
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert(res.data.message);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      navigate("/profile");
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };
  return (
    <div className='login edit-password flex'>
      <h1 className='text-3xl font-bold underline'>Change Password</h1>

      <form className='flex f-form' onSubmit={handleSubmit}>
        <InputBox
          label='Current Password'
          type='password'
          id='current-password'
          value={currentPassword}
          onChange={setCurrentPassword}
          placeholder='Enter current password...'
        />
        <InputBox
          label='New Password'
          type='password'
          id='new-password'
          value={newPassword}
          onChange={setNewPassword}
          placeholder='Enter New password...'
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
          onChange={setConfirmPassword}
          placeholder='Re-Enter new password...'
        />

        <button type='submit' className='save-btn'>
          Confirm
        </button>
      </form>
      <label htmlFor=' ' className='forgot-link'>
        <Link to='/forgot-password' className='text-blue-600 bold '>
          Forgrt Password?
        </Link>
      </label>
    </div>
  );
}

export default EditPassword;
