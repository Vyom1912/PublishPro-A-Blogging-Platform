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
  const id = user?._id || user?.id;
  const navigate = useNavigate();
  // const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({
    totalBlogs: 0,
    totalLikes: 0,
    totalViews: 0,
    totalSaves: 0,
  });
  const [myblogs, setMyBlogs] = useState([]);
  const [savedBlogs, setSavedBlogs] = useState([]);
  const [activeBlogTab, setActiveBlogTab] = useState("myBlogs");
  useEffect(() => {
    if (user && id) {
      // fectchUserData();
      getMyBlogs();
      fetchSavedBlogs();
    }
  }, [user, id]);
  if (!user) {
    return <h2>Please Login</h2>;
  }
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  
  const fetchSavedBlogs = async () => {
    try {
      const res = await api.get("/users/saved-blogs");
      setSavedBlogs(res.data.blogs);
    } catch (error) {
      console.log(error);
    }
  };

  const getMyBlogs = async () => {
    try {
      const res = await api.get("/blogs/my-blogs");
      setMyBlogs(res.data.blogs);
      setStats(res.data.stats);
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
      await api.delete(`/blogs/${id}`);
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
              <div className='p-info-data flex'>
                <p>Total Blogs: {stats.totalBlogs}</p>
                <p>Total likes: {stats.totalLikes}</p>
                <p>Total views: {stats.totalViews}</p>
                <p>Total savedBy: {stats.totalSaves}</p>
              </div>
            </div>
            {/* <br /> */}
          </div>
          <div className='edit-prifile-links flex'>
            <Link to='/edit-profile' className='p-info-btn'>
              Edit Profile
            </Link>
            {/* <Link to='/saved-blogs' className='p-info-btn'>
              Saved Blogs
            </Link> */}
            <Link to='/edit-password' className='p-info-btn'>
              Edit Password
            </Link>
            <Link to='/login' className='p-info-btn' onClick={handleLogout}>
              Logout
            </Link>
          </div>
        </div>

        <div className='profile-data-box flex'>
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "25px",
            }}>
            {" "}
            <button
              onClick={() => setActiveBlogTab("myBlogs")}
              className='p-info-btn'
              style={
                activeBlogTab === "myBlogs"
                  ? {
                      background: "#810b38",
                      border: "1px solid #810b38",
                      transition: "all .3s ease",
                      color: "white",
                    }
                  : {
                      border: "1px solid #810b38",
                      transition: "all .3s ease",
                    }
              }>
              My Blogs
            </button>
            <button
              onClick={() => setActiveBlogTab("savedBlogs")}
              className='p-info-btn'
              style={
                activeBlogTab === "savedBlogs"
                  ? {
                      border: "1px solid #810b38",
                      background: "#810b38",
                      color: "white",
                      transition: "all .3s ease",
                    }
                  : {
                      border: "1px solid #810b38",
                      transition: "all .3s ease",
                    }
              }>
              Saved Blogs
            </button>
          </div>
          {activeBlogTab === "myBlogs" && (
            <label htmlFor=''> Your Blogs:</label>
          )}{" "}
          {activeBlogTab === "savedBlogs" && (
            <label htmlFor=''> Saved Blogs:</label>
          )}
          {activeBlogTab === "myBlogs" && (
            <div
              className='profile-data  '
              style={{
                transition: "all .3s ease in",
              }}>
              {myblogs.map((blog) => (
                <div key={blog._id} className='my-blog-card flex'>
                  <Card
                    id={blog._id}
                    title={blog.title}
                    imgSrc={blog.featuredImage}
                    content={blog.content}
                  />
                  <div className='blog-stats'>
                    <span>❤️ {blog.likes?.length || 0}</span>
                    <span>👁️ {blog.views || 0}</span>
                    <span>🔖 {blog.savedBy?.length || 0}</span>
                  </div>
                  <div className='blog-actions flex'>
                    <Link to={`/blog/${blog._id}`} className='blog-actions-btn'>
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
          )}
          {/* <label htmlFor=''> Saved Blogs: </label> */}
          {activeBlogTab === "savedBlogs" && (
            <div className='profile-data '>
              {savedBlogs.map((blog) => (
                <Link
                  key={blog._id}
                  to={`/blog/${blog._id}`}
                  className='card-link'>
                  <Card
                    id={blog._id}
                    title={blog.title}
                    imgSrc={blog.featuredImage}
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
