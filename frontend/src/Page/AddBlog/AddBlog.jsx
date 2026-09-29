import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import BlogForm from "../../components/BlogForm/BlogForm";
import BackButton from "../../components/BackButton/BackButton";

import "./AddBlog.css";

function AddBlog() {
  const navigate = useNavigate();

  // Auth guard is handled at the router level (ProtectedRoute).
  const handleCreate = async (formData) => {
    const res = await api.post("/blogs", formData);
    navigate(`/blog/${res.data.blog._id}`);
  };

  return (
    <div className='add-blog-container'>
      <header className='page-header'>
        <h1>Write a new blog</h1>
        <BackButton />
      </header>

      <BlogForm
        requireImage
        submitLabel='Publish Blog'
        submittingLabel='Publishing…'
        onSubmit={handleCreate}
      />
    </div>
  );
}

export default AddBlog;
