import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import http from "http";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.route.js";
import messageRoutes from "./routes/message.route.js";
import postRoutes from "./routes/post.route.js";  
import { initSocket } from "./socket/socket.js";

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
];

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/message", messageRoutes);


initSocket(server);

server.listen(process.env.PORT || 3000, () =>
  console.log("Server running")
);
