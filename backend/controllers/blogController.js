import Blog from "../models/Blog.js";
import cloudinary from "../config/cloudinary.js";
import User from "../models/User.js";
import upload from "../middleware/uploadImage.js";
export const createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path);

    console.log(req.user);
    const blog = await Blog.create({
      title,
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
//

export const getMyBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({
      author: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
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
//
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "author",
      "name email",
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
    const { title, content, featuredImage } = req.body;

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
    blog.content = content || blog.content;
    blog.featuredImage = featuredImage || blog.featuredImage;
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

    const blogs = await Blog.find({
      title: {
        $regex: query,
        $options: "i",
      },
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

export const toggleLike = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const alreadyLiked = blog.likes.includes(req.user.id);

    if (alreadyLiked) {
      blog.likes = blog.likes.filter(
        (userId) => userId.toString() !== req.user.id,
      );
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
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
