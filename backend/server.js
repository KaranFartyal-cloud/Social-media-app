import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.route.js";
import messageRoutes from "./routes/message.route.js";
import postRoutes from "./routes/post.route.js";
import { app, server } from "./socket/socket.js";
import path from "path";

dotenv.config({
  path: "./.env",
});
connectDB();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/message", messageRoutes);

server.listen(port, () => {
  console.log(`app is listening at port ${port}`);
});
