import { Link } from "react-router-dom";
import Searchbox from "../Searchbox/Searchbox";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import "./Navbar.css";

function Navbar() {
  const { user } = useAuth();
  const { dark, toggleTheme } = useTheme();

  return (
    <nav className="nav-box flex">
      <div className="navbar flex">
        <div className="logo">
          <Link to="/">PublishPro</Link>
        </div>

        <div className="nav-link-box flex">
          <Link to="/" className="navlink">
            Home
          </Link>

          {user && (
            <Link to="/add-blog" className="navlink">
              Add Blog
            </Link>
          )}

          <Searchbox />

          {/* Dark mode toggle */}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            title={dark ? "Switch to light mode" : "Switch to dark mode"}
            aria-label="Toggle dark mode"
          >
            {dark ? "☀️" : "🌙"}
          </button>

          {!user ? (
            <>
              <Link to="/login" className="navlink">
                Login
              </Link>
              <Link to="/signup" className="navlink signup-btn">
                Sign Up
              </Link>
            </>
          ) : (
            <Link to="/dashboard" className="navlink nav-avatar-link">
              <div className="nav-avatar">
                {user.image ? (
                  <img src={user.image} alt={user.name} />
                ) : (
                  <span>{user.name?.charAt(0).toUpperCase()}</span>
                )}
              </div>
              {user.name?.split(" ")[0]}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
