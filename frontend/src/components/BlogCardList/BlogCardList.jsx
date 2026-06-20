import { Card } from "..";
import { Link } from "react-router-dom";
function BlogCardList({ blogs, showActions = false, onDelete }) {
  return (
    <div className='card-container'>
      {blogs.map((blog) => (
        <div key={blog._id} className='card-link my-blogs'>
          <Card
            id={blog._id}
            title={blog.title}
            imgSrc={blog.featuredImage}
            content={blog.content}
            description={blog.description}
          />
          {showActions && (
            <div className='blogs-insight flex'>
              <div className='blog-stats flex'>
                <span>❤️{blog.likes?.length || 0}</span>
                <span>👁️{blog.views || 0}</span>
                <span>🔖{blog.savedBy?.length || 0}</span>
              </div>
              <div className='blog-actions flex'>
                <Link to={`/blog/${blog._id}`} className='inputBtn'>
                  Open
                </Link>
                <Link to={`/edit-blog/${blog._id}`} className=' inputBtn '>
                  Edit
                </Link>
                <button
                  className=' inputBtn'
                  onClick={() => onDelete(blog._id)}>
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default BlogCardList;
