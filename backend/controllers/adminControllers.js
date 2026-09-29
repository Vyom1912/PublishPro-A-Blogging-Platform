import User from "../models/User.js";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import { getPagination } from "../services/blogServices.js";

export const getAdminUsers = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query, 20);

    const [users, total] = await Promise.all([
      User.find()
        .select("name email image role createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(),
    ]);

    res.json({ success: true, users, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    const [totalUsers, totalBlogs, totalComments, views] = await Promise.all([
      User.countDocuments(),
      Blog.countDocuments(),
      Comment.countDocuments(),
      Blog.aggregate([{ $group: { _id: null, total: { $sum: "$views" } } }]),
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalBlogs,
        totalComments,
        totalViews: views[0]?.total || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminBlogs = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query, 20);

    const [blogs, total] = await Promise.all([
      Blog.find()
        .select("title label views createdAt author")
        .populate("author", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Blog.countDocuments(),
    ]);

    res.json({ success: true, blogs, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
