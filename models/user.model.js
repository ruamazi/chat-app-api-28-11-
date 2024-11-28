import { Schema, model } from "mongoose";

const userSchema = new Schema(
 {
  email: {
   type: String,
   required: true,
   unique: true,
  },
  username: {
   type: String,
   required: true,
   unique: true,
  },
  password: {
   type: String,
   required: true,
  },
  profilePic: {
   type: String,
   default: "",
  },
  role: {
   type: String,
   enum: ["user", "admin", "superAdmin"],
   default: "user",
  },
 },
 { timestamps: true }
);

const User = model("User", userSchema);

export default User;
