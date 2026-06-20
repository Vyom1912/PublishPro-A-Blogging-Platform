// import React from "react";
import api from "../../api/axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BackButton, UserOverview, BlogCardList } from "../../components";
import "./AuthorProfile.css";

function AuthorProfile() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [showAllBlogs, setShowAllBlogs] = useState(false);

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

  if (!data) return <p className="author-loading">Loading...</p>;

  const { author, blogs, stats } = data;

  return (
    <div className="author-page containerBox">
      <BackButton />
      <UserOverview
        author={author}
        stats={stats}
        blogs={blogs}
        isOwner={false}
        onViewAll={() => setShowAllBlogs(true)}
      />

      {showAllBlogs && (
        <div className="author-all-blogs">
          <h3>All Blogs by {author.name}</h3>
          <BlogCardList blogs={blogs} showActions={false} />
        </div>
      )}
    </div>
  );
}

export default AuthorProfile;
