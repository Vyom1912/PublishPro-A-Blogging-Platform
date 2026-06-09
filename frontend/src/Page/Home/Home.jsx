import { useEffect, useState } from "react";
import { Card } from "../../components";
import api from "../../api/axios.js";
import "./Home.css";
import { Link } from "react-router-dom";
import { useSearch } from "../../context/SearchContext";
function Home() {
  const { searchQuery } = useSearch();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    if (searchQuery.trim()) {
      searchBlogs();
    } else {
      fetchBlogs();
    }
  }, [searchQuery]);

  const searchBlogs = async () => {
    try {
      const res = await api.get(`/blogs/search?query=${searchQuery}`);

      setBlogs(res.data.blogs);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchBlogs = async () => {
    try {
      const res = await api.get("/blogs");
      // console.log(res.data);
      console.log(Array.isArray(res.data.blogs));
      console.log(res.data.blogs);
      setBlogs(res.data.blogs);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='home-container'>
      <div className='home-blogs-box'>
        {blogs.length === 0 ? (
          <h2>No blogs found</h2>
        ) : (
          blogs.map((blog) => (
            <Link to={`blog/${blog._id}`} className='card-link'>
              <Card
                key={blog._id}
                id={blog._id}
                title={blog.title}
                imgSrc={blog.featuredImage}
                content={blog.content}
                author={blog.author?.name}
              />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
