import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },

    about: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      default: "user",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);
