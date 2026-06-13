// import React from "react";
import "./BlogDetails.css";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";
import { BackButton, Comments } from "../../components";
import "./BlogDetails.css";
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

  useEffect(() => {
    fetchBlog();

    if (user) {
      fetchBookmarkStatus();
    }
    handleView();
  }, [id, user]);

  const fetchBlog = async () => {
    try {
      const res = await api.get(`/blogs/${id}`);
      setBlog(res.data);

      setLikesCount(res.data.likes?.length || 0);

      // setLiked(
      //   res.data.likes?.includes(user?._id) ||
      //     res.data.likes?.includes(user?.id),
      // );
      if (user) {
        setLiked(
          res.data.likes?.some(
            (userId) => userId.toString() === (user._id || user.id),
          ),
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      const res = await api.put(
        `/blogs/${id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setLiked(res.data.liked);
      setLikesCount(res.data.likesCount);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBookmark = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.post(
        `/users/bookmark/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("saved", res.data);

      setBookmarked(res.data.bookmarked);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBookmarkStatus = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const res = await api.get(`/users/bookmark-status/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBookmarked(res.data.bookmarked);
    } catch (error) {
      console.log(error);
    }
  };

  const handleView = async () => {
    const token = localStorage.getItem("token");

    const res = await api.patch(
      `/blogs/${id}/view`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    setCountView(res.data.views);
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
            <p className=''>Author: {blog.author?.name}</p>
          </Link>
          <div className='blog-details-box flex'>
            <button onClick={handleLike} className='blog-detail-item  '>
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
                    {" "}
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
      <p className='blog-content'>
        {/* {blog.content} */}
        <div dangerouslySetInnerHTML={{ __html: blog.content }}></div>
      </p>
      <Comments />
    </div>
  );
}

export default BlogDetails;
