import User from "../models/User.js";
import Blog from "../models/Blog.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import upload from "../middleware/uploadImage.js";
import cloudinary from "../config/cloudinary.js";

export const updateProfile = async (req, res) => {
  try {
    let imageUrl;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);

      imageUrl = result.secure_url;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: req.body.name,
        email: req.body.email,
        about: req.body.about,
        ...(imageUrl && { image: imageUrl }),
      },
      { new: true },
    );

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const toggleBookmark = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const blog = await Blog.findById(req.params.blogId);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const blogId = req.params.blogId;
    const userId = req.user._id.toString();

    const alreadySaved = user.savedBlogs.some(
      (id) => id.toString() === blogId,
    );

    if (alreadySaved) {
      // Remove from user's savedBlogs and blog's savedBy
      user.savedBlogs = user.savedBlogs.filter(
        (id) => id.toString() !== blogId,
      );
      blog.savedBy = blog.savedBy.filter(
        (id) => id.toString() !== userId,
      );

      await user.save();
      await blog.save();

      return res.json({ success: true, bookmarked: false });
    }

    // Add to both sides
    user.savedBlogs.push(blogId);
    blog.savedBy.push(userId);

    await user.save();
    await blog.save();

    res.json({ success: true, bookmarked: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSavedBlogs = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("savedBlogs");

    res.json({
      success: true,
      blogs: user.savedBlogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getBookmarkStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const bookmarked = user.savedBlogs.some(
      (id) => id.toString() === req.params.blogId,
    );

    res.json({
      success: true,
      bookmarked,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const deleteUser = (req, res) => {};
