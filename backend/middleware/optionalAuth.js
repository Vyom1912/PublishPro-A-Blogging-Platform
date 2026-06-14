import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ---------------------------------------------------------------------------
// Optional auth middleware
// ---------------------------------------------------------------------------
// Like authMiddleware, but does NOT block the request if no token is present.
// It attaches req.user if a valid token exists, otherwise sets req.user = null.
// Use this for routes that work for both guests and logged-in users
// (e.g. view counts — guests increment the count, logged-in users are
// deduplicated via the viewedBy array).

const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      req.user = null;
      return next(); // unauthenticated — continue without user
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    req.user = user || null;
  } catch (_) {
    // Malformed or expired token — treat as unauthenticated
    req.user = null;
  }

  next();
};

export default optionalAuth;
