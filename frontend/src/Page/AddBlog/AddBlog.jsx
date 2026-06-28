import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RTE } from "../../components";
import api from "../../api/axios";
import { InputBox } from "../../components";

import "./AddBlog.css";
function AddBlog() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [labels, setLabels] = useState([]);
  const [label, setLabel] = useState("");
  const [tags, setTags] = useState("");
  const [titleImage, setTitleImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Auth guard is handled at the router level (ProtectedRoute).
  // No manual redirect needed here.

  useEffect(() => {
    fetchLabels();
  }, []);

  const fetchLabels = async () => {
    try {
      const res = await api.get("/blogs/labels");
      setLabels(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    setTitleImage(file);

    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!titleImage) {
      setError("Please select a title image");
      return;
    }
    if (!label) {
      setError("Please select a category");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("label", label);
    formData.append("tags", tags);
    formData.append("titleImage", titleImage);
    formData.append("content", content);

    try {
      setSubmitting(true);
      const res = await api.post("/blogs", formData);

      setTitle("");
      setLabel("");
      setTags([]);
      setTitleImage(null);
      setImagePreview("");
      setDescription("");
      setContent("");
      navigate(`/blog/${res.data.blog._id}`);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create blog");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className='add-blog-container'>
      <form onSubmit={handleSubmit} className='flex add-blog-form formContainer '>
        <InputBox
          label='Title'
          type='text'
          id='title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='Enter title...'
        />
        {/* <div className='form-group'>
          <label htmlFor='title'>Title</label>
          <input
            type='text'
            id='title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Enter title...'
          />
        </div> */}

        <InputBox
          label='Description'
          id='description'
          placeholder='Enter short description...'
          rows='3'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {/* <div className='form-group'>
          <label htmlFor='description'>Description</label>
          <textarea
            id='description'
            placeholder='Enter short description...'
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div> */}

        <div className='form-group'>
          <label htmlFor='label'>Category</label>
          <select
            id='label'
            name='label'
            value={label}
            onChange={(e) => setLabel(e.target.value)}>
            <option value=''>Select a category</option>
            {labels.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className='form-group'>
          {/* <label>Tags</label> */}
          <InputBox
          label='Tags'
            id='tags'
            type='text'
            placeholder='coding, nature, India, modi'
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <small>Separate tags with commas.</small>
        </div>

        <div className='form-group'>
          <label>Cover Image</label>
          <div className='sub-form-group'>
            <input type='file' accept='image/*' onChange={handleImageChange} />
            {titleImage && (
              <div className='image-preview'>
                <img src={imagePreview} alt='Preview' />
              </div>
            )}
          </div>
        </div>

        <RTE value={content} onChange={setContent} />

        {error && <p style={{ color: "#c0392b" }}>{error}</p>}

        <button type='submit' className='inputBtn' disabled={submitting}>
          {submitting ? "Publishing…" : "Publish Blog"}
        </button>
      </form>
    </div>
  );
}

export default AddBlog;
