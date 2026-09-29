import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import multer from "multer";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import adminRoutes from "./routes/adminRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// Render (and most hosts) sit behind a proxy — needed for correct req.ip
app.set("trust proxy", 1);

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:5173",
      "https://publishpro-a-blogging-platform.onrender.com",
    ],
    credentials: true,
  }),
);
// gzip every response — blog lists and article HTML shrink a lot
app.use(compression());
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Api Working",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Catches multer errors (file too large / not an image) and anything else
// thrown inside a route, so the client always gets JSON back.
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "Image must be smaller than 5 MB"
        : err.message;
    return res.status(400).json({ success: false, message });
  }

  if (err.message === "Only image files are allowed") {
    return res.status(400).json({ success: false, message: err.message });
  }

  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Something went wrong",
  });
});

app.listen(PORT, () => {
  console.log(`server at http://localhost:${PORT}`);
});
