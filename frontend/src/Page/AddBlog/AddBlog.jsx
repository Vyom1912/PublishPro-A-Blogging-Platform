import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RTE } from "../../components";
import api from "../../api/axios";
import "./AddBlog.css";

/* Focal-point constants */
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

function AddBlog() {
  const navigate = useNavigate();

  const [title,        setTitle]        = useState("");
  const [titleImage,   setTitleImage]   = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [focalPoint,   setFocalPoint]   = useState("center");
  const [content,      setContent]      = useState("");
  const [submitting,   setSubmitting]   = useState(false);
  const [error,        setError]        = useState(null);
  const [success,      setSuccess]      = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setTitleImage(file);
    setImagePreview(URL.createObjectURL(file));
    setFocalPoint("center"); // reset focal point on new image
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titleImage) { setError("Please select a featured image."); return; }
    if (!title.trim()) { setError("Title is required."); return; }
    if (!content.trim()) { setError("Content is required."); return; }

    setError(null);
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("title", title.trim());
      fd.append("titleImage", titleImage);
      fd.append("content", content);
      fd.append("focalPoint", focalPoint);   // stored for future use if needed

      await api.post("/blogs", fd);

      setSuccess(true);
      setTimeout(() => navigate("/dashboard?tab=my-blogs"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to publish. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="addblog-page">
      <div className="addblog-header">
        <h1 className="addblog-title">Write a New Blog</h1>
        <p className="addblog-sub">Share your story with the world.</p>
      </div>

      <form className="addblog-form" onSubmit={handleSubmit}>
        {/* ── Title ── */}
        <div className="form-field">
          <label htmlFor="blog-title">Title</label>
          <input
            id="blog-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your blog a great title…"
            required
          />
        </div>

        {/* ── Featured image + focal-point ── */}
        <div className="form-field">
          <label htmlFor="blog-image">Featured Image</label>

          <label htmlFor="blog-image" className="addblog-drop-zone">
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
                <span>Click to upload a featured image</span>
                <span className="addblog-drop-hint">PNG, JPG, WebP — max 8 MB</span>
              </div>
            )}
          </label>
          <input
            id="blog-image"
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />
        </div>

        {/* ── Focal point selector (only shown when image is chosen) ── */}
        {imagePreview && (
          <div className="form-field">
            <label>Image Crop Focus</label>
            <p className="focal-hint">
              Choose which area of the image stays visible when it's cropped in cards and previews.
            </p>
            <div className="focal-grid">
              {POSITIONS.map((pos) => (
                <button
                  key={pos.value}
                  type="button"
                  className={`focal-btn${focalPoint === pos.value ? " active" : ""}`}
                  onClick={() => setFocalPoint(pos.value)}
                  title={pos.label}
                >
                  {pos.label}
                </button>
              ))}
            </div>

            {/* Live preview showing the crop effect */}
            <div className="focal-preview-wrap">
              <p className="focal-preview-label">Card preview (how it looks at 180px height):</p>
              <div
                className="focal-preview-card"
                style={{ backgroundImage: `url(${imagePreview})`, backgroundPosition: focalPoint }}
              />
            </div>
          </div>
        )}

        {/* ── Rich text editor ── */}
        <div className="form-field">
          <label>Content</label>
          <RTE value={content} onChange={setContent} />
        </div>

        {error   && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">Blog published! Redirecting…</div>}

        <div className="addblog-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => navigate(-1)}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? "Publishing…" : "Publish Blog"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddBlog;
