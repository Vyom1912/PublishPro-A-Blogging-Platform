import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Card, { CardSkeleton } from "../../components/Card/Card";
import Pagination from "../../components/Pagination/Pagination";
import api from "../../api/axios.js";
import { useSearch } from "../../context/SearchContext";
import "./Home.css";

const BLOGS_PER_PAGE = 8;

function Home() {
  const { searchQuery, clearSearch } = useSearch();
  // The page lives in the URL (?page=2) so refresh / back keep your place.
  // Typing in the search box resets it to page 1 (see Searchbox).
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Math.max(Number(searchParams.get("page")) || 1, 1);

  const [blogs, setBlogs] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const topRef = useRef(null);

  useEffect(() => {
    // Ignore responses that arrive after the user has already moved on
    // (typed another letter, changed page) so old results never flash in.
    let ignore = false;

    const fetchBlogs = async () => {
      setLoading(true);
      setError("");
      try {
        const params = { page: currentPage, limit: BLOGS_PER_PAGE };
        const res = searchQuery
          ? await api.get("/blogs/search", { params: { ...params, query: searchQuery } })
          : await api.get("/blogs", { params });

        if (ignore) return;
        setBlogs(res.data.blogs);
        setTotalPages(res.data.totalPages || 0);
        setTotal(res.data.total || 0);
      } catch (err) {
        if (ignore) return;
        console.error(err);
        setError("We couldn't load the blogs. The server may be waking up — please try again in a moment.");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchBlogs();
    return () => {
      ignore = true;
    };
  }, [searchQuery, currentPage, reloadKey]);

  const goToPage = (page) => {
    setSearchParams(page > 1 ? { page: String(page) } : {});
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className='containerBox home' ref={topRef}>
      {searchQuery && (
        <div className='search-summary flex'>
          <p>
            {loading
              ? "Searching…"
              : `${total} result${total === 1 ? "" : "s"} for "${searchQuery}"`}
          </p>
          <button type='button' className='inputBtn' onClick={clearSearch}>
            Clear search
          </button>
        </div>
      )}

      <div className='card-container'>
        {loading ? (
          Array.from({ length: 4 }, (_, i) => <CardSkeleton key={i} />)
        ) : error ? (
          <div className='empty-state'>
            <p>{error}</p>
            <button
              type='button'
              className='inputBtn retry-btn'
              onClick={() => setReloadKey((k) => k + 1)}>
              Try again
            </button>
          </div>
        ) : blogs.length === 0 ? (
          <div className='empty-state'>
            <h2>No blogs found</h2>
            <p>
              {searchQuery
                ? "Try a different title, tag, category or author name."
                : "Nothing has been published yet."}
            </p>
          </div>
        ) : (
          blogs.map((blog) => (
            <Link to={`/blog/${blog._id}`} key={blog._id} className='card-link'>
              <Card
                title={blog.title}
                imgSrc={blog.featuredImage}
                description={blog.description}
                author={blog.author?.name}
              />
            </Link>
          ))
        )}
      </div>

      {!loading && !error && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
      )}
    </div>
  );
}

export default Home;
