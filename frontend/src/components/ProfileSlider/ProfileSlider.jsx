import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaXmark } from "react-icons/fa6";
import { thumbUrl } from "../../utils/image";
import "./ProfileSlider.css";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "myBlogs", label: "My Blogs" },
  { id: "savedBlogs", label: "Saved Blogs" },
  { id: "editProfile", label: "Edit Profile" },
  { id: "editPassword", label: "Change Password" },
];

function ProfileSlider({ user, activeTab, setActiveTab, logout }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleTab = (tab) => {
    setActiveTab(tab);
    setMenuOpen(false); // close menu after selecting on mobile
  };

  const activeLabel = TABS.find((t) => t.id === activeTab)?.label;

  return (
    <aside className='sidebar'>
      <div className='sidebar-top-row flex'>
        {user.image ? (
          <img src={thumbUrl(user.image, 200)} alt={user.name} className='user-img' />
        ) : (
          <div className='avatar-placeholder flex'>
            {user.name?.charAt(0).toUpperCase()}
          </div>
        )}

        <div className='sidebar-name'>
          <p>{user.name}</p>
          {/* On phones the menu is collapsed, so show where the user is */}
          <span className='sidebar-current'>{activeLabel}</span>
        </div>

        <button
          type='button'
          className='sidebar-hamburger'
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close profile menu" : "Open profile menu"}
          aria-expanded={menuOpen}>
          {menuOpen ? <FaXmark /> : <FaBars />}
        </button>
      </div>

      <nav className={`user-info-links${menuOpen ? " links-open" : ""}`}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type='button'
            className={`inputBtn${activeTab === tab.id ? " inputBtnActive" : ""}`}
            aria-current={activeTab === tab.id ? "page" : undefined}
            onClick={() => handleTab(tab.id)}>
            {tab.label}
          </button>
        ))}
        <Link to='/add-blog' className='inputBtn'>
          + Write a Blog
        </Link>
        <button type='button' className='inputBtn sidebar-logout' onClick={handleLogout}>
          Logout
        </button>
      </nav>
    </aside>
  );
}

export default ProfileSlider;
