import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadImage.js";
import {
  updateProfile,
  toggleBookmark,
  getSavedBlogs,
  getBookmarkStatus,
} from "../controllers/userController.js";
import { changePassword } from "../controllers/authControllers.js";

const router = express.Router();

router.put("/profile", authMiddleware, upload.single("image"), updateProfile);

// EditPassword page calls PUT /users/change-password
// (changePassword logic lives in authControllers but is also reachable here)
router.put("/change-password", authMiddleware, changePassword);

router.post("/bookmark/:blogId", authMiddleware, toggleBookmark);
router.get("/bookmark-status/:blogId", authMiddleware, getBookmarkStatus);

router.get("/saved-blogs", authMiddleware, getSavedBlogs);

export default router;
