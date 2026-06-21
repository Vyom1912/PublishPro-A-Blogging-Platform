// import React from "react";

import { Link, useNavigate } from "react-router-dom";
import "./ProfileSlider.css";
function ProfileSlider({ user, activeTab, setActiveTab, logout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className='sidebar'>
      <div className='user-info'>
        {user.image ? (
          <img src={user.image} alt={user.name} />
        ) : (
          <div className='avatar-placeholder'>
            {user.name?.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className='user-info'>
        <p className=''>{user.name}</p>
      </div>
      {/* <div className='user-info'>
        <p>{user.email || ""}</p>
      </div> */}
      <div className='user-info-links'>
        <button className='inputBtn' onClick={() => setActiveTab("overview")}>
          Overview
        </button>
        <button className='inputBtn'>
          {" "}
          <Link to='/add-blog'>+ Add Blog</Link>
        </button>

        <button className='inputBtn' onClick={() => setActiveTab("myBlogs")}>
          My Blogs
        </button>

        <button className='inputBtn' onClick={() => setActiveTab("savedBlogs")}>
          Saved Blogs
        </button>

        <button
          className='inputBtn'
          onClick={() => setActiveTab("editProfile")}>
          Edit Profile
        </button>

        <button
          className='inputBtn'
          onClick={() => setActiveTab("editPassword")}>
          Edit Password
        </button>

        <button className='inputBtn' onClick={handleLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
}

export default ProfileSlider;
