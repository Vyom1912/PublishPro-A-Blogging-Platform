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
} from "../controllers/blogController.js";
import upload from "../middleware/uploadImage.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/", getAllBlogs);

router.get("/search", searchBlogs);

router.get("/my-blogs", authMiddleware, getMyBlogs);

router.get("/:id", getBlogById);

router.post("/", authMiddleware, upload.single("titleImage"), createBlog);

router.put("/:id/like", authMiddleware, toggleLike);

router.put("/:id", authMiddleware, upload.single("titleImage"), updateBlog);
router.delete("/:id", authMiddleware, deleteBlog);

router.patch("/:id/view", authMiddleware, viewBlog);

// router.put(
//   "/profile-image",
//   authMiddleware,
//   upload.single("image"),
//   updateProfileImage,
// );

// router.put("/profile", authMiddleware, upload.single("image"), updateProfile);
export default router;
