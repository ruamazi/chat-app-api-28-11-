import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import usereRoutes from "./routes/user.route.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
 cors({
  origin: "http://localhost:5173",
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
app.listen(port, async () => {
 await connectDB();
 console.log(`Server running on port: ${port}`);
});
