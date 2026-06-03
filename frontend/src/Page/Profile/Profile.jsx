import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Card } from "../../components";
import api from "../../api/axios";
// import blogs from "../../data/blogs";
// import { getBlogsByAuthor } from "./../../services/blogService";

import "./Profile.css";

function Profile() {
  const { user } = useAuth();
  if (!user) {
    return <h2>Please Login</h2>;
  }
  // const myBlogs = blogs.filter((blog) => blog.author === user.name);
  // const myBlogs = getBlogsByAuthor(user.id);

  // const blog = getBlogById(id);
  const [myblogs, setMyBlogs] = useState([]);

  useEffect(() => {
    getMyBlogs();
  }, []);

  const getMyBlogs = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/blogs/my-blogs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMyBlogs(res.data.blogs);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <h1 className='text-3xl font-bold underline'>Profile</h1>
      <div className='container profile'>
        <div className='profile-info-box'>
          <div className='p-info-img'>
            <img src={user.image} alt='Image' />
          </div>
          <p className='p-info-name'>{user.name}</p>
          <div className='p-info-email'>
            <input
              type='email'
              value={user.email}
              placeholder='Email'
              readOnly
            />
          </div>
          <div className='p-info-about'>
            <textarea
              name='about'
              id='about'
              value={user.about}
              placeholder='About'
              readOnly
            />
          </div>
          <br />
          <Link to='/edit-profile' className='p-info-btn'>
            Edit Profile
          </Link>
        </div>

        <div className='profile-data-box'>
          {myblogs.map((blog) => (
            <Card
              key={blog._id}
              id={blog._id}
              title={blog.title}
              imgSrc={blog.featuredImage}
              content={blog.content}
              author={user.name}
            />
          ))}

          {/* <Card
            id='1'
            title='website analytics'
            imgSrc='https://picsum.photos/300/200'
          />
          <Card
            id='2'
            title='My Blogs'
            imgSrc='https://picsum.photos/300/200'
          />

          <Card
            id='3'
            title='website analytics'
            imgSrc='https://picsum.photos/300/200'
          /> */}
        </div>
      </div>
    </div>
  );
}

export default Profile;
