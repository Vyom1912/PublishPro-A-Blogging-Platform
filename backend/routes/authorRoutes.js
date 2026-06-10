import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getAutherInfo } from "../controllers/autherController.js";

const router = express.Router();

// router.get("/:id", getAutherInfo);
// router.get("/:id", authMiddleware, getAutherInfo);
router.get(
  "/:id",
  (req, res, next) => {
    console.log("Author route hit");
    next();
  },
  authMiddleware,
  getAutherInfo,
);

export default router;
