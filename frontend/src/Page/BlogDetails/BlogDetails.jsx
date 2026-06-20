import "./BlogDetails.css";
import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";
import { BackButton, Comments } from "../../components";
import { useAuth } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark as farBookmark,
  faHeart as farHeart,
} from "@fortawesome/free-regular-svg-icons";
import { faBookmark, faHeart } from "@fortawesome/free-solid-svg-icons";

function BlogDetails() {
  const { user } = useAuth();
  const { id } = useParams();

  const [blog, setBlog] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [countView, setCountView] = useState(0);

  // Track whether we've already incremented the view for this blog id
  const viewedRef = useRef(null);

  // ------------------------------------------------------------------
  // Single effect: re-runs whenever the blog id OR the logged-in user
  // changes.  Fetches fresh blog data and bookmark status together so
  // there is no race between an early null-user and a late-loading user.
  // ------------------------------------------------------------------
  useEffect(() => {
    fetchBlogAndStatus();

    // Only increment view once per blog id (not on every user change)
    if (viewedRef.current !== id) {
      viewedRef.current = id;
      handleView();
    }
  }, [id, user]); // re-run when user changes so liked/bookmarked refresh

  const fetchBlogAndStatus = async () => {
    try {
      // Always fetch the blog (public endpoint — no auth needed)
      const blogRes = await api.get(`/blogs/${id}`);
      const blogData = blogRes.data;

      setBlog(blogData);
      setLikesCount(blogData.likes?.length || 0);

      // Derive liked state directly from the blog data we just received.
      // At this point `user` is the up-to-date value captured by the effect.
      if (user) {
        const userId = String(user._id || user.id);
        const isLiked = (blogData.likes || []).some(
          (uid) => String(uid) === userId
        );
        setLiked(isLiked);

        // Fetch bookmark status (requires auth cookie)
        try {
          const bmRes = await api.get(`/users/bookmark-status/${id}`);
          setBookmarked(bmRes.data.bookmarked);
        } catch (_) {
          setBookmarked(false);
        }
      } else {
        // Guest — no liked/bookmarked state
        setLiked(false);
        setBookmarked(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLike = async () => {
    if (!user) {
      alert("Please login to like a blog");
      return;
    }

    // Optimistic update
    const prevLiked = liked;
    const prevCount = likesCount;
    const newLiked = !liked;
    setLiked(newLiked);
    setLikesCount(newLiked ? likesCount + 1 : likesCount - 1);

    try {
      const res = await api.put(`/blogs/${id}/like`, {});
      // Overwrite with authoritative server values
      setLiked(res.data.liked);
      setLikesCount(res.data.likesCount);
    } catch (error) {
      // Rollback
      setLiked(prevLiked);
      setLikesCount(prevCount);
      console.log(error);
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      alert("Please login to save a blog");
      return;
    }

    // Optimistic update
    const prevBookmarked = bookmarked;
    setBookmarked(!bookmarked);

    try {
      const res = await api.post(`/users/bookmark/${id}`, {});
      setBookmarked(res.data.bookmarked);
    } catch (error) {
      // Rollback
      setBookmarked(prevBookmarked);
      console.log(error);
    }
  };

  const handleView = async () => {
    try {
      const res = await api.patch(`/blogs/${id}/view`, {});
      setCountView(res.data.views);
    } catch (error) {
      console.log(error);
    }
  };

  if (!blog) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className='blog-container'>
      <BackButton />
      <h1 className='blog-title'>{blog.title}</h1>
      <div className='flex blog-title-details'>
        <img src={blog.featuredImage} alt={blog.title} className='blog-image' />
        <div className='blog-details flex'>
          <Link
            to={`/author/${blog.author?._id}`}
            className=' blog-detail-item blog-auther'>
            <p>Author: {blog.author?.name}</p>
          </Link>
          <div className='blog-details-box flex'>
            <button onClick={handleLike} className='blog-detail-item'>
              <span className='blog-icone'>
                {liked ? (
                  <FontAwesomeIcon icon={faHeart} />
                ) : (
                  <FontAwesomeIcon icon={farHeart} />
                )}
              </span>
              <span className='blog-like-text'> {likesCount} Likes</span>
            </button>

            <button className=' blog-detail-item' onClick={handleBookmark}>
              {bookmarked ? (
                <>
                  <span className='blog-icone'>
                    <FontAwesomeIcon icon={faBookmark} />
                  </span>
                  Saved
                </>
              ) : (
                <>
                  <span className='blog-icone'>
                    <FontAwesomeIcon icon={farBookmark} />
                  </span>{" "}
                  Save
                </>
              )}
            </button>

            <p className='blog-detail-item'>Views: {countView}</p>
          </div>
        </div>
      </div>
      <p>
        {" "}
        <b> Description: </b>
        {blog.description}
      </p>
      <p>
        {" "}
        <b> label: </b> {blog.label}
      </p>
      <div className='blog-tags'>
        {blog.tags?.map((tag) => (
          <span key={tag} className='tag'>
            #{tag}{" "}
          </span>
        ))}
      </div>
      <div className='blog-content'>
        <div dangerouslySetInnerHTML={{ __html: blog.content }}></div>
      </div>
      <Comments />
    </div>
  );
}

export default BlogDetails;
