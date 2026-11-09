import { Server, Socket } from "socket.io";
import { MessageServices } from "./message.services.js";

export const registerMessage = (io: Server, socket: Socket): void => {
  socket.on("message:send", async (payload, ack) => {
    try {
      const senderId = socket.data.user.id;
      const reciepentId = payload.reciepentId;
      const conversationId = payload.conversationId;
      const content = payload.content;

      const message = await MessageServices.sendMessage(
        senderId,
        reciepentId,
        conversationId,
        content,
      );

      io.to(`receiver:${reciepentId}`)
        .to(`sender:${senderId}`)
        .emit("message:new", message);

      ack?.({ ok: true, message });
    } catch (error) {
      ack?.({ ok: false, error: (error as Error).message });
    }
  });
};
