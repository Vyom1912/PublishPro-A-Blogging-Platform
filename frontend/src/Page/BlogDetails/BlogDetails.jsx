// import React from "react";
import "./BlogDetails.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import { BackButton, Comments } from "../../components";
import "./BlogDetails.css";
// import { useAuth } from "../../context/AuthContext";
// import { getBlogById } from "./../../services/blogService";

function BlogDetails() {
  // const { user } = useAuth();
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  // const [comments, setComments] = useState([]);
  // const [editingId, setEditingId] = useState(null);
  // const [editContent, setEditContent] = useState("");

  // const [comment, setComment] = useState("");
  useEffect(() => {
    fetchBlog();
    // fetchComments();
  }, [id]);

  // const fetchComments = async () => {
  //   try {
  //     const res = await api.get(`/comments/${id}`);
  //     console.log("COMMENTS FROM API:", res.data.comments);

  //     setComments(res.data.comments);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // const submitComment = async () => {
  //   try {
  //     const token = localStorage.getItem("token");

  //     if (!token) {
  //       alert("Please login first");
  //       return;
  //     }

  //     await api.post(
  //       `/comments/${id}`,
  //       {
  //         content: comment,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       },
  //     );

  //     setComment("");

  //     fetchComments();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const fetchBlog = async () => {
    try {
      const res = await api.get(`/blogs/${id}`);
      setBlog(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // const handleEdit = (comment) => {
  //   setEditingId(comment._id);
  //   setEditContent(comment.content);
  // };
  // const handleUpdate = async () => {
  //   try {
  //     const token = localStorage.getItem("token");

  //     await api.put(
  //       `/comments/${editingId}`,
  //       {
  //         content: editContent,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       },
  //     );

  //     setEditingId(null);

  //     fetchComments();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // const handleDelete = async (commentId) => {
  //   try {
  //     const token = localStorage.getItem("token");

  //     await api.delete(`/comments/${commentId}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     fetchComments();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  if (!blog) {
    return <h2>Loading...</h2>;
  }
  return (
    <div className='blog-container'>
      {/* <h1 className='text-3xl font-bold underline'>Blog Details</h1> */}
      {/* <p>Blog ID: {id}</p> */}
      <BackButton />
      <h1 className='blog-title'>{blog.title}</h1>
      <img src={blog.featuredImage} alt={blog.title} className='blog-image' />
      <p className='blog-auther'>Author: {blog.author?.name}</p>
      <p className='blog-content'>
        {/* {blog.content} */}
        <div dangerouslySetInnerHTML={{ __html: blog.content }}></div>
      </p>
      <Comments />
      {/* ---------------------  comment section ------------------------------------------------- */}
      {/* <div className='comments-section'>
        <div className='add-comment-box'>
          <h3>Add Comment</h3>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder='Write your comment...'
            rows='4'
          />

          <button onClick={submitComment}>Post Comment</button>
        </div>

        <h2>Comments ({comments.length})</h2>

        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className='comment-card'>
              <p>
                <strong>{comment.user?.name}</strong>
              </p>

              {editingId === comment._id ? (
                <>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  />

                  <button onClick={handleUpdate}>Save</button>

                  <button onClick={() => setEditingId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <p>{comment.content}</p>

                  {user?.id === comment.user?._id && (
                    <div className='comment-actions'>
                      <button onClick={() => handleEdit(comment)}>Edit</button>

                      <button onClick={() => handleDelete(comment._id)}>
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div> */}
    </div>
  );
}

export default BlogDetails;
