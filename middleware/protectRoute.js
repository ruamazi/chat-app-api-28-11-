import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
 try {
  const token = req.cookies.chat_jwt;
  if (!token) {
   return res.status(401).json({ error: "Unauthorized - No Token Provided" });
  }
  const decoded = jwt.verify(token, process.env.JWT_SEC);
  if (!decoded) {
   return res.status(401).json({ error: "Unauthorized - Invalid Token" });
  }
  const user = await User.findById(decoded.userId).select("-password");
  if (!user) {
   return res.status(404).json({ error: "User not found" });
  }
  req.user = user;
  next();
 } catch (error) {
  console.log(error);
  res
   .status(403)
   .json({ error: "you don't have permission to access this resource" });
 }
};
