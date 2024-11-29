import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import { io, getReceiverSocketId } from "../lib/socket.js";

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
 let imageUrl;
 try {
  if (image) {
   const uoloadResp = await cloudinary.uploader.upload(image);
   imageUrl = uoloadResp.secure_url;
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
