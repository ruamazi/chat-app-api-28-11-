import { cloudinary } from "../lib/cloudinary.js";
import User from "../models/user.model.js";

export const getCurrentUser = async (req, res) => {
 const userId = req.user._id;
 try {
  const currentUser = await User.findById(userId).select("-password");
  if (!currentUser) {
   return res.status(404).json({ error: "User not found" });
  }
  res.status(200).json(currentUser);
 } catch (error) {
  console.error("Error in getUsersForSidebar: ", error);
  res.status(500).json({ error: "Internal server error" });
 }
};

export const updatePic = async (req, res) => {
 const { profilePic } = req.body;
 const { userId } = req.user._id;
 if (!profilePic) {
  return res.status(400).json({ error: "Profile picture is required" });
 }
 const user = await User.findById(userId);
 if (user._id !== userId) {
  return res.status(401).json({ error: "You can update only your profile" });
 }
 if (user.profilePic) {
  const publicId = user.profilePic.split("/").pop().split(".")[0];
  await cloudinary.uploader.destroy(publicId);
 }
 const uploadResp = await cloudinary.upload(profilePic);
 const updateUser = await User.findByIdAndUpdate(
  userId,
  { profilePic: uploadResp.secure_url },
  { new: true }
 );
 updateUser.password = undefined;
 res.status(200).json(updateUser);
 try {
 } catch (error) {
  console.log(error);
  res.status(500).json({ error: "error whiel updating user profile" });
 }
};

export const resetUsers = async (req, res) => {
 try {
  await User.deleteMany();
  res.status(200).json({ message: "all users are deleted" });
 } catch (error) {
  console.log(error);
  res.status(500).json({ error: "error whiel resetting users" });
 }
};
