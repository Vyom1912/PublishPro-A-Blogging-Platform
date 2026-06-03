// import React from "react";
import { useState } from "react";
import { RTE } from "../components";
import api from "../api/axios";
function AddBlog() {
  const [title, setTitle] = useState("");
  const [titleImage, setTitleImage] = useState(null);
  // const [featuredImage, setFeaturedImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [content, setContent] = useState("");

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    setTitleImage(file);

    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", title);
    formData.append("titleImage", titleImage);
    formData.append("content", content);

    // api comes here form connecting to backend
    // await axios.post("http://localhost:5000/api/users/upload", formData);

    try {
      const token = localStorage.getItem("token");

      // const res = await api.post(
      //   "/blogs",
      //   {
      //     title,
      //     content,
      //     featuredImage: imagePreview,
      //   },
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   },
      // );

      const res = await api.post("/blogs", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data);

      setTitle("");
      setTitleImage(null);
      setImagePreview("");
      setContent("");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='text'
          placeholder='Title'
          onChange={(e) => setTitle(e.target.value)}
          className='input input-bordered w-full max-w-xs'
        />
        <input
          type='file'
          placeholder='Title Image'
          onChange={handleImageChange}
          className='input input-bordered w-full max-w-xs'
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

        <RTE value={content} onChange={setContent} />

        <button type='submit' className='btn btn-primary'>
          Add Blog
        </button>
      </form>
    </div>
  );
}

export default AddBlog;
