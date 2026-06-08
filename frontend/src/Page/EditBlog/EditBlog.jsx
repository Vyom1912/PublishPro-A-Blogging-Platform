import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BackButton } from "../../components";
import RTE from "../../components/RTE/RTE";
import api from "../../api/axios";
import "../AddBlog/AddBlog.css";

const POSITIONS = [
  { label: "Top Left",     value: "top left" },
  { label: "Top Center",   value: "top center" },
  { label: "Top Right",    value: "top right" },
  { label: "Center Left",  value: "center left" },
  { label: "Center",       value: "center" },
  { label: "Center Right", value: "center right" },
  { label: "Bottom Left",  value: "bottom left" },
  { label: "Bottom Center",value: "bottom center" },
  { label: "Bottom Right", value: "bottom right" },
];

function EditBlog() {
  const { id }    = useParams();
  const navigate  = useNavigate();

  const [title,        setTitle]        = useState("");
  const [content,      setContent]      = useState("");
  const [titleImage,   setTitleImage]   = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [focalPoint,   setFocalPoint]   = useState("center");
  const [loading,      setLoading]      = useState(true);
  const [submitting,   setSubmitting]   = useState(false);
  const [error,        setError]        = useState(null);

  useEffect(() => { fetchBlog(); }, [id]);

  const fetchBlog = async () => {
    try {
      const res = await api.get(`/blogs/${id}`);
      setTitle(res.data.title);
      setContent(res.data.content);
      setImagePreview(res.data.featuredImage);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setTitleImage(file);
    setImagePreview(URL.createObjectURL(file));
    setFocalPoint("center");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("content", content);
      if (titleImage) fd.append("titleImage", titleImage);
      fd.append("focalPoint", focalPoint);

      await api.put(`/blogs/${id}`, fd);
      navigate("/dashboard?tab=my-blogs");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-center" style={{ minHeight: "60vh" }}>
        <div className="spinner" />
        <p>Loading blog…</p>
      </div>
    );
  }

  return (
    <div className="addblog-page">
      <div className="addblog-header">
        <BackButton />
        <h1 className="addblog-title" style={{ marginTop: 12 }}>Edit Blog</h1>
      </div>

      <form className="addblog-form" onSubmit={handleSubmit}>
        {/* Title */}
        <div className="form-field">
          <label htmlFor="edit-title">Title</label>
          <input
            id="edit-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Blog title"
            required
          />
        </div>

        {/* Featured image */}
        <div className="form-field">
          <label htmlFor="edit-image">Featured Image</label>
          <label htmlFor="edit-image" className="addblog-drop-zone">
            {imagePreview ? (
              <div
                className="addblog-img-preview"
                style={{ backgroundImage: `url(${imagePreview})`, backgroundPosition: focalPoint }}
              >
                <span className="addblog-img-badge">Click to change</span>
              </div>
            ) : (
              <div className="addblog-drop-placeholder">
                <span className="addblog-drop-icon">🖼️</span>
                <span>Click to upload</span>
              </div>
            )}
          </label>
          <input id="edit-image" type="file" accept="image/*" hidden onChange={handleImageChange} />
        </div>

        {/* Focal point (only when image set) */}
        {imagePreview && (
          <div className="form-field">
            <label>Image Crop Focus</label>
            <p className="focal-hint">Pick which part of the image stays visible in cards.</p>
            <div className="focal-grid">
              {POSITIONS.map((pos) => (
                <button
                  key={pos.value}
                  type="button"
                  className={`focal-btn${focalPoint === pos.value ? " active" : ""}`}
                  onClick={() => setFocalPoint(pos.value)}
                >
                  {pos.label}
                </button>
              ))}
            </div>
            <div className="focal-preview-wrap">
              <p className="focal-preview-label">Card preview:</p>
              <div
                className="focal-preview-card"
                style={{ backgroundImage: `url(${imagePreview})`, backgroundPosition: focalPoint }}
              />
            </div>
          </div>
        )}

        {/* RTE */}
        <div className="form-field">
          <label>Content</label>
          <RTE value={content} onChange={setContent} />
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="addblog-actions">
          <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditBlog;
