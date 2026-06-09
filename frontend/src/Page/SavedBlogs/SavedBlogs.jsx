import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Card } from "../../components";

function SavedBlogs() {
  const [blogs, setBlogs] = useState([]);

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

      console.log(res.data); // <-- check this

      setSavedBlogs(res.data.blogs);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='container'>
      <h1>Saved Blogs</h1>

      <div className='profile-data'>
        {blogs.map((blog) => (
          <Card
            key={blog._id}
            id={blog._id}
            title={blog.title}
            imgSrc={blog.featuredImage}
          />
        ))}
      </div>
    </div>
  );
}

export default SavedBlogs;
