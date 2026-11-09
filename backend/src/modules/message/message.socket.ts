import { Server, Socket } from "socket.io";
import { MessageServices } from "./message.services.js";
import { SendMessageAck, SendMessagePayload } from "./message.types.js";

export const registerMessage = (io: Server, socket: Socket): void => {
  socket.on(
    "message:send",
    async (
      payload: SendMessagePayload,
      ack: ((response: SendMessageAck) => void) | undefined,
    ) => {
      try {
        const senderId = socket.data.user.userId;
        const recipientId = payload.recipientId;
        const conversationId = payload.conversationId;
        const content = payload.content;

        const message = await MessageServices.sendMessage(
          senderId,
          recipientId,
          conversationId,
          content,
        );

        io.to(`user:${recipientId}`)
          .to(`user:${senderId}`)
          .emit("message:new", message);

        ack?.({ ok: true, message });
      } catch (error) {
        ack?.({ ok: false, error: (error as Error).message });
      }
    },
  );
};
