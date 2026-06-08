import express from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  getMyBlogs,
  getAuthorProfile,
  updateBlog,
  deleteBlog,
  searchBlogs,
  toggleLike,
  uploadEditorImage,
  recordView,
} from "../controllers/blogController.js";
import upload from "../middleware/uploadImage.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ── Static GET routes first (before /:id so Express doesn't swallow them) ──
router.get("/", getAllBlogs);
router.get("/search", searchBlogs);
router.get("/my-blogs", authMiddleware, getMyBlogs);
router.get("/author/:userId", getAuthorProfile);

// ── Static POST routes (before /:id/view so /upload-image isn't matched as :id) ──
router.post("/", authMiddleware, upload.single("titleImage"), createBlog);
router.post("/upload-image", authMiddleware, upload.single("file"), uploadEditorImage);

// ── Parameterised routes ──
router.get("/:id", getBlogById);
router.post("/:id/view", recordView);          // session-deduped view count

router.put("/:id/like", authMiddleware, toggleLike);
router.put("/:id", authMiddleware, upload.single("titleImage"), updateBlog);
router.delete("/:id", authMiddleware, deleteBlog);

export default router;
