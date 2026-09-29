import mongoose from "mongoose";
import Blog from "../models/Blog.js";

// Fields a blog card needs — never send `content` (full article HTML) or the
// likes / viewedBy / savedBy arrays in list responses.
export const CARD_FIELDS = "title description featuredImage label createdAt author";

// Escape user input before putting it in a $regex, otherwise a search for
// "c++" or "(" throws and the endpoint returns 500.
export const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const getPagination = (query, defaultLimit = 8) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || defaultLimit, 1), 50);
  return { page, limit, skip: (page - 1) * limit };
};

// All blogs by one author with like / save counts, plus totals.
// Counts are computed in MongoDB so the arrays never leave the database.
export const getBlogStatus = async (authorId) => {
  const blogs = await Blog.aggregate([
    { $match: { author: new mongoose.Types.ObjectId(String(authorId)) } },
    { $sort: { createdAt: -1 } },
    {
      $project: {
        title: 1,
        description: 1,
        featuredImage: 1,
        label: 1,
        views: 1,
        createdAt: 1,
        likesCount: { $size: { $ifNull: ["$likes", []] } },
        savesCount: { $size: { $ifNull: ["$savedBy", []] } },
      },
    },
  ]);

  const stats = blogs.reduce(
    (acc, b) => ({
      totalBlogs: acc.totalBlogs + 1,
      totalLikes: acc.totalLikes + b.likesCount,
      totalViews: acc.totalViews + (b.views || 0),
      totalSaves: acc.totalSaves + b.savesCount,
    }),
    { totalBlogs: 0, totalLikes: 0, totalViews: 0, totalSaves: 0 },
  );

  return { blogs, stats };
};
