import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Card } from "../../components";
import api from "../../api/axios";
// import blogs from "../../data/blogs";
// import { getBlogsByAuthor } from "./../../services/blogService";

import "./Profile.css";

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [myblogs, setMyBlogs] = useState([]);

  useEffect(() => {
    if (user) {
      getMyBlogs();
    }
  }, [user]);
  if (!user) {
    return <h2>Please Login</h2>;
  }
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const getMyBlogs = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/blogs/my-blogs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMyBlogs(res.data.blogs);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      {/* <h1 className='text-3xl font-bold'>Profile</h1> */}
      <div className='container profile'>
        <div className='p-box flex'>
          <div className='profile-info-box flex '>
            <div className='p-info-img flex'>
              {user.image ? (
                <img src={user.image} alt={user.name} />
              ) : (
                <div className='avatar-placeholder'>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className='p-info flex'>
              <p className='p-info-name'>{user.name}</p>
              <div className='p-info-data'>
                {/* <input
                  type='email'
                  value={user.email || ""}
                  placeholder='Email'
                  readOnly
                /> */}
                <p>{user.email || ""}</p>
              </div>
              <div className='p-info-data'>
                <label htmlFor=''>About: </label>
                {/* <textarea
                  name='about'
                  id='about'
                  value={user.about || ""}
                  placeholder='About'
                  readOnly
                /> */}
                <p>{user.about || ""}</p>
              </div>
            </div>
            {/* <br /> */}
          </div>
          <div className='edit-prifile-links flex'>
            <Link to='/edit-profile' className='p-info-btn'>
              Edit Profile
            </Link>
            <Link to='/edit-password' className='p-info-btn'>
              Forgot Password
            </Link>
            <Link to='/login' className='p-info-btn' onClick={handleLogout}>
              {/* <button onClick={handleLogout} className='logout-btn navlink'> */}
              Logout
              {/* </button> */}
            </Link>
          </div>
        </div>

        <div className='profile-data-box flex'>
          <label htmlFor=''> Your Blogs: </label>
          <div className='profile-data '>
            {myblogs.map((blog) => (
              <Card
                key={blog._id}
                id={blog._id}
                title={blog.title}
                imgSrc={blog.featuredImage}
                content={blog.content}
                author={user.name}
              />
            ))}
          </div>
          {/* <Card
            id='1'
            title='website analytics'
            imgSrc='https://picsum.photos/300/200'
          />
          <Card
            id='2'
            title='My Blogs'
            imgSrc='https://picsum.photos/300/200'
          />

          <Card
            id='3'
            title='website analytics'
            imgSrc='https://picsum.photos/300/200'
          /> */}
        </div>
      </div>
    </div>
  );
}

export default Profile;
