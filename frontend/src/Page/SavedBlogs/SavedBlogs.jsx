import { useEffect, useState } from "react";
import api from "../../api/axios";
import BlogCardList from "../../components/BlogCardList/BlogCardList";

function SavedBlogs() {
  const [savedBlogs, setSavedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/users/saved-blogs")
      .then((res) => setSavedBlogs(res.data.blogs))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className='containerBox'>
      <BlogCardList
        blogs={savedBlogs}
        label='Saved Blogs'
        loading={loading}
        emptyText='Blogs you save will show up here.'
        emptyAction={{ to: "/", label: "Browse blogs" }}
      />
    </div>
  );
}

export default SavedBlogs;
