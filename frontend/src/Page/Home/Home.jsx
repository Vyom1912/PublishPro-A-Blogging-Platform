import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../../components";
import api from "../../api/axios.js";
import { useSearch } from "../../context/SearchContext";
import "./Home.css";

const PAGE_SIZE = 12;

function Home() {
  const { searchQuery } = useSearch();

  const [blogs, setBlogs]           = useState([]);
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]       = useState(true);

  /* Reset to page 1 whenever search changes */
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  useEffect(() => {
    if (searchQuery.trim()) {
      searchBlogs();
    } else {
      fetchBlogs(page);
    }
  }, [searchQuery, page]);

  const fetchBlogs = async (p = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/blogs?page=${p}&limit=${PAGE_SIZE}`);
      setBlogs(res.data.blogs);
      setTotalPages(res.data.totalPages || 1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const searchBlogs = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/blogs/search?query=${encodeURIComponent(searchQuery)}`);
      setBlogs(res.data.blogs);
      setTotalPages(1);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      {/* Grid */}
      <div className="home-blogs-box">
        {loading ? (
          <div className="home-empty">
            <div className="spinner" style={{ margin: "0 auto 12px" }} />
            <p>Loading blogs…</p>
          </div>
        ) : blogs.length === 0 ? (
          <p className="home-empty">No blogs found.</p>
        ) : (
          blogs.map((blog) => (
            <Link to={`/blog/${blog._id}`} key={blog._id} className="card-link">
              <Card
                id={blog._id}
                title={blog.title}
                imgSrc={blog.featuredImage}
              />
            </Link>
          ))
        )}
      </div>

      {/* Pagination – only shown when not searching */}
      {!searchQuery.trim() && totalPages > 1 && (
        <div className="home-pagination">
          <button
            className="page-btn"
            onClick={() => setPage((p) => p - 1)}
            disabled={page <= 1}
          >
            ← Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              className={`page-btn${n === page ? " active" : ""}`}
              onClick={() => setPage(n)}
            >
              {n}
            </button>
          ))}

          <button
            className="page-btn"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= totalPages}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;
