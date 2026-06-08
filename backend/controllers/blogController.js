import Blog from "../models/Blog.js";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";

// ── Create Blog ──────────────────────────────────────────────────────────────
export const createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    const result = await cloudinary.uploader.upload(req.file.path);

    const blog = await Blog.create({
      title,
      content,
      featuredImage: result.secure_url,
      author: req.user.id,
    });

    res.status(201).json({ success: true, blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Get All Blogs (paginated) ────────────────────────────────────────────────
export const getAllBlogs = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 12);
    const skip = (page - 1) * limit;

    const total = await Blog.countDocuments();
    const blogs = await Blog.find()
      .populate("author", "name email image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: blogs.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      blogs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Get My Blogs ─────────────────────────────────────────────────────────────
export const getMyBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Get Single Blog (NO auto view-increment – use POST /:id/view) ────────────
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "author",
      "name email image",
    );

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    res.json(blog);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Record a unique view (called once per session from the frontend) ──────────
export const recordView = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true },
    ).select("views");

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    res.json({ success: true, views: blog.views });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Get Author Public Profile ─────────────────────────────────────────────────
export const getAuthorProfile = async (req, res) => {
  try {
    const author = await User.findById(req.params.userId).select(
      "name email image about createdAt",
    );

    if (!author) {
      return res.status(404).json({ success: false, message: "Author not found" });
    }

    const blogs = await Blog.find({ author: req.params.userId })
      .sort({ createdAt: -1 })
      .select("title featuredImage likes views createdAt");

    const totalLikes = blogs.reduce((sum, b) => sum + b.likes.length, 0);
    const totalViews = blogs.reduce((sum, b) => sum + b.views, 0);

    res.json({
      success: true,
      author,
      blogs,
      stats: {
        totalBlogs: blogs.length,
        totalLikes,
        totalViews,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Update Blog ───────────────────────────────────────────────────────────────
export const updateBlog = async (req, res) => {
  try {
    const { title, content, featuredImage } = req.body;
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.featuredImage = featuredImage || blog.featuredImage;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      blog.featuredImage = result.secure_url;
    }

    await blog.save();
    res.status(200).json({ success: true, blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Delete Blog ───────────────────────────────────────────────────────────────
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Search Blogs ──────────────────────────────────────────────────────────────
export const searchBlogs = async (req, res) => {
  try {
    const { query } = req.query;

    const blogs = await Blog.find({
      title: { $regex: query, $options: "i" },
    }).populate("author", "name");

    res.json({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Toggle Like ───────────────────────────────────────────────────────────────
export const toggleLike = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    const alreadyLiked = blog.likes.includes(req.user.id);

    if (alreadyLiked) {
      blog.likes = blog.likes.filter((uid) => uid.toString() !== req.user.id);
    } else {
      blog.likes.push(req.user.id);
    }

    await blog.save();

    res.json({
      success: true,
      likesCount: blog.likes.length,
      liked: !alreadyLiked,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── TinyMCE Image Upload ──────────────────────────────────────────────────────
export const uploadEditorImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(req.file.path);

    // TinyMCE expects { location: "<url>" }
    res.json({ location: result.secure_url });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
