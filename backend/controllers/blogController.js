import Blog from "../models/Blog.js";
import cloudinary from "../config/cloudinary.js";
import User from "../models/User.js";
import upload from "../middleware/uploadImage.js";
export const createBlog = async (req, res) => {
  try {
    const { title, description, label, tags, content } = req.body;
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path);

    const tagArray = tags
      ? tags
          .split(",")
          .map((tag) => tag.trim().toLowerCase())
          .filter(Boolean)
      : [];

    // console.log(req.user);
    const blog = await Blog.create({
      title,
      description,
      label,
      tags: tagArray,
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
//
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });
    // const blogs = await Blog.find();

    res.status(200).json({
      success: true,
      count: blogs.length,
      blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({
      author: req.user.id,
    }).sort({ createdAt: -1 });

    const totalLikes = blogs.reduce(
      (sum, blog) => sum + (blog.likes?.length || 0),
      0,
    );

    const totalViews = blogs.reduce((sum, blog) => sum + (blog.views || 0), 0);

    const totalSaves = blogs.reduce(
      (sum, blog) => sum + (blog.savedBy?.length || 0),
      0,
    );

    res.status(200).json({
      success: true,
      blogs,
      stats: {
        totalBlogs: blogs.length,
        totalLikes,
        totalViews,
        totalSaves,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
//
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "author",
      "_id name email",
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }
    res.json(blog);
    // res.status(200).json({
    //   success: true,
    //   blog,
    // });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
//

export const updateBlog = async (req, res) => {
  try {
    const { title, description, label, tags, content } = req.body;

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
    blog.content = content || blog.content;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
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
//
export const deleteBlog = async (req, res) => {
  try {
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

    await Blog.findByIdAndDelete(req.params.id);

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
    const { query } = req.query;

    // const blogs = await Blog.find({
    //   title: {
    //     $regex: query,
    //     $options: "i",
    //   },
    // }).populate("author", "name");
    const blogs = await Blog.find({
      $or: [
        {
          title: {
            $regex: query,
            $options: "i",
          },
        },
        {
          tags: {
            $regex: query,
            $options: "i",
          },
        },
      ],
    }).populate("author", "name");

    res.json({
      success: true,
      blogs,
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
    const author = await User.findById(req.params.id).select(
      "name email image about createdAt",
    );

    if (!author) {
      return res
        .status(404)
        .json({ success: false, message: "Author not found" });
    }

    const blogs = await Blog.find({ author: req.params.id })
      .sort({ createdAt: -1 })
      .select("title featuredImage likes views savedBy createdAt");

    const totalLikes = blogs.reduce((sum, b) => sum + b.likes.length, 0);
    const totalViews = blogs.reduce((sum, b) => sum + b.views, 0);
    const totalSaves = blogs.reduce((sum, b) => sum + (b.savedBy?.length || 0), 0);

    res.json({
      success: true,
      author,
      blogs,
      stats: {
        totalBlogs: blogs.length,
        totalLikes,
        totalViews,
        totalSaves,
      },
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
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const userId = req.user._id.toString();
    const alreadyLiked = (blog.likes || []).some(
      (uid) => uid.toString() === userId,
    );

    // Use atomic $pull / $addToSet so missing arrays on old documents
    // are never a problem — MongoDB creates the array if it doesn't exist.
    if (alreadyLiked) {
      await Blog.findByIdAndUpdate(req.params.id, {
        $pull: { likes: req.user._id },
      });
    } else {
      await Blog.findByIdAndUpdate(req.params.id, {
        $addToSet: { likes: req.user._id },
      });
    }

    const updated = await Blog.findById(req.params.id);

    res.json({
      success: true,
      likesCount: updated.likes.length,
      liked: !alreadyLiked,
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
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (req.user) {
      const alreadyViewed = (blog.viewedBy || []).some(
        (uid) => uid.toString() === req.user._id.toString(),
      );
      if (!alreadyViewed) {
        await Blog.findByIdAndUpdate(req.params.id, {
          $inc: { views: 1 },
          $addToSet: { viewedBy: req.user._id },
        });
      }
    } else {
      await Blog.findByIdAndUpdate(req.params.id, {
        $inc: { views: 1 },
      });
    }

    const updated = await Blog.findById(req.params.id);
    res.status(200).json({ views: updated.views });
  } catch (error) {
    console.error("viewBlog error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getLabels = async (req, res) => {
  try {
    // const labels = await Label.find();
    const labels = [
      "Technology",
      "Programming",
      "Travel",
      "Food",
      "Lifestyle",
      "Sports",
    ];

    res.status(200).json(labels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
