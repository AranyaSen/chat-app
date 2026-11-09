import { Server } from "socket.io";

let io: Server | undefined;

export const setIO = (instance: Server): void => {
  io = instance;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.io is not initialised");
  }
  return io;
};
