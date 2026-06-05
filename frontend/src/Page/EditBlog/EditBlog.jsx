// import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BackButton } from "../../components";
import { useState, useEffect } from "react";
import RTE from "../../components/RTE/RTE";
import api from "../../api/axios";
function EditBlog() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [titleImage, setTitleImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const res = await api.get(`/blogs/${id}`);

      setBlog(res.data);
      setTitle(res.data.title);
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
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);

      if (titleImage) {
        formData.append("titleImage", titleImage);
      }
      const res = await api.put(`/blogs/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Blog Updated Successfully");
      navigate("/profile");
    } catch (error) {
      console.log(error.response?.data);
      console.log(error.response?.status);
    }
  };
  if (!blog) {
    return <h2>Loading...</h2>;
  }

  return (
    <div>
      <div className='add-blog-container'>
        <form onSubmit={handleSubmit} className='flex add-blog-form'>
          <div className='form-group'>
            <label htmlFor='title'>Title:</label>
            <input
              type='text'
              value={title}
              placeholder='Title'
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className='form-group'>
            <label htmlFor='titleImage'>Title Image:</label>
            <div className='sub-form-group'>
              <input
                type='file'
                placeholder='Title Image'
                onChange={handleImageChange}
              />
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

          <button type='submit' className='addblog-btn'>
            Add Blog
          </button>
        </form>
      </div>
      <div className='blog-container'>
        {/* <h1 className='blog-title'>{blog.title}</h1>
        <img src={blog.featuredImage} alt={blog.title} className='blog-image' />
        <p className='blog-auther'>Author: {blog.author?.name}</p>
        <div
          className='blog-content'
          dangerouslySetInnerHTML={{ __html: blog.content }}></div> */}
        <BackButton />
      </div>
    </div>
  );
}

export default EditBlog;
