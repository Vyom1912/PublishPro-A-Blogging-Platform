// import React from 'react'
import { Link } from "react-router-dom";
import Searchbox from "../Searchbox/Searchbox";
import "./Navbar.css";
function Navbar() {
  return (
    <nav className='navbar'>
      <Link to='/' className='navlink'>
        Home
      </Link>
      <Link to='/add-blog' className='navlink'>
        Add Blog
      </Link>
      <Link to='/login' className='navlink'>
        Login
      </Link>
      <Link to='/signup' className='navlink'>
        Signup
      </Link>
      <Link to='/logout' className='navlink'>
        Logout
      </Link>
      <Link to='/profile' className='navlink'>
        Profile
      </Link>
      <Searchbox />
    </nav>
  );
}

export default Navbar;
