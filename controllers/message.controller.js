import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import { io, getReceiverSocketId } from "../lib/socket.js";
import { fileTypeFromBuffer } from "file-type";

export const getMessages = async (req, res) => {
 const userId = req.user._id;
 const otherUserId = req.params.id;
 try {
  const messages = await Message.find({
   $or: [
    { senderId: userId, receiverId: otherUserId },
    { senderId: otherUserId, receiverId: userId },
   ],
  });
  res.status(200).json(messages);
 } catch (error) {
  console.log(error);
  res.status(500).json({ error: "Ian error occurred while getting messages" });
 }
};

export const sendMessage = async (req, res) => {
 const { text, image } = req.body;
 if (!image && (!text || text.trim().length === 0)) {
  return res.status(400).json({ error: "text message must contain a value" });
 }
 const senderId = req.user._id;
 const receiverId = req.params.id;
 // Decode the base64 profilePic to a buffer
 if (image) {
  const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
  const imgBuffer = Buffer.from(base64Data, "base64");
  const maxSize = 7 * 1024 * 1024; // 7MB in bytes
  if (imgBuffer.length > maxSize) {
   return res.status(400).json({ error: "File size exceeds 5MB limit" });
  }
  //check file type
  const type = await fileTypeFromBuffer(imgBuffer);
  if (!type || !["image/jpeg", "image/jpg", "image/png"].includes(type.mime)) {
   return res
    .status(400)
    .json({ error: "Only JPEG, JPG or PNG images are allowed" });
  }
 }
 let imageUrl;
 try {
  if (image) {
   const uoloadResp = await cloudinary.uploader.upload(image, {
    resource_type: "image",
    use_filename: false,
    unique_filename: true,
    transformation: [{ width: 250, crop: "scale" }],
   });
   imageUrl = uoloadResp.secure_url;
  }
  // Find all previous messages between sender and receiver that contain an image
  const messages = await Message.find({
   $or: [
    { senderId, receiverId },
    { senderId: receiverId, receiverId: senderId },
   ],
   image: { $exists: true, $ne: null }, // Filter only messages with an image
  }).sort({ createdAt: 1 });
  if (messages.length >= 10) {
   const oldestMessage = messages[0]; // Get the oldest image message
   const publicId = oldestMessage.image.split("/").pop().split(".")[0];
   await cloudinary.uploader.destroy(publicId);
   await Message.findByIdAndDelete(oldestMessage._id);
  }

  const newMessage = new Message({
   senderId,
   receiverId,
   text,
   image: imageUrl,
  });
  await newMessage.save();

  const receiverSocketId = getReceiverSocketId(receiverId);
  if (receiverSocketId) {
   io.to(receiverSocketId).emit("newMessage", newMessage);
  }

  res.status(201).json(newMessage);
 } catch (error) {
  console.log(error);
  res.status(500).json({ error: "Ian error occurred while getting messages" });
 }
};
