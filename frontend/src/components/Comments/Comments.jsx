import { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import InputBox from "../InputBox/InputBox";
import "./Comments.css";

const timeAgo = (date) => {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

function Comments() {
  const { user } = useAuth();
  const { id } = useParams();
  const location = useLocation();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [comment, setComment] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");

  // The parent renders <Comments key={blogId} />, so this component starts
  // fresh for every blog and doesn't need to reset its state here.
  useEffect(() => {
    let ignore = false;

    api
      .get(`/comments/${id}`)
      .then((res) => !ignore && setComments(res.data.comments))
      .catch((error) => console.log(error))
      .finally(() => !ignore && setLoading(false));

    return () => {
      ignore = true;
    };
  }, [id]);

  const submitComment = async (e) => {
    e.preventDefault();
    if (!comment.trim() || posting) return;

    setPosting(true);
    setError("");
    try {
      // No Authorization header needed — the accessToken cookie is sent
      // automatically because axios is configured with withCredentials: true
      const res = await api.post(`/comments/${id}`, { content: comment });
      // Add the new comment locally instead of reloading the whole list
      setComments((prev) => [res.data.comment, ...prev]);
      setComment("");
    } catch (error) {
      setError(error.response?.data?.message || "Couldn't post your comment");
    } finally {
      setPosting(false);
    }
  };

  const handleEditComment = (c) => {
    setEditingId(c._id);
    setEditContent(c.content);
  };

  const handleUpdateComment = async () => {
    if (!editContent.trim()) return;
    try {
      const res = await api.put(`/comments/${editingId}`, { content: editContent });
      setComments((prev) =>
        prev.map((c) => (c._id === editingId ? res.data.comment : c)),
      );
      setEditingId(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await api.delete(`/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className='comments-section'>
      <h2 className='lableTitle'>Comments ({comments.length})</h2>

      {user ? (
        <form className='add-comment-box' onSubmit={submitComment}>
          <InputBox
            id='comment'
            label='Add a comment'
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder='Share your thoughts...'
          />
          {error && <p className='error-text'>{error}</p>}
          <button
            type='submit'
            className='inputBtn'
            disabled={posting || !comment.trim()}>
            {posting ? "Posting…" : "Post Comment"}
          </button>
        </form>
      ) : (
        <p className='comment-login'>
          <Link to='/login' state={{ from: location }}>
            Log in
          </Link>{" "}
          to join the conversation.
        </p>
      )}

      {loading ? (
        <p className='comment-empty'>Loading comments…</p>
      ) : comments.length === 0 ? (
        <p className='comment-empty'>No comments yet. Be the first to share your thoughts.</p>
      ) : (
        comments.map((c) => (
          <div key={c._id} className='comment-card'>
            <div className='comment-head flex'>
              <span className='comment-author'>{c.user?.name || "Deleted user"}</span>
              <span className='comment-time'>{timeAgo(c.createdAt)}</span>
            </div>

            {editingId === c._id ? (
              <div className='edit-comment'>
                <InputBox
                  id={`edit-comment-${c._id}`}
                  rows={3}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <div className='comment-actions flex'>
                  <button onClick={handleUpdateComment}>Save</button>
                  <button className='comment-cancel' onClick={() => setEditingId(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className='comment-body'>{c.content}</p>

                {/* Compare both as strings to handle ObjectId vs string mismatch.
                    The backend populates comment.user._id as an ObjectId, and
                    user.id in AuthContext is normalised to a plain string. */}
                {user && String(user.id) === String(c.user?._id) && (
                  <div className='comment-actions flex'>
                    <button onClick={() => handleEditComment(c)}>Edit</button>
                    <button
                      className='comment-delete'
                      onClick={() => handleDeleteComment(c._id)}>
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))
      )}
    </section>
  );
}

export default Comments;
