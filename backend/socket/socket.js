import { Server } from "socket.io";
import express from "express";
import http from "http";
import cors from "cors";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

const userSocketmap = {};

export const getReceiverSocketId = (receiverId) => {
  return userSocketmap[receiverId];
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketmap[userId] = socket.id;
    // console.log(userSocketmap);
    // console.log(`user connected user Id = ${userId} socketID = ${socket.id}`);
  }

  io.emit("getOnlineUsers", Object.keys(userSocketmap));

  socket.on("disconnect", () => {
    if (userId) {
      console.log(
        `user disconnected user Id = ${userId} socketID = ${socket.id}`
      );
      delete userSocketmap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketmap));
    }
  });
});

export { app, server, io };
