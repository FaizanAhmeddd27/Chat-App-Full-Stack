import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";  

import { app, server } from "./socket/socket.js";
import userRoute from "./routes/user.route.js";
import messageRoute from "./routes/message.route.js";

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// DB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(" DB Error:", err));

// Routes
app.use("/api/user", userRoute);
app.use("/api/message", messageRoute);

// Start server
server.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});