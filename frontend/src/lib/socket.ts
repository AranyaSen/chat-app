import { io, type Socket } from "socket.io-client";
import { SOCKET_URL_PATH } from "@/config/env";

export const socket: Socket = io({
  path: SOCKET_URL_PATH,
  withCredentials: true,
  autoConnect: false,
});
