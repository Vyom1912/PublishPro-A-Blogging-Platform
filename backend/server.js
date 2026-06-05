import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import userRoutes from "./routes/userRoutes.js";
const app = express();

connectDB();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Api Working",
  });
});

app.use("/api/auth", authRoutes);

app.use("/api/blogs", blogRoutes);
app.use("/api/users", userRoutes);
app.listen(process.env.PORT, () => {
  console.log("server at http://localhost:5000");
});
