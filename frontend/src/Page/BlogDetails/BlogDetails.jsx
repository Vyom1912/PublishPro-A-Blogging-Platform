// import React from "react";
import "./BlogDetails.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import { BackButton } from "../../components";
import "./BlogDetails.css";
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
    <div className='blog-container'>
      {/* <h1 className='text-3xl font-bold underline'>Blog Details</h1> */}
      {/* <p>Blog ID: {id}</p> */}
      <h1 className='blog-title'>{blog.title}</h1>
      <img src={blog.featuredImage} alt={blog.title} className='blog-image' />
      <p className='blog-auther'>Author: {blog.author?.name}</p>
      <p className='blog-content'>
        {/* {blog.content} */}
        <div dangerouslySetInnerHTML={{ __html: blog.content }}></div>
      </p>

      <BackButton />
    </div>
  );
}

export default BlogDetails;
