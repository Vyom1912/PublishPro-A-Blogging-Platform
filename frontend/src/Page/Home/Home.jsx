import { useEffect, useState } from "react";
import { Card } from "../../components";
import api from "../../api/axios.js";
import "./Home.css";
function Home() {
  const [blogs, setBlogs] = useState([]);
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
    <div className='home-container'>
      {/* <h1 className='text-3xl font-bold underline'>Hello world!</h1> */}
      <div className='home-blogs-box'>
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
