import { useEffect, useState } from "react";
import { Card } from "../components";
import api from "../api/axios";

// import blogs from "../data/blogs";
// import { getBlogs } from "../services/blogService";

function Home() {
  const [blogs, setBlogs] = useState([]);

  // const blogs = getBlogs();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await api.get("/blogs");
      // console.log(res.data);
      console.log(Array.isArray(res.data.blogs));
      console.log(res.data.blogs);
      setBlogs(res.data.blogs);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1 className='text-3xl font-bold underline'>Hello world!</h1>
      <div
        style={{
          padding: "20px",
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
        }}>
        {blogs.map((blog) => (
          <Card
            key={blog._id}
            id={blog._id}
            title={blog.title}
            imgSrc={blog.featuredImage}
            content={blog.content}
            author={blog.author?.name}
          />
        ))}
      </div>
      {/* <Card
        id='1'
        title='website analytics'
        imgSrc='https://picsum.photos/300/200'
      /> */}
    </div>
  );
}

export default Home;
