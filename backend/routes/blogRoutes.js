import express from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  getMyBlogs,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";
import upload from "../middleware/uploadImage.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/", getAllBlogs);
router.post("/", authMiddleware, upload.single("titleImage"), createBlog);

router.get("/my-blogs", authMiddleware, getMyBlogs);

router.get("/:id", getBlogById);
router.put("/:id", authMiddleware, upload.single("titleImage"), updateBlog);
router.delete("/:id", authMiddleware, deleteBlog);

// router.put(
//   "/profile-image",
//   authMiddleware,
//   upload.single("image"),
//   updateProfileImage,
// );

// router.put("/profile", authMiddleware, upload.single("image"), updateProfile);
export default router;
