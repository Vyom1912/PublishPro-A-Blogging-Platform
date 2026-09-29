import mongoose from "mongoose";
import Blog from "../models/Blog.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";
import { uploadImage } from "../config/cloudinary.js";
import {
  CARD_FIELDS,
  escapeRegex,
  getPagination,
  getBlogStatus,
} from "../services/blogServices.js";

const isValidId = (id) => mongoose.isValidObjectId(id);

const parseTags = (tags) => {
  if (tags === undefined || tags === null) return null;

  // Tags may arrive as a JSON-stringified array (e.g. '["a","b"]') or
  // as a plain comma-separated string — handle both gracefully.
  let parsed;
  try {
    parsed = JSON.parse(tags);
  } catch {
    parsed = String(tags).split(",");
  }
  if (!Array.isArray(parsed)) parsed = String(tags).split(",");

  return [
    ...new Set(
      parsed.map((t) => String(t).trim().toLowerCase()).filter(Boolean),
    ),
  ];
};

// Shared by the home feed and search: one page of lightweight blog cards.
const sendBlogPage = async (req, res, filter) => {
  const { page, limit, skip } = getPagination(req.query);

  const [blogs, total] = await Promise.all([
    Blog.find(filter)
      .select(CARD_FIELDS)
      .populate("author", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Blog.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: blogs.length,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    blogs,
  });
};

export const createBlog = async (req, res) => {
  try {
    const { title, description, label, tags, content } = req.body;

    // Validate before uploading so a bad request doesn't leave an orphan
    // image on Cloudinary.
    if (!title?.trim() || !description?.trim() || !label || !content?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title, description, category and content are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const result = await uploadImage(req.file.buffer);

    const blog = await Blog.create({
      title,
      description,
      label,
      tags: parseTags(tags) || [],
      content,
      featuredImage: result.secure_url,
      author: req.user.id,
    });

    res.status(201).json({
      success: true,
      blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    await sendBlogPage(req, res, {});
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyBlogs = async (req, res) => {
  try {
    const { blogs, stats } = await getBlogStatus(req.user._id);

    res.status(200).json({
      success: true,
      blogs,
      stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getBlogById = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const blog = await Blog.findById(req.params.id)
      .select("-viewedBy -savedBy")
      .populate("author", "_id name image")
      .lean();

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Send counts + the viewer's own like/save state instead of the raw
    // likes array. `viewerId` tells the client which user these flags are for.
    const viewerId = req.user ? String(req.user._id) : null;
    const { likes = [], ...rest } = blog;

    res.json({
      ...rest,
      likesCount: likes.length,
      liked: viewerId ? likes.some((uid) => String(uid) === viewerId) : false,
      bookmarked: viewerId
        ? (req.user.savedBlogs || []).some((bid) => String(bid) === String(blog._id))
        : false,
      viewerId,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { title, description, label, tags, content } = req.body;

    if (!isValidId(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Authorization check
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    blog.title = title || blog.title;
    blog.description = description || blog.description;
    blog.label = label || blog.label;

    const parsedTags = parseTags(tags);
    if (parsedTags) blog.tags = parsedTags;

    blog.content = content || blog.content;
    if (req.file) {
      const result = await uploadImage(req.file.buffer);
      blog.featuredImage = result.secure_url;
    }
    await blog.save();

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Only owner can delete
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    // Remove the blog along with its comments and any bookmarks pointing at it
    await Promise.all([
      Blog.findByIdAndDelete(req.params.id),
      Comment.deleteMany({ blog: blog._id }),
      User.updateMany(
        { savedBlogs: blog._id },
        { $pull: { savedBlogs: blog._id } },
      ),
    ]);

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const searchBlogs = async (req, res) => {
  try {
    const query = String(req.query.query || "").trim();

    if (!query) {
      return res.json({ success: true, blogs: [], total: 0, page: 1, totalPages: 0 });
    }

    const regex = { $regex: escapeRegex(query), $options: "i" };

    // Author is a ref, so we resolve matching user IDs first,
    // then include them as a separate $or condition.
    const matchingAuthors = await User.find({ name: regex }).select("_id").lean();
    const authorIds = matchingAuthors.map((u) => u._id);

    await sendBlogPage(req, res, {
      $or: [
        { title: regex },
        { tags: regex },
        { label: regex },
        ...(authorIds.length ? [{ author: { $in: authorIds } }] : []),
      ],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAutherInfo = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res
        .status(404)
        .json({ success: false, message: "Author not found" });
    }

    const author = await User.findById(req.params.id)
      // Email stays private — this endpoint is public
      .select("name image about createdAt")
      .lean();

    if (!author) {
      return res
        .status(404)
        .json({ success: false, message: "Author not found" });
    }

    const { blogs, stats } = await getBlogStatus(author._id);

    res.json({
      success: true,
      author,
      blogs,
      stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const toggleLike = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const userId = req.user._id;
    const options = { returnDocument: "after", projection: { likes: 1 } };

    // Try to unlike first; if the user hadn't liked it, nothing matches and
    // we like it instead. Both steps are atomic.
    let blog = await Blog.findOneAndUpdate(
      { _id: req.params.id, likes: userId },
      { $pull: { likes: userId } },
      options,
    );
    let liked = false;

    if (!blog) {
      blog = await Blog.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { likes: userId } },
        options,
      );
      liked = true;
    }

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.json({
      success: true,
      likesCount: blog.likes.length,
      liked,
    });
  } catch (error) {
    console.error("toggleLike error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const viewBlog = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const options = { returnDocument: "after", projection: { views: 1 } };

    // Logged-in users are counted once; guests every visit.
    let blog = req.user
      ? await Blog.findOneAndUpdate(
          { _id: req.params.id, viewedBy: { $ne: req.user._id } },
          { $inc: { views: 1 }, $addToSet: { viewedBy: req.user._id } },
          options,
        )
      : await Blog.findByIdAndUpdate(
          req.params.id,
          { $inc: { views: 1 } },
          options,
        );

    // Already viewed by this user — just read the current count
    if (!blog) blog = await Blog.findById(req.params.id).select("views");

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({ views: blog.views });
  } catch (error) {
    console.error("viewBlog error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const LABELS = [
  "Anime",
  "Art & Design",
  "Automotive",
  "Beauty",
  "Books",
  "Business",
  "Career",
  "Cloud Computing",
  "Cryptocurrency",
  "Cybersecurity",
  "Data Science",
  "DevOps",
  "Education",
  "Entertainment",
  "Fashion",
  "Finance",
  "Fitness",
  "Food",
  "Gaming",
  "Health",
  "History",
  "Home & Garden",
  "Lifestyle",
  "Mental Health",
  "Mobile Development",
  "Movies",
  "Music",
  "Nature",
  "News",
  "Open Source",
  "Personal Finance",
  "Pets",
  "Photography",
  "Politics",
  "Programming",
  "Science",
  "Software Engineering",
  "Sports",
  "Technology",
  "Travel",
  "TV Shows",
  "Web Development",
];

export const getLabels = async (req, res) => {
  // Static list — let the browser cache it for a day
  res.set("Cache-Control", "public, max-age=86400");
  res.status(200).json(LABELS);
};
