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
      setComments(res.data.comments);
    } catch (error) {
      console.log(error);
    }
  };

  const submitComment = async () => {
    if (!comment.trim()) return;

    if (!user) {
      alert("Please login to post a comment");
      return;
    }

    try {
      // No Authorization header needed — the accessToken cookie is sent
      // automatically because axios is configured with withCredentials: true
      await api.post(`/comments/${id}`, { content: comment });
      setComment("");
      fetchComments();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditComment = (c) => {
    setEditingId(c._id);
    setEditContent(c.content);
  };

  const handleUpdateComment = async () => {
    try {
      await api.put(`/comments/${editingId}`, { content: editContent });
      setEditingId(null);
      fetchComments();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      fetchComments();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='comments-section'>
      <div className='add-comment-box'>
        <h3 className='lableTitle'>Add Comment</h3>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder='Write your comment...'
          rows='4'
        />
        <button onClick={submitComment} className='inputBtn'>
          Post Comment
        </button>
      </div>

      <h2 className='lableTitle'>Comments ({comments.length})</h2>

      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        comments.map((c) => (
          <div key={c._id} className='comment-card'>
            <p>
              <strong>{c.user?.name}</strong>
            </p>

            {editingId === c._id ? (
              <div className='edit-comment'>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <div className='comment-actions  flex'>
                  <button onClick={handleUpdateComment}>Save</button>
                  <button onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <p>{c.content}</p>

                {/* Compare both as strings to handle ObjectId vs string mismatch.
                    The backend populates comment.user._id as an ObjectId, and
                    user.id in AuthContext is normalised to a plain string. */}
                {user && String(user.id) === String(c.user?._id) && (
                  <div className='comment-actions  flex'>
                    <button onClick={() => handleEditComment(c)}>Edit</button>
                    <button onClick={() => handleDeleteComment(c._id)}>
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
