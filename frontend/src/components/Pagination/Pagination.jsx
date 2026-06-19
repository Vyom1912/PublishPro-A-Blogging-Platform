import React from "react";
import { useState } from "react";

function Pagination() {
  const [blogs, setBlogs] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 8;

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;

  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  return (
    <div className='pagination'>
      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((prev) => prev - 1)}>
        Previous
      </button>

      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          className={currentPage === index + 1 ? "active-page" : ""}
          onClick={() => setCurrentPage(index + 1)}>
          {index + 1}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((prev) => prev + 1)}>
        Next
      </button>
    </div>
  );
}

export default Pagination;
