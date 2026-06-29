// import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BackButton, InputBox } from "../../components";
import { useState, useEffect } from "react";
import RTE from "../../components/RTE/RTE";
import api from "../../api/axios";
import "./EditBlog.css";
function EditBlog() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [labels, setLabels] = useState([]);
  const [label, setLabel] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [titleImage, setTitleImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    fetchLabels();
    fetchBlog();
  }, [id]);

  const fetchLabels = async () => {
    try {
      const res = await api.get("/blogs/labels");
      setLabels(res.data);
      // console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBlog = async () => {
    try {
      const res = await api.get(`/blogs/${id}`);

      setBlog(res.data);
      setTitle(res.data.title);
      setDescription(res.data.description);
      setLabel(res.data.label);
      // setLabels(res.data.labels);
      // setTags(res.data.tags);
      setTags(res.data.tags.join(", "));
      setContent(res.data.content);
      setImagePreview(res.data.featuredImage);
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setTitleImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Submit clicked");
    try {
      setSubmitting(true);
      setError("");
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("label", label);

      // Split on commas with optional surrounding spaces
      const tagsArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
      formData.append("tags", JSON.stringify(tagsArray));

      formData.append("content", content);

      if (titleImage) {
        formData.append("titleImage", titleImage);
      }
      await api.put(`/blogs/${id}`, formData);
      navigate(`/blog/${id}`);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update blog");
      console.log(error.response?.data);
    } finally {
      setSubmitting(false);
    }
  };
  if (!blog) {
    return <h2>Loading...</h2>;
  }

  return (
    <div>
      <div className='add-blog-container'>
        <h1
          className='blog-title'
          style={{
            width: "100%",
            margin: "20px auto",
            fontWeight: "700",
            color: "var(--dark)",
            position: "relative",
          }}>
          Edit Blog
          <BackButton />
        </h1>
        <form
          onSubmit={handleSubmit}
          className='flex add-blog-form formContainer'>
          {/* <InputBox /> */}
          <InputBox
            label='Title'
            type='text'
            id='title'
            value={title}
            placeholder='Title'
            onChange={(e) => setTitle(e.target.value)}
          />

          <InputBox
            label='Description'
            rows='3'
            id='description'
            value={description}
            placeholder='Description'
            onChange={(e) => setDescription(e.target.value)}
          />

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
            <label htmlFor='titleImage'>Title Image:</label>
            <div className='sub-form-group'>
              <input
                type='file'
                placeholder='Title Image'
                onChange={handleImageChange}
              />
              {/* {titleImage && (
                <div className='image-preview'>
                  <img
                    src={imagePreview}
                    alt='Preview'
                    className='w-full h-full object-cover'
                  />
                </div>
              )} */}
              {imagePreview && (
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

          {error && <p style={{ color: "#c0392b" }}>{error}</p>}

          <button type='submit' className='inputBtn' disabled={submitting}>
            {submitting ? "Updating..." : "Update Blog"}
          </button>
        </form>
        <BackButton />
      </div>
      {/* <div className='blog-container'> */}
      {/* <h1 className='blog-title'>{blog.title}</h1>
        <img src={blog.featuredImage} alt={blog.title} className='blog-image' />
        <p className='blog-auther'>Author: {blog.author?.name}</p>
        <div
          className='blog-content'
          dangerouslySetInnerHTML={{ __html: blog.content }}></div> */}
      {/* </div> */}
    </div>
  );
}

export default EditBlog;
