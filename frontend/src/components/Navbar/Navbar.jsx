import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaXmark,
  FaHouse,
  FaPenToSquare,
  FaUser,
  FaBookmark,
  FaArrowRightFromBracket,
  FaChevronDown,
} from "react-icons/fa6";
import Searchbox from "../Searchbox/Searchbox";
import { useAuth } from "../../context/AuthContext";
import { thumbUrl } from "../../utils/image";

import "./Navbar.css";

const linkClass = ({ isActive }) => `navlink${isActive ? " navlink-active" : ""}`;
const panelLinkClass = ({ isActive }) =>
  `panel-link${isActive ? " panel-link-active" : ""}`;

function Avatar({ user, size = "sm" }) {
  return user.image ? (
    <img src={thumbUrl(user.image, 96)} alt='' className={`nav-avatar nav-avatar-${size}`} />
  ) : (
    <span className={`nav-avatar nav-avatar-${size} nav-avatar-letter`}>
      {user.name?.charAt(0).toUpperCase()}
    </span>
  );
}

function Navbar() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false); // phone panel
  const [userMenuOpen, setUserMenuOpen] = useState(false); // desktop dropdown
  const [scrolled, setScrolled] = useState(false);

  const navRef = useRef(null);
  const userMenuRef = useRef(null);

  const closeMenus = () => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  };

  // Slight shadow once the page is scrolled, so the bar lifts off the content
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Tap outside / Escape closes whichever menu is open
  useEffect(() => {
    if (!menuOpen && !userMenuOpen) return;

    const handlePointer = (e) => {
      if (menuOpen && !navRef.current?.contains(e.target)) setMenuOpen(false);
      if (userMenuOpen && !userMenuRef.current?.contains(e.target)) setUserMenuOpen(false);
    };
    const handleKey = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [menuOpen, userMenuOpen]);

  const handleLogout = async () => {
    closeMenus();
    await logout();
    navigate("/");
  };

  const firstName = user?.name?.split(" ")[0];

  return (
    <header className={`nav-box${scrolled ? " nav-scrolled" : ""}`} ref={navRef}>
      <nav className='navbar' aria-label='Main'>
        <Link to='/' className='logo' onClick={closeMenus} aria-label='PublishPro home'>
          <span className='logo-mark' aria-hidden='true'>
            P
          </span>
          <span className='logo-text'>
            Publish<span>Pro</span>
          </span>
        </Link>

        <div className='nav-search' onFocus={closeMenus}>
          <Searchbox />
        </div>

        {/* ── Tablet / desktop actions ── */}
        <div className='nav-actions'>
          <NavLink to='/' end className={linkClass}>
            Home
          </NavLink>

          {/* Nothing auth-related until we know who the user is — avoids
              flashing "Login" for someone who is already signed in */}
          {loading ? (
            <span className='nav-auth-placeholder' />
          ) : user ? (
            <>
              <NavLink to='/add-blog' className='nav-write-btn'>
                <FaPenToSquare aria-hidden='true' />
                Write
              </NavLink>

              <div className='user-menu' ref={userMenuRef}>
                <button
                  type='button'
                  className={`user-menu-btn${userMenuOpen ? " open" : ""}`}
                  onClick={() => setUserMenuOpen((open) => !open)}
                  aria-haspopup='menu'
                  aria-expanded={userMenuOpen}>
                  <Avatar user={user} />
                  <span className='user-menu-name'>{firstName}</span>
                  <FaChevronDown className='user-menu-caret' aria-hidden='true' />
                </button>

                {userMenuOpen && (
                  <div className='user-dropdown' role='menu' onClick={() => setUserMenuOpen(false)}>
                    <div className='dropdown-head'>
                      <strong>{user.name}</strong>
                      <span>{user.email}</span>
                    </div>
                    <Link to='/profile' role='menuitem'>
                      <FaUser aria-hidden='true' /> My profile
                    </Link>
                    <Link to='/saved-blogs' role='menuitem'>
                      <FaBookmark aria-hidden='true' /> Saved blogs
                    </Link>
                    <Link to='/add-blog' role='menuitem'>
                      <FaPenToSquare aria-hidden='true' /> Write a blog
                    </Link>
                    <button type='button' role='menuitem' className='dropdown-logout' onClick={handleLogout}>
                      <FaArrowRightFromBracket aria-hidden='true' /> Log out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <NavLink to='/login' className={linkClass}>
                Log in
              </NavLink>
              <Link to='/signup' className='nav-signup-btn'>
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* ── Phone menu button ── */}
        <button
          type='button'
          className={`nav-toggle${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls='nav-panel'>
          {!menuOpen && user ? <Avatar user={user} /> : menuOpen ? <FaXmark /> : <FaBars />}
        </button>
      </nav>

      {/* ── Phone menu panel ── */}
      <div
        id='nav-panel'
        className={`nav-panel${menuOpen ? " nav-panel-open" : ""}`}
        // Any link tapped inside the panel closes it
        onClick={(e) => e.target.closest("a") && setMenuOpen(false)}>
        {user && (
          <Link to='/profile' className='panel-user'>
            <Avatar user={user} size='md' />
            <span className='panel-user-text'>
              <strong>{user.name}</strong>
              <span>View your profile</span>
            </span>
          </Link>
        )}

        <NavLink to='/' end className={panelLinkClass}>
          <FaHouse aria-hidden='true' /> Home
        </NavLink>

        {user ? (
          <>
            <NavLink to='/add-blog' className={panelLinkClass}>
              <FaPenToSquare aria-hidden='true' /> Write a blog
            </NavLink>
            <NavLink to='/profile' className={panelLinkClass}>
              <FaUser aria-hidden='true' /> My profile
            </NavLink>
            <NavLink to='/saved-blogs' className={panelLinkClass}>
              <FaBookmark aria-hidden='true' /> Saved blogs
            </NavLink>
            <button type='button' className='panel-link panel-logout' onClick={handleLogout}>
              <FaArrowRightFromBracket aria-hidden='true' /> Log out
            </button>
          </>
        ) : (
          !loading && (
            <div className='panel-auth'>
              <Link to='/login' className='panel-auth-btn'>
                Log in
              </Link>
              <Link to='/signup' className='panel-auth-btn panel-auth-primary'>
                Sign up
              </Link>
            </div>
          )
        )}
      </div>
    </header>
  );
}

export default Navbar;
