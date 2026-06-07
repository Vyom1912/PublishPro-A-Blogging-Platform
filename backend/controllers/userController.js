import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import upload from "../middleware/uploadImage.js";
import cloudinary from "../config/cloudinary.js";
// import {navigation} from
export const updateProfile = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    console.log("USER:", req.user);
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

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password updated successfully",
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

    const blogId = req.params.blogId;

    const alreadySaved = user.savedBlogs.includes(blogId);

    if (alreadySaved) {
      user.savedBlogs = user.savedBlogs.filter(
        (id) => id.toString() !== blogId,
      );

      await user.save();

      return res.json({
        success: true,
        bookmarked: false,
      });
    }

    user.savedBlogs.push(blogId);

    await user.save();

    res.json({
      success: true,
      bookmarked: true,
    });
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
