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

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?",
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await api.delete(`/blogs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMyBlogs((prev) => prev.filter((blog) => blog._id !== id));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
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
                <p>{user.email || ""}</p>
              </div>
              <div className='p-info-data'>
                <label htmlFor=''>About: </label>

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
              Edit Password
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
              <div key={blog._id} className='my-blog-card flex'>
                <Card
                  id={blog._id}
                  title={blog.title}
                  imgSrc={blog.featuredImage}
                  content={blog.content}
                  author={user.name}
                />
                <div className='blog-actions flex'>
                  <Link to={`blog/${blog._id}`} className='blog-actions-btn'>
                    Open
                  </Link>
                  <Link
                    to={`/edit-blog/${blog._id}`}
                    className=' blog-actions-btn edit-btn'>
                    Edit
                  </Link>

                  <button
                    className='delete-btn blog-actions-btn'
                    onClick={() => handleDelete(blog._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
