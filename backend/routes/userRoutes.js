import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadImage.js";
import {
  updateProfile,
  changePassword,
  toggleBookmark,
  getSavedBlogs,
  getBookmarkStatus,
} from "../controllers/userController.js";

const router = express.Router();

router.put("/profile", authMiddleware, upload.single("image"), updateProfile);
router.put("/change-password", authMiddleware, changePassword);

router.post("/bookmark/:blogId", authMiddleware, toggleBookmark);
router.get("/bookmark-status/:blogId", authMiddleware, getBookmarkStatus);

router.get("/saved-blogs", authMiddleware, getSavedBlogs);

export default router;
