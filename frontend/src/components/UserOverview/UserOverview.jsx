import { useState, useRef } from "react";
import BackButton from "../BackButton/BackButton";
import BlogCardList from "../BlogCardList/BlogCardList";
import { thumbUrl } from "../../utils/image";
import "./UserOverview.css";

function UserOverview({
  author,
  stats,
  blogs = [],
  isOwner,
  loading = false,
  onViewAll,
}) {
  const [showAll, setShowAll] = useState(false);
  const blogsRef = useRef(null);

  const displayedBlogs = showAll ? blogs : blogs.slice(0, 3);
  const aboutText = author.about || "";

  const handleViewAll = () => {
    // On the profile page this switches to the "My Blogs" tab
    if (onViewAll) return onViewAll();

    setShowAll(true);
    // Scroll the blogs section into view smoothly
    setTimeout(() => {
      blogsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const statItems = [
    { label: "Blogs", value: stats.totalBlogs },
    { label: "Likes", value: stats.totalLikes },
    { label: "Views", value: stats.totalViews },
    { label: "Saves", value: stats.totalSaves },
  ];

  return (
    <div className='user-overview'>
      {/* Header — the profile page already shows the owner in the sidebar */}
      {!isOwner && (
        <div className='uo-header flex'>
          {author.image ? (
            <img src={thumbUrl(author.image, 200)} alt={author.name} className='uo-avatar' />
          ) : (
            <div className='uo-avatar-placeholder flex'>
              {author.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div className='uo-identity'>
            <h1 className='uo-name'>{author.name}</h1>
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
          <BackButton className='uo-back' />
        </div>
      )}

      {/* Stats */}
      <div className='uo-stats'>
        {statItems.map((item) => (
          <div key={item.label} className='uo-stat-item flex'>
            <span className='uo-stat-value'>{loading ? "–" : item.value}</span>
            <span className='uo-stat-label'>{item.label}</span>
          </div>
        ))}
      </div>

      {/* About */}
      {aboutText && (
        <div className='uo-item uo-bg'>
          <h2 className='lableTitle'>About</h2>
          <p className='uo-text'>{aboutText}</p>
        </div>
      )}

      {/* Blogs section */}
      <div className='uo-item' ref={blogsRef}>
        <BlogCardList
          blogs={displayedBlogs}
          label={showAll ? `All Blogs (${blogs.length})` : "Latest Blogs"}
          loading={loading}
          emptyText={isOwner ? "You haven't published anything yet." : "No blogs published yet."}
          emptyAction={isOwner ? { to: "/add-blog", label: "Write your first blog" } : undefined}
        />
        {!showAll && blogs.length > 3 && (
          <button className='inputBtn uo-more' onClick={handleViewAll}>
            View all {blogs.length} blogs →
          </button>
        )}
        {showAll && blogs.length > 3 && (
          <button
            className='inputBtn uo-more'
            onClick={() => {
              setShowAll(false);
              blogsRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}>
            Show less ↑
          </button>
        )}
      </div>
    </div>
  );
}

export default UserOverview;
