import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ---------------------------------------------------------------------------
// Auth middleware — cookie-based
// ---------------------------------------------------------------------------
// Reads the accessToken from the httpOnly cookie set at login.
// httpOnly cookies cannot be accessed by JavaScript (XSS protection) and are
// sent automatically by the browser on every request — but only if the
// frontend uses `withCredentials: true` in its axios instance.
//
// The token is verified with JWT_SECRET. If it is expired the client should
// call POST /api/auth/refresh (which uses the refreshToken cookie) to get a
// new accessToken, then retry. The frontend axios interceptor handles this
// automatically.

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated — please log in",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the full user so controllers have access to all fields.
    // password is excluded via select:false in the schema.
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    // jwt.verify throws JsonWebTokenError or TokenExpiredError
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default authMiddleware;
