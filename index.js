import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import usereRoutes from "./routes/user.route.js";
import { app, server } from "./lib/socket.js";

app.use(express.json({ limit: "3mb" }));
app.use(cookieParser());
app.use(
 cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
 })
);

app.use("/api/auth", authRoutes);
app.use("/api/msg", messageRoutes);
app.use("/api/user", usereRoutes);

app.get("/api", (req, res) => {
 res.json({ message: "welcone to chat app API" });
});

const port = process.env.PORT || 3033;
server.listen(port, async () => {
 await connectDB();
 console.log(`Server running on port: ${port}`);
});
