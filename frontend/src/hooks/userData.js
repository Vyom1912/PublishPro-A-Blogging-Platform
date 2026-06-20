import { useState, useEffect } from "react";
import api from "../api/axios";

export default function userData(user) {
  const [stats, setStats] = useState({
    totalBlogs: 0,
    totalLikes: 0,
    totalViews: 0,
    totalSaves: 0,
  });

  const [myBlogs, setMyBlogs] = useState([]);
  const [savedBlogs, setSavedBlogs] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [blogsRes, savedRes] = await Promise.all([
          api.get("/blogs/my-blogs"),
          api.get("/users/saved-blogs"),
        ]);

        setMyBlogs(blogsRes.data.blogs);
        setStats(blogsRes.data.stats);
        setSavedBlogs(savedRes.data.blogs);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [user]);

  return {
    stats,
    myBlogs,
    savedBlogs,
    setMyBlogs,
  };
}
