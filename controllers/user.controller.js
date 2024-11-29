import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { fileTypeFromBuffer } from "file-type";

export const getUsers = async (req, res) => {
 const userId = req.user._id;
 try {
  const filteredUsers = await User.find({ _id: { $ne: userId } }).select(
   "-password -rule"
  );
  if (!filteredUsers) {
   return res.status(404).json({ error: "No users available" });
  }
  res.status(200).json(filteredUsers);
 } catch (error) {
  console.error("Error in getUsersForSidebar: ", error);
  res.status(500).json({ error: "Internal server error" });
 }
};

export const updatePic = async (req, res) => {
 const { profilePic } = req.body;
 const userId = req.user._id;
 if (!profilePic) {
  return res.status(400).json({ error: "Profile picture is required" });
 }
 try {
  const user = await User.findById(userId);
  if (!user) {
   return res.status(404).json({ error: "User not found" });
  }
  // Decode the base64 profilePic to a buffer
  const base64Data = profilePic.replace(/^data:image\/\w+;base64,/, "");
  const imgBuffer = Buffer.from(base64Data, "base64");
  const maxSize = 1 * 1024 * 1024; // 2MB in bytes
  if (imgBuffer.length > maxSize) {
   return res.status(400).json({ error: "File size exceeds 1MB limit" });
  }
  const type = await fileTypeFromBuffer(imgBuffer);
  if (!type || !["image/jpeg", "image/jpg", "image/png"].includes(type.mime)) {
   return res
    .status(400)
    .json({ error: "Only JPEG, JPG or PNG images are allowed" });
  }
  if (user.profilePic) {
   const publicId = user.profilePic.split("/").pop().split(".")[0];
   await cloudinary.uploader.destroy(publicId);
  }
  const uploadResp = await cloudinary.uploader.upload(profilePic);
  const updateUser = await User.findByIdAndUpdate(
   userId,
   { profilePic: uploadResp.secure_url },
   { new: true }
  );
  updateUser.password = undefined;
  res.status(200).json(updateUser);
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
