import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Link } from "react-router-dom";
import { Card } from "../../components";

function SavedBlogs() {
  const [savedBlogs, setSavedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedBlogs();
  }, []);

  const fetchSavedBlogs = async () => {
    try {
      const res = await api.get("/users/saved-blogs");
      setSavedBlogs(res.data.blogs);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className='container'>
      <h1>Saved Blogs</h1>

      {savedBlogs.length === 0 ? (
        <p>No saved blogs yet.</p>
      ) : (
        <div className='profile-data'>
          {savedBlogs.map((blog) => (
            <Link key={blog._id} to={`/blog/${blog._id}`} className='card-link'>
              <Card
                id={blog._id}
                title={blog.title}
                imgSrc={blog.featuredImage}
                content={blog.content}
                description={blog.description}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedBlogs;
