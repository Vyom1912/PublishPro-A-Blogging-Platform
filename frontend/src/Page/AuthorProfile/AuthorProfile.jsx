// import React from "react";
import api from "../../api/axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card } from "../../components";
function AuthorProfile() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const res = await api.get(`/blogs/author/${id}`);
        setData(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAuthor();
  }, [id]);

  if (!data) return <p>Loading...</p>;

  const { author, blogs, stats } = data;
  return (
    <div>
      <img src={author.image} alt='' width='200px' height='200px' />
      <h1>{author.name}</h1>
      <p>{author.email}</p>
      <p>{author.about}</p>
      <p>Total Blogs: {stats.totalBlogs}</p>
      <p>Total likes: {stats.totalLikes}</p>
      <p>Total views: {stats.totalViews}</p>

      {blogs.map((blog) => (
        <Link to={`/blog/${blog._id}`}>
          <Card
            key={blog._id}
            id={blog._id}
            title={blog.title}
            imgSrc={blog.featuredImage}
            content={blog.content}
            author={author.name}
          />
        </Link>
      ))}
    </div>
  );
}

export default AuthorProfile;
