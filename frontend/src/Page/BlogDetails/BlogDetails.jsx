import "./BlogDetails.css";
import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import api from "../../api/axios";
import BackButton from "../../components/BackButton/BackButton";
import Comments from "../../components/Comments/Comments";
import { useAuth } from "../../context/AuthContext";
import { coverUrl, thumbUrl } from "../../utils/image";
import DOMPurify from "dompurify";
import {
  FaRegBookmark,
  FaRegHeart,
  FaRegEye,
  FaBookmark,
  FaHeart,
  FaShareNodes,
  FaPen,
} from "react-icons/fa6";

// Images inside the article load only when scrolled near, and links open in
// a new tab so readers don't lose their place.
DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (node.tagName === "IMG") {
    node.setAttribute("loading", "lazy");
    node.setAttribute("decoding", "async");
  }
  if (node.tagName === "A" && node.getAttribute("href")) {
    node.setAttribute("target", "_blank");
    node.setAttribute("rel", "noopener noreferrer");
  }
});

const statusFrom = (data) => ({
  liked: Boolean(data.liked),
  likesCount: data.likesCount || 0,
  bookmarked: Boolean(data.bookmarked),
  viewerId: data.viewerId || null,
});

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

function BlogDetails() {
  const { user, loading: authLoading } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [blog, setBlog] = useState(null);
  // The viewer's own like / save state, kept apart from the article itself
  const [status, setStatus] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [countView, setCountView] = useState(0);
  const [copied, setCopied] = useState(false);

  // Load the blog and count the view. The server works out liked / saved
  // from the auth cookie, so there's no separate bookmark-status request.
  // (BlogDetailsPage remounts this component per id, so state starts clean.)
  useEffect(() => {
    let ignore = false;

    api
      .get(`/blogs/${id}`)
      .then((res) => {
        if (ignore) return;
        setBlog(res.data);
        setStatus(statusFrom(res.data));
      })
      .catch((error) => {
        if (ignore) return;
        if (error.response?.status === 404) setNotFound(true);
        else setLoadError(true);
      });

    api
      .patch(`/blogs/${id}/view`, {})
      .then((res) => !ignore && setCountView(res.data.views))
      .catch(() => {});

    return () => {
      ignore = true;
    };
  }, [id]);

  // If the user logs in / out (or their session was refreshed after the blog
  // loaded) the like / save flags belong to someone else — reload them.
  const statusViewer = status ? status.viewerId : undefined;
  useEffect(() => {
    if (authLoading || statusViewer === undefined) return;
    if (statusViewer !== (user?.id || null)) {
      api
        .get(`/blogs/${id}`)
        .then((res) => setStatus(statusFrom(res.data)))
        .catch(() => {});
    }
  }, [authLoading, user?.id, statusViewer, id]);

  const content = blog?.content;
  const html = useMemo(() => (content ? DOMPurify.sanitize(content) : ""), [content]);

  const readingTime = useMemo(() => {
    const words = html.replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
  }, [html]);

  const goToLogin = () => navigate("/login", { state: { from: location } });

  const handleLike = async () => {
    if (!user) return goToLogin();

    // Optimistic update
    const prevStatus = status;
    setStatus({
      ...status,
      liked: !status.liked,
      likesCount: status.likesCount + (status.liked ? -1 : 1),
    });

    try {
      const res = await api.put(`/blogs/${id}/like`, {});
      // Overwrite with authoritative server values
      setStatus((s) => ({ ...s, liked: res.data.liked, likesCount: res.data.likesCount }));
    } catch (error) {
      // Rollback
      setStatus(prevStatus);
      console.log(error);
    }
  };

  const handleBookmark = async () => {
    if (!user) return goToLogin();

    // Optimistic update
    const prevStatus = status;
    setStatus({ ...status, bookmarked: !status.bookmarked });

    try {
      const res = await api.post(`/users/bookmark/${id}`, {});
      setStatus((s) => ({ ...s, bookmarked: res.data.bookmarked }));
    } catch (error) {
      // Rollback
      setStatus(prevStatus);
      console.log(error);
    }
  };

  // Native share sheet on phones, copy-link everywhere else
  const handleShare = async () => {
    const url = `${window.location.origin}/blog/${id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: blog.title, url });
      } catch {
        // Share sheet dismissed
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (e.g. insecure context) — nothing useful to do
    }
  };

  if (notFound) {
    return (
      <div className='containerBox status-page'>
        <h1>Blog not found</h1>
        <p>It may have been deleted by its author.</p>
        <Link to='/' className='inputBtn'>
          Browse blogs
        </Link>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className='containerBox status-page'>
        <h1>Couldn&apos;t load this blog</h1>
        <p>Check your connection and try again.</p>
        <button className='inputBtn' onClick={() => window.location.reload()}>
          Reload
        </button>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className='blog-container' aria-busy='true'>
        <div className='skeleton blog-skeleton-title' />
        <div className='skeleton blog-skeleton-image' />
        <div className='skeleton skeleton-line' />
        <div className='skeleton skeleton-line' />
        <div className='skeleton skeleton-line short' />
      </div>
    );
  }

  const isOwner = user && String(user.id) === String(blog.author?._id);
  const { liked, likesCount, bookmarked } = status;
  const views = Math.max(countView, blog.views || 0);

  return (
    <article className='blog-container'>
      <header className='page-header'>
        <h1 className='blog-title'>{blog.title}</h1>
        <BackButton />
      </header>

      <div className='blog-title-details'>
        {blog.featuredImage && (
          <img
            src={coverUrl(blog.featuredImage)}
            alt={blog.title}
            className='blog-image'
            fetchPriority='high'
          />
        )}

        <div className='blog-details'>
          <Link to={`/author/${blog.author?._id}`} className='blog-auther flex'>
            {blog.author?.image ? (
              <img src={thumbUrl(blog.author.image, 80)} alt='' className='blog-author-img' />
            ) : (
              <span className='blog-author-img flex'>
                {blog.author?.name?.charAt(0).toUpperCase()}
              </span>
            )}
            <span>{blog.author?.name}</span>
          </Link>

          <p className='blog-meta'>
            {formatDate(blog.createdAt)} · {readingTime} min read
            {blog.label && (
              <>
                {" · "}
                <span className='blog-label'>{blog.label}</span>
              </>
            )}
          </p>

          {blog.tags?.length > 0 && (
            <div className='blog-di-tags flex'>
              {blog.tags.map((tag) => (
                <span key={tag} className='tag'>
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className='blog-action-row'>
            <button
              onClick={handleLike}
              className={`blog-action-btn${liked ? " active" : ""}`}
              aria-pressed={liked}>
              {liked ? <FaHeart className='blog-icone' /> : <FaRegHeart className='blog-icone' />}
              {likesCount}
              <span className='blog-like-text'>{likesCount === 1 ? "Like" : "Likes"}</span>
            </button>

            <button
              onClick={handleBookmark}
              className={`blog-action-btn${bookmarked ? " active" : ""}`}
              aria-pressed={bookmarked}>
              {bookmarked ? (
                <FaBookmark className='blog-icone' />
              ) : (
                <FaRegBookmark className='blog-icone' />
              )}
              {bookmarked ? "Saved" : "Save"}
            </button>

            <button onClick={handleShare} className='blog-action-btn'>
              <FaShareNodes className='blog-icone' />
              {copied ? "Link copied" : "Share"}
            </button>

            <span className='blog-views flex' title='Views'>
              <FaRegEye className='blog-icone' />
              {views}
            </span>

            {isOwner && (
              <Link to={`/edit-blog/${blog._id}`} className='blog-action-btn'>
                <FaPen className='blog-icone' />
                Edit
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className='blog-content' dangerouslySetInnerHTML={{ __html: html }} />

      <Comments key={id} />
    </article>
  );
}

// Moving from one blog to another (e.g. via the author page) gives a fresh
// component, so no stale title / likes from the previous blog flash up.
function BlogDetailsPage() {
  const { id } = useParams();
  return <BlogDetails key={id} />;
}

export default BlogDetailsPage;
