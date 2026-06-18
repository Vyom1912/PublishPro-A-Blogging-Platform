import User from "../models/User.js";

export const getUserInfo = async (userId) => {
  await User.findById(userId);
};
