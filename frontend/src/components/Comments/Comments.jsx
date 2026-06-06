import { useState, useEffect } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { useParams } from "react-router-dom";
import "./Comments.css";

function Comments() {
  const { user } = useAuth();
  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetchComments();
  }, [id]);

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/${id}`);
      console.log("COMMENTS FROM API:", res.data.comments);

      setComments(res.data.comments);
    } catch (error) {
      console.log(error);
    }
  };
  const submitComment = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      await api.post(
        `/comments/${id}`,
        {
          content: comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setComment("");

      fetchComments();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditComment = (comment) => {
    setEditingId(comment._id);
    setEditContent(comment.content);
  };
  const handleUpdateComment = async () => {
    try {
      const token = localStorage.getItem("token");

      await api.put(
        `/comments/${editingId}`,
        {
          content: editContent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setEditingId(null);

      fetchComments();
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem("token");

      await api.delete(`/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchComments();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className='comments-section'>
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

                <button onClick={handleUpdateComment}>Save</button>

                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <p>{comment.content}</p>

                {user?.id === comment.user?._id && (
                  <div className='comment-actions'>
                    <button onClick={() => handleEditComment(comment)}>
                      Edit
                    </button>

                    <button onClick={() => handleDeleteComment(comment._id)}>
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Comments;
