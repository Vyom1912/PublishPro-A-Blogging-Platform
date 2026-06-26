import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import adminRoutes from "./routes/adminRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

const app = express();

connectDB();

app.use(
  cors({
    origin: [
<<<<<<< HEAD
      "http://localhost:5173",
=======
      process.env.FRONTEND_URL || "http://localhost:5173",
>>>>>>> 72a846025add2b621876a7208e8ffe1060c0f81b
      "https://publishpro-a-blogging-platform.onrender.com",
    ],
    credentials: true,
  }),
);
app.use(express.json());
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

app.listen(process.env.PORT, () => {
  console.log("server at http://localhost:5000");
});
