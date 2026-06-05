import { Link } from "react-router-dom";
import Searchbox from "../Searchbox/Searchbox";
import { useAuth } from "../../context/AuthContext";

import "./Navbar.css";

function Navbar() {
  const { user } = useAuth();

  return (
    <nav className='nav-box flex'>
      <div className='navbar flex'>
        <div className='logo'>
          <Link to='/'>PublishPro</Link>
        </div>

        <div className='nav-link-box flex'>
          <Link to='/' className='navlink'>
            Home
          </Link>

          {user && (
            <Link to='/add-blog' className='navlink'>
              Add Blog
            </Link>
          )}

          <Searchbox />

          {!user ? (
            <>
              <Link to='/login' className='navlink'>
                Login
              </Link>

              <Link to='/signup' className='navlink signup-btn'>
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link to='/profile' className='navlink'>
                Profile
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
