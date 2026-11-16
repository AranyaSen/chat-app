import { verifyAccessToken } from "@/modules/auth/auth.utils.js";
import { Socket } from "socket.io";

const getCookie = (cookieHeader: string | undefined, name: string) => {
  if (!cookieHeader) return undefined;

  for (const entry of cookieHeader.split(";")) {
    const [key, ...value] = entry.trim().split("=");

    if (key === name) return decodeURIComponent(value.join("="));
  }

  return undefined;
};

export const socketAuth = async (
  socket: Socket,
  next: (err?: Error) => void,
): Promise<void> => {
  const authHeader = socket.handshake.headers.authorization;
  const headerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  const token =
    (socket.handshake.auth?.token as string | undefined) ||
    headerToken ||
    getCookie(socket.handshake.headers.cookie, "chat-access-token");

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
