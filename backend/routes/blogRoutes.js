import express from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  getMyBlogs,
  updateBlog,
  deleteBlog,
  searchBlogs,
  toggleLike,
  viewBlog,
  getAutherInfo,
  getLabels,
} from "../controllers/blogController.js";

import upload from "../middleware/uploadImage.js";
import authMiddleware from "../middleware/authMiddleware.js";
import optionalAuth from "../middleware/optionalAuth.js";

const router = express.Router();

router.get("/", getAllBlogs);
router.get("/labels", getLabels);

router.get("/search", searchBlogs);

router.get("/my-blogs", authMiddleware, getMyBlogs);

router.get("/author/:id", getAutherInfo);

router.get("/:id", getBlogById);

router.post("/", authMiddleware, upload.single("titleImage"), createBlog);

router.put("/:id/like", authMiddleware, toggleLike);

router.put("/:id", authMiddleware, upload.single("titleImage"), updateBlog);
router.delete("/:id", authMiddleware, deleteBlog);

// optionalAuth so view counts work for both guests and logged-in users
router.patch("/:id/view", optionalAuth, viewBlog);

// router.put(
//   "/profile-image",
//   authMiddleware,
//   upload.single("image"),
//   updateProfileImage,
// );

// router.put("/profile", authMiddleware, upload.single("image"), updateProfile);
export default router;
