import mongoose from "mongoose";
import User from "../models/User.js";
import Blog from "../models/Blog.js";
import { uploadImage } from "../config/cloudinary.js";
import { CARD_FIELDS } from "../services/blogServices.js";

export const updateProfile = async (req, res) => {
  try {
    const { name, email, about } = req.body;

    if (name !== undefined && !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name cannot be empty",
      });
    }

    if (email !== undefined) {
      if (!email.trim()) {
        return res.status(400).json({
          success: false,
          message: "Email cannot be empty",
        });
      }
      const taken = await User.exists({
        email: email.trim().toLowerCase(),
        _id: { $ne: req.user._id },
      });
      if (taken) {
        return res.status(400).json({
          success: false,
          message: "That email is already used by another account",
        });
      }
    }

    let imageUrl;

    if (req.file) {
      // Avatars are shown small — no need to keep more than 400px
      const result = await uploadImage(req.file.buffer, { maxWidth: 400 });

      imageUrl = result.secure_url;
    }

    const update = {
      ...(name !== undefined && { name }),
      ...(email !== undefined && { email }),
      ...(about !== undefined && { about }),
      ...(imageUrl && { image: imageUrl }),
    };

    const user = await User.findByIdAndUpdate(req.user.id, update, {
      returnDocument: "after",
      runValidators: true,
    }).select("-savedBlogs -resetPasswordToken -resetPasswordExpire");

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
    const blogId = req.params.blogId;

    if (!mongoose.isValidObjectId(blogId) || !(await Blog.exists({ _id: blogId }))) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const alreadySaved = (req.user.savedBlogs || []).some(
      (bid) => bid.toString() === blogId,
    );

    // Atomic $pull / $addToSet so missing arrays on old documents are never a problem
    const op = alreadySaved ? "$pull" : "$addToSet";

    await Promise.all([
      User.findByIdAndUpdate(req.user._id, { [op]: { savedBlogs: blogId } }),
      Blog.findByIdAndUpdate(blogId, { [op]: { savedBy: req.user._id } }),
    ]);

    res.json({ success: true, bookmarked: !alreadySaved });
  } catch (error) {
    console.error("toggleBookmark error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSavedBlogs = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("savedBlogs")
      .populate({ path: "savedBlogs", select: CARD_FIELDS })
      .lean();

    // Most recently saved first; drop entries whose blog was deleted
    const blogs = (user?.savedBlogs || []).filter(Boolean).reverse();

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

export const getBookmarkStatus = async (req, res) => {
  try {
    // req.user is already loaded by authMiddleware
    const bookmarked = (req.user.savedBlogs || []).some(
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
