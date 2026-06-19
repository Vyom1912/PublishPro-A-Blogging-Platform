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
  const [showFullAbout, setShowFullAbout] = useState(false);

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
              <div className='p-info-data about-section'>
                <label>About:</label>

                <div
                  className={`about-content ${showFullAbout ? "expanded" : ""}`}>
                  <p>{user.about || "No description added."}</p>

                  {!showFullAbout && user.about?.length > 150 && (
                    <span className='about-ellipsis'>...</span>
                  )}
                </div>

                {user.about && user.about.length > 150 && (
                  <button
                    type='button'
                    className='about-btn'
                    onClick={() => setShowFullAbout(!showFullAbout)}>
                    {showFullAbout ? "Show Less ↑" : "Show More ↓"}
                  </button>
                )}
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
            <Link to='/edit-profile' className='inputBtn'>
              Edit Profile
            </Link>
            {/* <Link to='/saved-blogs' className='inputBtn'>
              Saved Blogs
            </Link> */}
            <Link to='/edit-password' className='inputBtn'>
              Edit Password
            </Link>
            <Link to='/login' className='inputBtn' onClick={handleLogout}>
              Logout
            </Link>
          </div>
        </div>

        <div className='profile-blog-box flex'>
          <div className='p-blog-btn flex'>
            <button
              onClick={() => setActiveBlogTab("myBlogs")}
              // className='inputBtn'
              className={`inputBtn ${activeBlogTab === "myBlogs" ? "inputBtnActive" : ""}`}>
              My Blogs
            </button>
            <button
              onClick={() => setActiveBlogTab("savedBlogs")}
              // className='inputBtn'
              className={`inputBtn ${activeBlogTab === "savedBlogs" ? "inputBtnActive" : ""}`}>
              Saved Blogs
            </button>
          </div>
          <div className='containerBox '>
            {activeBlogTab === "myBlogs" && (
              <div className='card-container '>
                {myblogs.map((blog) => (
                  <div key={blog._id}>
                    <Card
                      id={blog._id}
                      title={blog.title}
                      imgSrc={blog.featuredImage}
                      content={blog.content}
                      description={blog.description}
                    />
                    <div className='blogs-insight flex'>
                      <div className='blog-stats flex'>
                        <span>❤️{blog.likes?.length || 0}</span>
                        <span>👁️{blog.views || 0}</span>
                        <span>🔖{blog.savedBy?.length || 0}</span>
                      </div>
                      <div className='blog-actions flex'>
                        <Link to={`/blog/${blog._id}`} className='inputBtn'>
                          Open
                        </Link>
                        <Link
                          to={`/edit-blog/${blog._id}`}
                          className=' inputBtn '>
                          Edit
                        </Link>
                        <button
                          className=' inputBtn'
                          onClick={() => handleDelete(blog._id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeBlogTab === "savedBlogs" && (
              <div className='card-container '>
                {savedBlogs.map((blog) => (
                  <Link key={blog._id} to={`/blog/${blog._id}`}>
                    <Card
                      id={blog._id}
                      title={blog.title}
                      imgSrc={blog.featuredImage}
                      // content={blog.content}
                      // description={blog.description}
                    />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
