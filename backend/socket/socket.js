import { Server } from "socket.io";
import express from "express";
import http from "http";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://social-media-app-1-33ak.onrender.com",
    methods: ["GET", "POST"],
  },
});

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
