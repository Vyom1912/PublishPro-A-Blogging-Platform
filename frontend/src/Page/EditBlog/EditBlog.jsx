import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import BlogForm from "../../components/BlogForm/BlogForm";
import BackButton from "../../components/BackButton/BackButton";
import "./EditBlog.css";

function EditBlog() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    api
      .get(`/blogs/${id}`)
      .then((res) => !ignore && setBlog(res.data))
      .catch((err) => {
        if (ignore) return;
        setError(
          err.response?.status === 404
            ? "This blog doesn't exist anymore."
            : "Couldn't load this blog. Please try again.",
        );
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  const handleUpdate = async (formData) => {
    await api.put(`/blogs/${id}`, formData);
    navigate(`/blog/${id}`);
  };

  if (error) {
    return (
      <div className='containerBox status-page'>
        <h1>Can&apos;t edit this blog</h1>
        <p>{error}</p>
        <Link to='/profile' className='inputBtn'>
          Back to profile
        </Link>
      </div>
    );
  }

  if (!blog) {
    return <p className='page-loading'>Loading…</p>;
  }

  // Only the author may edit — the API would reject the save anyway
  if (String(blog.author?._id) !== String(user?.id)) {
    return (
      <div className='containerBox status-page'>
        <h1>Can&apos;t edit this blog</h1>
        <p>You can only edit blogs you wrote.</p>
        <Link to={`/blog/${id}`} className='inputBtn'>
          View blog
        </Link>
      </div>
    );
  }

  return (
    <div className='add-blog-container'>
      <header className='page-header'>
        <h1>Edit Blog</h1>
        <BackButton fallback={`/blog/${id}`} />
      </header>

      <BlogForm
        initialValues={blog}
        submitLabel='Update Blog'
        submittingLabel='Updating…'
        onSubmit={handleUpdate}
      />
    </div>
  );
}

export default EditBlog;
