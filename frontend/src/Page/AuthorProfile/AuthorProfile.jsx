import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";
import { Card } from "../../components";
import "./AuthorProfile.css";

function AuthorProfile() {
  const { userId } = useParams();
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    setLoading(true);
    api.get(`/blogs/author/${userId}`)
      .then((r) => setData(r.data))
      .catch(() => setError("Author not found."))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <div className="loading-center" style={{ minHeight: "60vh" }}>
        <div className="spinner" />
        <p>Loading author…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="loading-center" style={{ minHeight: "60vh" }}>
        <span style={{ fontSize: "3rem" }}>😕</span>
        <p>{error || "Something went wrong."}</p>
        <Link to="/" className="btn btn-primary btn-sm">Go Home</Link>
      </div>
    );
  }

  const { author, blogs, stats } = data;
  const joinedYear = new Date(author.createdAt).getFullYear();

  return (
    <div className="author-page">
      {/* ── Hero banner ── */}
      <div className="author-hero">
        <div className="author-avatar">
          {author.image ? (
            <img src={author.image} alt={author.name} />
          ) : (
            <span>{author.name?.charAt(0).toUpperCase()}</span>
          )}
        </div>

        <div className="author-info">
          <h1 className="author-name">{author.name}</h1>
          {author.about && <p className="author-bio">{author.about}</p>}
          <p className="author-joined">Member since {joinedYear}</p>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="author-stats">
        <div className="author-stat">
          <span className="author-stat-num">{stats.totalBlogs}</span>
          <span className="author-stat-label">Posts</span>
        </div>
        <div className="author-stat-divider" />
        <div className="author-stat">
          <span className="author-stat-num">{stats.totalLikes}</span>
          <span className="author-stat-label">Likes</span>
        </div>
        <div className="author-stat-divider" />
        <div className="author-stat">
          <span className="author-stat-num">{stats.totalViews}</span>
          <span className="author-stat-label">Views</span>
        </div>
      </div>

      {/* ── Blogs grid ── */}
      <div className="author-blogs-section">
        <h2 className="author-blogs-title">Posts by {author.name}</h2>

        {blogs.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📭</span>
            <p>No posts published yet.</p>
          </div>
        ) : (
          <div className="author-grid">
            {blogs.map((blog) => (
              <Link to={`/blog/${blog._id}`} key={blog._id} className="card-link">
                <Card id={blog._id} title={blog.title} imgSrc={blog.featuredImage} />
                <div className="author-card-meta">
                  <span>❤️ {blog.likes?.length ?? 0}</span>
                  <span>👁️ {blog.views ?? 0}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthorProfile;
