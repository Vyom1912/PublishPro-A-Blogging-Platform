import "./BlogDetails.css";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";
import { BackButton, Comments } from "../../components";
import { useAuth } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as farBookmark } from "@fortawesome/free-regular-svg-icons";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { addToReadingHistory } from "../Dashboard/Dashboard";

function BlogDetails() {
  const { user, loading: authLoading } = useAuth();
  const { id }   = useParams();

  const [blog, setBlog]           = useState(null);
  const [liked, setLiked]         = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);

  /* Fetch the blog once; the view count increments server-side on each GET */
  useEffect(() => {
    fetchBlog();
  }, [id]);

  /* Re-derive like/bookmark state whenever user or blog changes.
     Wait until auth is done loading — otherwise user is null for a
     split second and we reset liked/bookmarked to false incorrectly. */
  useEffect(() => {
    if (authLoading) return;   // auth still initialising, wait
    if (!blog) return;
    if (user) {
      const uid = user._id || user.id;
      setLiked(!!blog.likes?.some((l) => l.toString() === uid.toString()));
      fetchBookmarkStatus();
    } else {
      setLiked(false);
      setBookmarked(false);
    }
  }, [user, authLoading, blog]);

  const fetchBlog = async () => {
    try {
      const res = await api.get(`/blogs/${id}`);
      const data = res.data;
      setBlog(data);
      setLikesCount(data.likes?.length || 0);

      // Add to reading history for the Dashboard History tab
      addToReadingHistory(id);

      // Record this visit as a view — every visit counts
      // (sessionStorage dedup removed: same user re-watching = real view)
      api.post(`/blogs/${id}/view`)
        .then((r) => {
          // Reflect the updated count immediately in the UI
          setBlog((prev) => prev ? { ...prev, views: r.data.views } : prev);
        })
        .catch(() => {});
    } catch (e) { console.log(e); }
  };

  const handleLike = async () => {
    if (!user) { alert("Please log in to like blogs"); return; }
    try {
      const res = await api.put(`/blogs/${id}/like`, {});
      setLiked(res.data.liked);
      setLikesCount(res.data.likesCount);
    } catch (e) { console.log(e); }
  };

  const handleBookmark = async () => {
    if (!user) { alert("Please log in to save blogs"); return; }
    try {
      const res = await api.post(`/users/bookmark/${id}`, {});
      setBookmarked(res.data.bookmarked);
    } catch (e) { console.log(e); }
  };

  const fetchBookmarkStatus = async () => {
    try {
      const res = await api.get(`/users/bookmark-status/${id}`);
      setBookmarked(res.data.bookmarked);
    } catch (e) { console.log(e); }
  };

  if (!blog) {
    return (
      <div className="loading-center" style={{ minHeight: "60vh" }}>
        <div className="spinner" />
        <p>Loading…</p>
      </div>
    );
  }

  return (
    <article className="blog-container">
      <BackButton />

      {/* Featured image */}
      <div className="blog-hero-img">
        <img src={blog.featuredImage} alt={blog.title} />
      </div>

      {/* Title */}
      <h1 className="blog-title">{blog.title}</h1>

      {/* Meta row: author + date + views */}
      <div className="blog-meta">
        <Link to={`/author/${blog.author?._id}`} className="blog-author-link">
          <div className="blog-author-avatar">
            {blog.author?.image ? (
              <img src={blog.author.image} alt={blog.author.name} />
            ) : (
              <span>{blog.author?.name?.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <span>{blog.author?.name}</span>
        </Link>

        <span className="blog-meta-sep">·</span>
        <span className="blog-meta-item">
          {new Date(blog.createdAt).toLocaleDateString("en-US", {
            year: "numeric", month: "short", day: "numeric",
          })}
        </span>
        <span className="blog-meta-sep">·</span>
        <span className="blog-meta-item">👁️ {blog.views ?? 0} views</span>
      </div>

      {/* Action buttons */}
      <div className="blog-actions-row">
        <button
          className={`blog-action-btn${liked ? " active" : ""}`}
          onClick={handleLike}
          aria-label="Like"
        >
          <span>{liked ? "❤️" : "🤍"}</span>
          <span>{likesCount} {likesCount === 1 ? "Like" : "Likes"}</span>
        </button>

        <button
          className={`blog-action-btn${bookmarked ? " active" : ""}`}
          onClick={handleBookmark}
          aria-label={bookmarked ? "Remove bookmark" : "Save"}
        >
          <FontAwesomeIcon icon={bookmarked ? faBookmark : farBookmark} />
          <span>{bookmarked ? "Saved" : "Save"}</span>
        </button>
      </div>

      {/* Content */}
      <div className="blog-content">
        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
      </div>

      <Comments />
    </article>
  );
}

export default BlogDetails;
