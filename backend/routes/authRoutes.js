import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword,
  changePassword,
  refreshToken,
  logoutAllDevices,
  logoutUser,
  getSessions,
  revokeSession,
} from "../controllers/authControllers.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/refresh", refreshToken);

router.post("/login", loginUser);

router.post("/logout", logoutUser);
router.post("/logout-all", authMiddleware, logoutAllDevices);

router.post("/change-password", authMiddleware, changePassword);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

router.get("/sessions", authMiddleware, getSessions);
router.delete("/sessions/:sessionId", authMiddleware, revokeSession);

router.get("/me", authMiddleware, getMe);

export default router;
