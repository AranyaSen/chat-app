import { env } from "@/config/env.js";
import { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import { setIO } from "./io.js";
import { socketAuth } from "./middleware/socket.auth.js";
import { registerMessage } from "@/modules/message/message.socket.js";

export const initialiseSockets = (httpServer: HttpServer): Server => {
  const io = new Server(httpServer, {
    cors: { origin: env.CORS_ORIGINS.split(","), credentials: true },
  });

  setIO(io);

  io.use(socketAuth);

  io.on("connect", (socket) => {
    socket.join(`user:${socket.data.user.userId}`);

    //Register sockets
    registerMessage(io, socket);

    socket.on("disconnect", () => {
      console.log("disconnected", socket.id, `user:${socket.data.user.userId}`);
    });
  });

  return io;
};
