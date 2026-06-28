import { NavLink } from "react-router-dom";
import Searchbox from "../Searchbox/Searchbox";
import { useAuth } from "../../context/AuthContext";

import "./Navbar.css";

function Navbar() {
  const { user } = useAuth();

  return (
    <nav className='nav-box flex'>
      <div className='navbar flex'>
        <div className='logo'>
          <NavLink to='/'>PublishPro</NavLink>
        </div>

        <div className='nav-link-box flex'>
          <NavLink to='/' end className={({ isActive }) => `navlink${isActive ? " navlink-active" : ""}`}>
            Home
          </NavLink>

          {/* <NavLink to='/dashboard' className={({ isActive }) => `navlink${isActive ? " navlink-active" : ""}`}>
            Dashboar
          </NavLink> */}
          {user && (
            <NavLink to='/add-blog' className={({ isActive }) => `navlink${isActive ? " navlink-active" : ""}`}>
              Add Blog
            </NavLink>
          )}

          <Searchbox />

          {!user ? (
            <>
              <NavLink to='/login' className={({ isActive }) => `navlink${isActive ? " navlink-active" : ""}`}>
                Login
              </NavLink>

              <NavLink to='/signup' className={({ isActive }) => `navlink signup-btn${isActive ? " navlink-active" : ""}`}>
                Sign Up
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to='/profile' className={({ isActive }) => `navlink${isActive ? " navlink-active" : ""}`}>
                Profile
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
