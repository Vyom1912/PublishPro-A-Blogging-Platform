// import React from "react";
import "./BlogDetails.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import { BackButton } from "../../components";
// import { getBlogById } from "./../../services/blogService";

function BlogDetails() {
  const { id } = useParams();
  // const blog = getBlogById(id);
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    fetchBlog();
  }, []);

  const fetchBlog = async () => {
    try {
      const res = await api.get(`/blogs/${id}`);

      setBlog(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!blog) {
    return <h2>Loading...</h2>;
  }
  return (
    <div>
      <h1 className='text-3xl font-bold underline'>Blog Details</h1>
      <p>Blog ID: {id}</p>
      <h1>{blog.title}</h1>
      <p>Author: {blog.author?.name}</p>
      <img src={blog.featuredImage} alt={blog.title} />
      <p>{blog.content}</p>

      <BackButton />
    </div>
  );
}

export default BlogDetails;
