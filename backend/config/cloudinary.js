import "dotenv/config";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Uploads an in-memory file (from multer.memoryStorage) to Cloudinary.
// Big photos straight from a phone camera are capped at `maxWidth` so we
// never store (or serve) 5000px originals.
export const uploadImage = (buffer, { folder = "publishpro", maxWidth = 1600 } = {}) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [{ width: maxWidth, crop: "limit" }],
      },
      (error, result) => (error ? reject(error) : resolve(result)),
    );
    stream.end(buffer);
  });

export default cloudinary;
