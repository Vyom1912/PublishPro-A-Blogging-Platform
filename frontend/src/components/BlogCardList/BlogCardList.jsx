import { Link } from "react-router-dom";
import { FaRegHeart, FaRegEye, FaRegBookmark } from "react-icons/fa6";
import Card, { CardSkeleton } from "../Card/Card";
import "./BlogCardList.css";

function BlogCardList({
  blogs,
  showActions = false,
  label,
  onDelete,
  loading = false,
  emptyText,
  emptyAction,
}) {
  return (
    <>
      {label && <h2 className='lableTitle'>{label}</h2>}

      <div className='card-container'>
        {loading &&
          Array.from({ length: 3 }, (_, i) => <CardSkeleton key={i} />)}

        {!loading && blogs.length === 0 && emptyText && (
          <div className='empty-state'>
            <p>{emptyText}</p>
            {emptyAction && (
              <Link to={emptyAction.to} className='inputBtn empty-action'>
                {emptyAction.label}
              </Link>
            )}
          </div>
        )}

        {!loading &&
          blogs.map((blog) => (
            <div key={blog._id} className='card-link my-blogs'>
              {/* Only make the card itself clickable when there are no action buttons.
                When showActions is true (My Blogs), navigation is via the Open button only. */}
              {showActions ? (
                <Card
                  title={blog.title}
                  imgSrc={blog.featuredImage}
                  description={blog.description}
                />
              ) : (
                <Link to={`/blog/${blog._id}`}>
                  <Card
                    title={blog.title}
                    imgSrc={blog.featuredImage}
                    description={blog.description}
                  />
                </Link>
              )}

              {showActions && (
                <div className='blogs-insight flex'>
                  <div className='blog-stats flex'>
                    <span title='Likes'>
                      <FaRegHeart /> {blog.likesCount || 0}
                    </span>
                    <span title='Views'>
                      <FaRegEye /> {blog.views || 0}
                    </span>
                    <span title='Saves'>
                      <FaRegBookmark /> {blog.savesCount || 0}
                    </span>
                  </div>
                  <div className='blog-actions flex'>
                    <Link to={`/blog/${blog._id}`} className='inputBtn'>
                      Open
                    </Link>
                    <Link to={`/edit-blog/${blog._id}`} className='inputBtn'>
                      Edit
                    </Link>
                    <button
                      className='inputBtn blog-delete-btn'
                      onClick={() => onDelete(blog._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
    </>
  );
}

export default BlogCardList;
