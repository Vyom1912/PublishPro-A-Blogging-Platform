import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getAdminBlogs,
  getAdminStats,
  getAdminUsers,
} from "../controllers/adminControllers.js";

const router = express.Router();

router.get("/users", getAdminUsers);
router.get("/stats", getAdminStats);
router.get("/blogs", getAdminBlogs);

export default router;
