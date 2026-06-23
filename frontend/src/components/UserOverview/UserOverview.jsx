import { useState, useRef } from "react";
import { BackButton, BlogCardList } from "../index.js";
import "./UserOverview.css";

function UserOverview({ author, stats, blogs = [], isOwner, onViewAll }) {
  const [showAll, setShowAll] = useState(false);
  const blogsRef = useRef(null);

  const displayedBlogs = showAll ? blogs : blogs.slice(0, 3);
  const aboutText = author.about || "";

  const handleViewAll = () => {
    setShowAll(true);
    // Call the parent's onViewAll if provided (e.g. profile tab switch)
    onViewAll?.();
    // Scroll the blogs section into view smoothly
    setTimeout(() => {
      blogsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  return (
    <div className='user-overview flex'>
      {/* Header */}
      <div className='uo-header flex'>
        <div className='uo-avatar-wrap'>
          {!isOwner &&
            (author.image ? (
              <img src={author.image} alt={author.name} className='uo-avatar' />
            ) : (
              <div className='uo-avatar-placeholder flex'>
                {author.name?.charAt(0).toUpperCase()}
              </div>
            ))}
        </div>
        {!isOwner && (
          <div className='uo-identity flex'>
            <h2 className='uo-name'>{author.name}</h2>
            <p className='uo-info'>{author.email}</p>
            {author.createdAt && (
              <p className='uo-info'>
                Joined{" "}
                {new Date(author.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            )}
          </div>
        )}
      </div>

      {/* About */}
      {aboutText && (
        <div className='uo-item uo-bg flex'>
          <label className='lableTitle'>About</label>
          <p className='uo-text'>{aboutText}</p>
        </div>
      )}

      {/* Stats */}
      {isOwner && (
        <div className='uo-stats flex'>
          <div className='uo-stat-item flex'>
            <span className='uo-stat-value'>{stats.totalBlogs}</span>
            <span className='uo-stat-label'>Blogs</span>
          </div>
          <div className='uo-stat-item flex'>
            <span className='uo-stat-value'>{stats.totalLikes}</span>
            <span className='uo-stat-label'>Likes</span>
          </div>
          <div className='uo-stat-item flex'>
            <span className='uo-stat-value'>{stats.totalViews}</span>
            <span className='uo-stat-label'>Views</span>
          </div>
          <div className='uo-stat-item flex'>
            <span className='uo-stat-value'>{stats.totalSaves}</span>
            <span className='uo-stat-label'>Saves</span>
          </div>
        </div>
      )}

      {/* Blogs section */}
      {displayedBlogs.length > 0 && (
        <div className='uo-item flex' ref={blogsRef}>
          <h3 className='lableTitle'>
            {showAll ? `All Blogs (${blogs.length})` : "Latest Blogs"}
          </h3>
          <BlogCardList blogs={displayedBlogs} showActions={false} />
          {!showAll && blogs.length > 3 && (
            <button className='inputBtn' onClick={handleViewAll}>
              View All {blogs.length} Blogs →
            </button>
          )}
          {showAll && blogs.length > 3 && (
            <button
              className='inputBtn'
              onClick={() => {
                setShowAll(false);
                blogsRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}>
              Show Less ↑
            </button>
          )}
        </div>
      )}
      {!isOwner && <BackButton />}
    </div>
  );
}

export default UserOverview;
