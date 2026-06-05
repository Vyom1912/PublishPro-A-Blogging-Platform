import { useState } from "react";
import { Link } from "react-router-dom";
import "./EditPassword.css";
function EditPassword() {
  const [password, setPassword] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(password);
  };
  return (
    <div className='login edit-password flex'>
      <h1 className='text-3xl font-bold underline'>Change Password</h1>

      <form className='flex f-form' onSubmit={handleSubmit}>
        {/* <p>To continue, first verify it’s you</p> */}
        <div className='form-group'>
          <label for='password'>Current Password: </label>
          <input
            type='password'
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Enter cureent password......'
          />
        </div>
        <div className='form-group'>
          <label for='new-password'>New Password: </label>
          <input
            type='password'
            id='new-password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Enter new password......'
          />
        </div>
        <div className='password-info'>
          <p>Password must:</p>
          <ul>
            <li>Be at least 8 characters long</li>
            <li>Contain a number</li>
            <li>Include uppercase and lowercase letters</li>
          </ul>
        </div>
        <div className='form-group'>
          <label for='re-password'>Re-write new Password: </label>
          <input
            type='password'
            id='re-password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Re-write new password......'
          />
        </div>
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
