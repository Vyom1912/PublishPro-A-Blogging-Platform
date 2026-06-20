import { useState } from "react";
import { BlogCardList } from "../index.js";
import "./UserOverview.css";

function UserOverview({ author, stats, blogs = [], isOwner, onViewAll }) {
  const [showFullAbout, setShowFullAbout] = useState(false);
  const latestBlogs = blogs.slice(0, 3);
  const aboutText = author.about || "";
  const isLongAbout = aboutText.length > 150;

  return (
    <div className="user-overview">
      {/* Author header card */}
      <div className="uo-header">
        <div className="uo-avatar-wrap">
          {author.image ? (
            <img
              src={author.image}
              alt={author.name}
              className="uo-avatar"
            />
          ) : (
            <div className="uo-avatar-placeholder">
              {author.name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="uo-identity">
          <h2 className="uo-name">{author.name}</h2>
          {isOwner && <p className="uo-email">{author.email}</p>}
          {author.createdAt && (
            <p className="uo-joined">
              Joined{" "}
              {new Date(author.createdAt).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>
          )}
        </div>
      </div>

      {/* About section */}
      {aboutText && (
        <div className="uo-about">
          <label className="uo-label">About</label>
          <p className={`uo-about-text ${showFullAbout ? "expanded" : ""}`}>
            {showFullAbout || !isLongAbout
              ? aboutText
              : aboutText.slice(0, 150) + "..."}
          </p>
          {isLongAbout && (
            <button
              className="uo-toggle-btn"
              onClick={() => setShowFullAbout(!showFullAbout)}
            >
              {showFullAbout ? "Show Less ↑" : "Show More ↓"}
            </button>
          )}
        </div>
      )}

      {/* Stats row */}
      <div className="uo-stats">
        <div className="uo-stat-item">
          <span className="uo-stat-value">{stats.totalBlogs}</span>
          <span className="uo-stat-label">Blogs</span>
        </div>
        <div className="uo-stat-item">
          <span className="uo-stat-value">{stats.totalLikes}</span>
          <span className="uo-stat-label">Likes</span>
        </div>
        <div className="uo-stat-item">
          <span className="uo-stat-value">{stats.totalViews}</span>
          <span className="uo-stat-label">Views</span>
        </div>
        <div className="uo-stat-item">
          <span className="uo-stat-value">{stats.totalSaves}</span>
          <span className="uo-stat-label">Saves</span>
        </div>
      </div>

      {/* Latest blogs preview */}
      {latestBlogs.length > 0 && (
        <div className="uo-latest-blogs">
          <h3 className="uo-section-title">Latest Blogs</h3>
          <BlogCardList blogs={latestBlogs} showActions={false} />
          {blogs.length > 3 && (
            <button className="uo-view-all-btn" onClick={onViewAll}>
              View All {blogs.length} Blogs →
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default UserOverview;
