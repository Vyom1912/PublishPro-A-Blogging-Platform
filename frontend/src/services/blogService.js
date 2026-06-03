// src/services/blogService.js

import blogs from "../data/blogs";

// it can be an API call in future, but for now we are using static data from blogs.js
export const getBlogs = () => {
  return blogs;
};

// it can be an API call in future, but for now we are using static data from blogs.js
export const getBlogById = (id) => {
  return blogs.find((blog) => blog.id === Number(id));
};

export const getBlogsByAuthor = (authorId) => {
  return blogs.filter((blog) => blog.authorId === authorId);
};
