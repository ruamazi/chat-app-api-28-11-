import jwt from "jsonwebtoken";

export const COOKIE_NAME = "chat_jwt";

export const generateToken = (userId, res) => {
 const token = jwt.sign({ userId }, process.env.JWT_SEC, {
  expiresIn: "7d",
 });
 res.cookie(COOKIE_NAME, token, {
  maxAge: 7 * 24 * 60 * 60 * 1000, // MS
  httpOnly: true, // prevent XSS attacks cross-site scripting attacks
  sameSite: "Strict",
  secure: process.env.NODE_ENV !== "development",
 });
 return token;
};
