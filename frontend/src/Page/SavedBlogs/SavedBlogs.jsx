import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Link } from "react-router-dom";
import { Card } from "../../components";

function SavedBlogs() {
  const [savedBlogs, setSavedBlogs] = useState([]);

  useEffect(() => {
    fetchSavedBlogs();
  }, []);

  const fetchSavedBlogs = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/users/saved-blogs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSavedBlogs(res.data.blogs);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='container'>
      <h1>Saved Blogs</h1>

      <div className='profile-data'>
        {savedBlogs.map((blog) => (
          <Link key={blog._id} to={`/blog/${blog._id}`} className='card-link'>
            <Card
              id={blog._id}
              title={blog.title}
              imgSrc={blog.featuredImage}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SavedBlogs;
