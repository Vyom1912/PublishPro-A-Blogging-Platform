// // import React from "react";
// import api from "../../api/axios";
// import { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import { Card } from "../../components";
// function AuthorProfile() {
//   const { id } = useParams();
//   const [data, setData] = useState(null);
//   useEffect(() => {
//     const fetchAuthor = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         // const res = await api.get(`/author/${id}`);

//         const res = await api.get(`/blogs/author/${id}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setData(res.data);
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     fetchAuthor();
//   }, [id]);

//   if (!data) return <p>Loading...</p>;

//   const { author, blogs, stats } = data;
//   return (
//     <div>
//       <img src={author.image} alt='' width='200px' height='200px' />
//       <h1>{author.name}</h1>
//       <p>{author.email}</p>
//       <p>{author.about}</p>
//       <p>Total Blogs: {stats.totalBlogs}</p>
//       <p>Total likes: {stats.totalLikes}</p>
//       <p>Total views: {stats.totalViews}</p>

//       {blogs.map((blog) => (
//         <Link to={`/blog/${blog._id}`}>
//           <Card
//             key={blog._id}
//             id={blog._id}
//             title={blog.title}
//             imgSrc={blog.featuredImage}
//             content={blog.content}
//             author={author.name}
//           />
//         </Link>
//       ))}
//     </div>
//   );
// }

// export default AuthorProfile;

import React, { useState } from "react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("myBlogs");

  const blogs = [
    { id: 1, title: "React Tutorial", views: 1200, likes: 200 },
    { id: 2, title: "Node.js Guide", views: 800, likes: 120 },
  ];

  const savedBlogs = [
    { id: 3, title: "MongoDB Basics", views: 500, likes: 75 },
    { id: 4, title: "Express JS", views: 950, likes: 140 },
  ];

  return (
    <div style={{ padding: "30px" }}>
      <h1>Dashboard</h1>

      {/* Toggle Buttons */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "25px",
        }}>
        <button
          onClick={() => setActiveTab("myBlogs")}
          style={{
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            background: activeTab === "myBlogs" ? "#2563eb" : "#e5e7eb",
            color: activeTab === "myBlogs" ? "white" : "black",
          }}>
          My Blogs
        </button>

        <button
          onClick={() => setActiveTab("savedBlogs")}
          style={{
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            background: activeTab === "savedBlogs" ? "#2563eb" : "#e5e7eb",
            color: activeTab === "savedBlogs" ? "white" : "black",
          }}>
          Saved Blogs
        </button>
      </div>

      {/* Content Area */}
      <div>
        {activeTab === "myBlogs" && (
          <div>
            <h2>My Blogs</h2>

            {blogs.map((blog) => (
              <div
                key={blog.id}
                style={{
                  background: "#fff",
                  padding: "15px",
                  marginBottom: "10px",
                  borderRadius: "10px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                }}>
                <h3>{blog.title}</h3>
                <p>👁 {blog.views}</p>
                <p>❤️ {blog.likes}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "savedBlogs" && (
          <div>
            <h2>Saved Blogs</h2>

            {savedBlogs.map((blog) => (
              <div
                key={blog.id}
                style={{
                  background: "#fff",
                  padding: "15px",
                  marginBottom: "10px",
                  borderRadius: "10px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                }}>
                <h3>{blog.title}</h3>
                <p>👁 {blog.views}</p>
                <p>❤️ {blog.likes}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
