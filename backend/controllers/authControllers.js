import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import Session from "../models/Session.js";

import sendMail from "../utils/sendMail.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateTokens.js";

// ---------------------------------------------------------------------------
// Helper — sets both auth cookies on the response
// ---------------------------------------------------------------------------
// Centralising cookie options here means we only have one place to update
// if we ever change the cookie settings (e.g. secure: true in production).
const setAuthCookies = (res, accessToken, refreshToken) => {
  // httpOnly prevents JavaScript from reading the token (XSS protection).
  // secure should be true in production (HTTPS only).
  // sameSite: "lax" allows the cookie to be sent on top-level navigations
  // and same-site requests, which is right for a standard web app.
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// ---------------------------------------------------------------------------
// Register
// ---------------------------------------------------------------------------
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    // Prevent duplicate accounts
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Issue the same access/refresh token pair as login so the user is
    // immediately authenticated after registering.
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Persist the session so the refresh token can be validated later
    await Session.create({
      user: user._id,
      refreshToken,
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    setAuthCookies(res, accessToken, refreshToken);

    res.status(201).json({
      success: true,
      message: "User Created Successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        about: user.about,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    // password has select:false in the schema, so we must explicitly select it
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      // Use a generic message to avoid leaking whether the email exists
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store the session so we can validate and revoke refresh tokens
    await Session.create({
      user: user._id,
      refreshToken,
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    setAuthCookies(res, accessToken, refreshToken);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        about: user.about,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ---------------------------------------------------------------------------
// Refresh access token
// ---------------------------------------------------------------------------
export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "No refresh token" });
    }

    // Verify the token signature and expiry
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    // Also check our Session store — this lets us revoke tokens server-side
    // (e.g. after password change or explicit logout-all-devices)
    const session = await Session.findOne({ refreshToken: token });
    if (!session) {
      return res.status(401).json({ message: "Session revoked or not found" });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const newAccessToken = generateAccessToken(user);

    // Only the access token is refreshed; the refresh token stays the same
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.json({ message: "Token refreshed" });
  } catch (error) {
    // jwt.verify throws if the token is expired or tampered with
    res.status(401).json({ message: "Refresh failed — please log in again" });
  }
};

// ---------------------------------------------------------------------------
// Logout (current device)
// ---------------------------------------------------------------------------
export const logoutUser = async (req, res) => {
  // Delete just the session for the current refresh token
  await Session.deleteOne({ refreshToken: req.cookies.refreshToken });

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.json({ message: "Logged out successfully" });
};

// ---------------------------------------------------------------------------
// Logout all devices
// ---------------------------------------------------------------------------
export const logoutAllDevices = async (req, res) => {
  // req.user is set by authMiddleware
  await Session.deleteMany({ user: req.user._id });

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.json({ message: "Logged out from all devices" });
};

// ---------------------------------------------------------------------------
// Get current user (used by AuthContext on app load)
// ---------------------------------------------------------------------------
export const getMe = async (req, res) => {
  // req.user is already the full user document (minus password) from authMiddleware
  const user = await User.findById(req.user.id).select("-password");

  res.json({
    success: true,
    user,
  });
};

// ---------------------------------------------------------------------------
// Change password (requires current password confirmation)
// ---------------------------------------------------------------------------
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Re-fetch with password since it has select:false in the schema
    const user = await User.findById(req.user.id).select("+password");

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    // Invalidate all sessions after a password change — security best practice.
    // Any stolen refresh tokens are now useless.
    await Session.deleteMany({ user: user._id });

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.json({
      success: true,
      message: "Password updated. Please log in again.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ---------------------------------------------------------------------------
// Forgot password — sends reset email
// ---------------------------------------------------------------------------
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      // Return 200 even if user not found to avoid email enumeration attacks
      return res.json({
        success: true,
        message: "If that email exists, a reset link has been sent",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendMail({
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <h2>Password Reset</h2>
        <p>You requested a password reset. This link expires in 15 minutes.</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>If you didn't request this, ignore this email.</p>
      `,
    });

    res.json({
      success: true,
      message: "If that email exists, a reset link has been sent",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------------------------------------------------------------------
// Reset password — consumes the token from the email link
// ---------------------------------------------------------------------------
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() }, // token must not be expired
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Revoke all sessions — forces fresh login with new password
    await Session.deleteMany({ user: user._id });

    res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------------------------------------------------------------------
// Session management
// ---------------------------------------------------------------------------
export const getSessions = async (req, res) => {
  try {
    // Never expose the raw refresh token to the client
    const sessions = await Session.find({ user: req.user._id }).select(
      "-refreshToken",
    );
    res.json({ sessions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const revokeSession = async (req, res) => {
  // Verify the session belongs to the current user before deleting
  const session = await Session.findOne({
    _id: req.params.sessionId,
    user: req.user._id,
  });

  if (!session) {
    return res.status(404).json({ message: "Session not found" });
  }

  await session.deleteOne();

  res.json({ message: "Session revoked" });
};
