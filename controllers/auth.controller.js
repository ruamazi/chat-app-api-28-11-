import { body, validationResult } from "express-validator";
import User from "../models/user.model.js";
import { hashPsw } from "../lib/hashPsw.js";
import { COOKIE_NAME, generateToken } from "../lib/generateToken.js";
import bcrypt from "bcryptjs";

export const validateSignUp = [
 body("username")
  .isLength({ min: 3, max: 20 })
  .withMessage("Username must be between 3 and 20 characters")
  .isAlphanumeric()
  .withMessage("Username must be alphanumeric"),
 body("email").isEmail().withMessage("Please provide a valid email address"),
 body("password")
  .isLength({ min: 8 })
  .withMessage("Password must be at least 8 characters long")
  .matches(/[0-9]/)
  .withMessage("Password must contain at least 1 number")
  .matches(/[A-Z]/)
  .withMessage("Password must contain at least 1 uppercase letter"),
];

export const signup = async (req, res) => {
 const { username, email, password } = req.body;
 try {
  if (!username || !email || !password) {
   return res.status(400).json({ message: "All fields are required" });
  }
  const alphanumericRegex = /^[a-zA-Z0-9]+$/;
  if (!alphanumericRegex.test(username)) {
   return res
    .status(400)
    .json({ error: "Only letters and numbers allowed to use in username" });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
   return res.status(400).json({ errors: errors.array() });
  }

  const isEmailExists = await User.findOne({ email });
  if (isEmailExists) {
   return res.status(400).json({
    error: "You are already registred with this email, please sign in",
   });
  }
  const normalizedUsername = username.toLowerCase();
  const isUsernameExists = await User.findOne({ normalizedUsername });
  if (isUsernameExists) {
   return res.status(400).json({
    error: "username has already been taken",
   });
  }
  const hashedPsw = await hashPsw(password);
  const newUser = new User({
   username: normalizedUsername,
   email,
   password: hashedPsw,
  });
  if (!newUser) {
   return res.status(400).json({ error: "Invalid data" });
  }
  generateToken(newUser._id, res);
  await newUser.save();
  newUser.password = undefined;
  return res.status(201).json(newUser);
 } catch (error) {
  console.log(error);
  res.status(500).json({ error: "error while signing up" });
 }
};

export const signin = async (req, res) => {
 const { email, password } = req.body;
 if (!email || !password) {
  return res
   .status(400)
   .json({ message: "Email and Password are required for signin" });
 }
 try {
  const user = await User.findOne({ email });
  if (!user) {
   return res.status(401).json({ error: "Incorrect Credentials" });
  }
  const checkPsw = await bcrypt.compare(password, user.password);
  if (!checkPsw) {
   return res.status(401).json({ error: "Incorrect Credentials" });
  }
  generateToken(user._id, res);
  user.password = undefined;
  return res.status(200).json(user);
 } catch (error) {
  console.log(error);
  res.status(500).json({ error: "error while signing in" });
 }
};

export const signout = async (req, res) => {
 try {
  res.cookie(COOKIE_NAME, "", { maxAge: 0 });
  return res.status(200).json({ message: "Logged out successfully" });
 } catch (error) {
  console.log(error);
  res.status(500).json({ error: "error whiel signing out" });
 }
};

export const checkAuth = (req, res) => {
 try {
  res.status(200).json(req.user);
 } catch (error) {
  console.log(error);
  res.status(500).json({ error: "Error while checking auth" });
 }
};
