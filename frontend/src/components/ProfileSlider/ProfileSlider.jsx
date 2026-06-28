import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ProfileSlider.css";

function ProfileSlider({ user, activeTab, setActiveTab, logout }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleTab = (tab) => {
    setActiveTab(tab);
    setMenuOpen(false); // close menu after selecting on mobile
  };

  return (
    <aside className='sidebar flex'>
      <div className='user-info flex'>
        {user.image ? (
          <img src={user.image} alt={user.name} className='user-img' />
        ) : (
          <div className='avatar-placeholder flex'>
            {user.name?.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Name + hamburger row */}
      <div className='user-info sidebar-top-row flex'>
        <p>{user.name}</p>

        <button
          className='sidebar-hamburger'
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label='Toggle menu'>
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      <div className={`user-info-links flex ${menuOpen ? "links-open" : ""}`}>
        <button className={`inputBtn ${activeTab === "overview" ? "inputBtnActive" : ""}`} onClick={() => handleTab("overview")}>
          Overview
        </button>
        <button className='inputBtn'>
          <Link to='/add-blog' onClick={() => setMenuOpen(false)}>
            + Add Blog
          </Link>
        </button>
        <button className={`inputBtn ${activeTab === "myBlogs" ? "inputBtnActive" : ""}`} onClick={() => handleTab("myBlogs")}>
          My Blogs
        </button>
        <button className={`inputBtn ${activeTab === "savedBlogs" ? "inputBtnActive" : ""}`} onClick={() => handleTab("savedBlogs")}>
          Saved Blogs
        </button>
        <button className={`inputBtn ${activeTab === "editProfile" ? "inputBtnActive" : ""}`} onClick={() => handleTab("editProfile")}>
          Edit Profile
        </button>
        <button className={`inputBtn ${activeTab === "editPassword" ? "inputBtnActive" : ""}`} onClick={() => handleTab("editPassword")}>
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
