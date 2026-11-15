import { verifyAccessToken } from "@/modules/auth/auth.utils.js";
import { Socket } from "socket.io";

export const socketAuth = async (
  socket: Socket,
  next: (err?: Error) => void,
): Promise<void> => {
  const authHeader = socket.handshake.headers.authorization;
  const headerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  const token =
    (socket.handshake.auth?.token as string | undefined) || headerToken;

  if (!token) {
    return next(new Error("UNAUTHORIZED"));
  }
  try {
    socket.data.user = await verifyAccessToken(token);
    next();
  } catch (error) {
    next(new Error("UNAUTHORIZED"));
  }
};
