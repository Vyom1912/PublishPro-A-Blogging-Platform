import { useEffect, useRef, useState } from "react";
import api from "../../api/axios";
import RTE from "../RTE/RTE";
import InputBox from "../InputBox/InputBox";
import { coverUrl } from "../../utils/image";
import "./BlogForm.css";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // must match the backend multer limit

// Shared by AddBlog and EditBlog.
// onSubmit receives a ready FormData and should return a promise.
function BlogForm({
  initialValues = {},
  requireImage = false,
  submitLabel,
  submittingLabel,
  onSubmit,
}) {
  const [title, setTitle] = useState(initialValues.title || "");
  const [description, setDescription] = useState(initialValues.description || "");
  const [labels, setLabels] = useState([]);
  const [label, setLabel] = useState(initialValues.label || "");
  const [tags, setTags] = useState((initialValues.tags || []).join(", "));
  const [content, setContent] = useState(initialValues.content || "");
  const [titleImage, setTitleImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    initialValues.featuredImage ? coverUrl(initialValues.featuredImage, 400) : "",
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const editorRef = useRef(null);

  useEffect(() => {
    api
      .get("/blogs/labels")
      .then((res) => setLabels(res.data))
      .catch((err) => console.log(err));
  }, []);

  // Free the temporary preview URL when it changes / on unmount
  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setError("Image must be smaller than 5 MB");
      e.target.value = "";
      return;
    }

    setError("");
    setTitleImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const textContent = content.replace(/<[^>]*>/g, "").trim();

    if (!title.trim()) return setError("Please add a title");
    if (!description.trim()) return setError("Please add a short description");
    if (!label) return setError("Please select a category");
    if (requireImage && !titleImage) return setError("Please select a cover image");
    if (!textContent && !content.includes("<img")) {
      return setError("Your blog is empty — write something first");
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("label", label);

    // Split on commas with optional surrounding spaces
    const tagsArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    formData.append("tags", JSON.stringify(tagsArray));

    formData.append("content", content);
    if (titleImage) formData.append("titleImage", titleImage);

    try {
      setSubmitting(true);
      await onSubmit(formData);
      // Published — don't offer this text as a "restored draft" next time
      editorRef.current?.plugins?.autosave?.removeDraft(false);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='flex blog-form formContainer' noValidate>
      <InputBox
        label='Title'
        id='title'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder='Enter title...'
        maxLength={150}
      />

      <InputBox
        label='Description'
        id='description'
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder='A short summary shown on the blog card...'
        maxLength={300}
      />

      <div className='blog-form-row'>
        <div className='form-group'>
          <label htmlFor='label'>Category</label>
          <select
            id='label'
            name='label'
            className='blog-form-select'
            value={label}
            onChange={(e) => setLabel(e.target.value)}>
            <option value=''>Select a category</option>
            {/* Keep the saved label selectable even before the list loads */}
            {label && !labels.includes(label) && <option value={label}>{label}</option>}
            {labels.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className='form-group'>
          <InputBox
            label='Tags'
            id='tags'
            placeholder='coding, nature, travel'
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <small>Separate tags with commas.</small>
        </div>
      </div>

      <div className='form-group'>
        <label htmlFor='titleImage'>Cover Image</label>
        <div className='cover-picker'>
          <label htmlFor='titleImage' className='cover-drop flex'>
            {imagePreview ? (
              <img src={imagePreview} alt='Cover preview' className='image-preview' />
            ) : (
              <span>Tap to choose an image</span>
            )}
          </label>
          <input
            type='file'
            id='titleImage'
            accept='image/*'
            onChange={handleImageChange}
            className='cover-input'
          />
          <small>JPG, PNG or WebP, up to 5 MB.</small>
        </div>
      </div>

      <div className='form-group'>
        <label>Content</label>
        <RTE value={content} onChange={setContent} editorRef={editorRef} />
      </div>

      {error && (
        <p className='error-text' role='alert'>
          {error}
        </p>
      )}

      <button type='submit' className='inputBtn' disabled={submitting}>
        {submitting ? submittingLabel : submitLabel}
      </button>
    </form>
  );
}

export default BlogForm;
