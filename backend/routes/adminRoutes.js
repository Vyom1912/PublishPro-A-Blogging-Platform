import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import {
  getAdminBlogs,
  getAdminStats,
  getAdminUsers,
} from "../controllers/adminControllers.js";

const router = express.Router();

// Every admin route needs a logged-in user with the admin role
router.use(authMiddleware, authorize("admin"));

router.get("/users", getAdminUsers);
router.get("/stats", getAdminStats);
router.get("/blogs", getAdminBlogs);

export default router;
