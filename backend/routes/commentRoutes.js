import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  createComment,
  getComments,
  deleteComment,
  updateComment,
} from "../controllers/commentController.js";

const router = express.Router();

router.get("/:blogId", getComments);
router.post("/:blogId", authMiddleware, createComment);

router.put("/:id", authMiddleware, updateComment);

router.delete("/:id", authMiddleware, deleteComment);
export default router;
