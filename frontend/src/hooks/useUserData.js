import { useState, useEffect } from "react";
import api from "../api/axios";

export default function useUserData(user) {
  const [stats, setStats] = useState({
    totalBlogs: 0,
    totalLikes: 0,
    totalViews: 0,
    totalSaves: 0,
  });

  const [myBlogs, setMyBlogs] = useState([]);
  const [savedBlogs, setSavedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;
    let ignore = false;

    const fetchData = async () => {
      try {
        const [blogsRes, savedRes] = await Promise.all([
          api.get("/blogs/my-blogs"),
          api.get("/users/saved-blogs"),
        ]);
        if (ignore) return;

        setMyBlogs(blogsRes.data.blogs);
        setStats(blogsRes.data.stats);
        setSavedBlogs(savedRes.data.blogs);
      } catch (err) {
        console.error(err);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchData();
    return () => {
      ignore = true;
    };
    // Only refetch when the account changes, not on every profile edit
  }, [userId]);

  // Keep the stats in sync when a blog is deleted from the list
  const removeBlog = (id) => {
    const removed = myBlogs.find((blog) => blog._id === id);
    setMyBlogs((prev) => prev.filter((blog) => blog._id !== id));
    setSavedBlogs((prev) => prev.filter((blog) => blog._id !== id));
    if (removed) {
      setStats((prev) => ({
        totalBlogs: prev.totalBlogs - 1,
        totalLikes: prev.totalLikes - (removed.likesCount || 0),
        totalViews: prev.totalViews - (removed.views || 0),
        totalSaves: prev.totalSaves - (removed.savesCount || 0),
      }));
    }
  };

  return {
    stats,
    myBlogs,
    savedBlogs,
    loading,
    removeBlog,
  };
}
