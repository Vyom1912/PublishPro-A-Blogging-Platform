import { useEffect, useState } from "react";
import { Card } from "../../components";
import api from "../../api/axios.js";
import "./Home.css";
import { Link } from "react-router-dom";
import { useSearch } from "../../context/SearchContext";
function Home() {
  const { searchQuery } = useSearch();
  const [blogs, setBlogs] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 8;

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
      setCurrentPage(1);
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

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;

  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  return (
    <div className='home-container'>
      <div className='home-blogs-box'>
        {blogs.length === 0 ? (
          <h2>No blogs found</h2>
        ) : (
          currentBlogs.map((blog) => (
            <Link to={`blog/${blog._id}`} key={blog._id} className='card-link'>
              <Card
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
      <div className='pagination'>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}>
          Previous
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={currentPage === index + 1 ? "active-page" : ""}
            onClick={() => setCurrentPage(index + 1)}>
            {index + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}

export default Home;
