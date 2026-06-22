import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RTE } from "../../components";
import api from "../../api/axios";
import { InputBox } from "../../components";
import { useAuth } from "../../context/AuthContext";

import "./AddBlog.css";
function AddBlog() {
  const navigate = useNavigate();
  const { user } = useAuth();
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

  // Redirect guests away
  useEffect(() => {
    if (user === null) navigate("/login");
  }, [user]);

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
      await api.post("/blogs", formData);

      setTitle("");
      setLabel("");
      setTags([]);
      setTitleImage(null);
      setImagePreview("");
      setDescription("");
      setContent("");
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create blog");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className='add-blog-container'>
      <form onSubmit={handleSubmit} className='flex add-blog-form'>
        <div className='form-group'>
          {/* <label htmlFor='title'>Title:</label>
          <input
            type='text'
            placeholder='Title'
            onChange={(e) => setTitle(e.target.value)}
          /> */}
        </div>
        <InputBox
          label='Title:'
          type='text'
          id='title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='Enter title...'
        />{" "}
        <div className='form-group'>
          <label htmlFor='description'>Description:</label>

          <textarea
            name=''
            id='description'
            placeholder='Enter short description...'
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}></textarea>
        </div>
        <div className='form-group'>
          <label htmlFor='label'>Categories:</label>
          <select
            name='label'
            value={label}
            onChange={(e) => setLabel(e.target.value)}>
            <option value=''>Select a label</option>

            {labels.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className='form-group'>
          <label>Tags:</label>
          <input
            type='text'
            placeholder='react, hooks, javascript'
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <small>Separate tags with commas.</small>
        </div>
        <div className='form-group'>
          <label htmlFor='titleImage'>Title Image:</label>
          <div className='sub-form-group'>
            <input
              type='file'
              placeholder='Title Image'
              onChange={handleImageChange}
            />
            {/* <label htmlFor=''>Image Preview: </label> */}
            {titleImage && (
              <div className='image-preview'>
                <img
                  src={imagePreview}
                  alt='Preview'
                  className='w-full h-full object-cover'
                />
              </div>
            )}
          </div>
        </div>
        <RTE value={content} onChange={setContent} />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type='submit' className='inputBtn' disabled={submitting}>
          {submitting ? "Publishing..." : "Add Blog"}
        </button>
      </form>
    </div>
  );
}

export default AddBlog;
