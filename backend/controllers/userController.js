import User from "../models/User.js";
import upload from "../middleware/uploadImage.js";
export const updateProfile = async (req, res) => {
  try {
    let imageUrl;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);

      imageUrl = result.secure_url;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: req.body.name,
        email: req.body.email,
        about: req.body.about,
        ...(imageUrl && { image: imageUrl }),
      },
      { new: true },
    );

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
