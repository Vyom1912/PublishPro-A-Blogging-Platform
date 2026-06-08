import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { Card } from "../../components";
import "./SavedBlogs.css";

function SavedBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedBlogs();
  }, []);

  const fetchSavedBlogs = async () => {
    try {
      const res = await api.get("/users/saved-blogs");
      setBlogs(res.data.blogs);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="saved-loading">Loading saved blogs...</p>;

  return (
    <div className="saved-container">
      <h1 className="saved-title">Saved Blogs</h1>

      {blogs.length === 0 ? (
        <p className="saved-empty">You haven&apos;t saved any blogs yet.</p>
      ) : (
        <div className="saved-grid">
          {blogs.map((blog) => (
            <Link to={`/blog/${blog._id}`} key={blog._id} className="card-link">
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
  );
}

export default SavedBlogs;
