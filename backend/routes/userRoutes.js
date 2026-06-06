import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadImage.js";
import {
  updateProfile,
  changePassword,
} from "../controllers/userController.js";

const router = express.Router();

router.put("/profile", authMiddleware, upload.single("image"), updateProfile);
router.put("/change-password", authMiddleware, changePassword);
export default router;
