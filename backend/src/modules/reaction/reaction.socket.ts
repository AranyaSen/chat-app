import { Server, Socket } from "socket.io";
import { SendReactionAck, SendReactionPayload } from "./reaction.types.js";
import { ReactionService } from "./reaction.services.js";

export const sendReaction = (io: Server, socket: Socket) => {
  socket.on(
    "message:react",
    async (
      payload: SendReactionPayload,
      ack: (response: SendReactionAck) => void,
    ) => {
      try {
        const userId = socket.data?.user?.userId;
        const messageId = payload?.messageId;
        const reactionContent = payload?.reaction;

        const { reaction, userIds } = await ReactionService.reactMessage(
          userId,
          messageId,
          reactionContent,
        );

        const rooms = userIds.map((id) => `user:${id}`);
        io.to(rooms).emit("reaction:new", reaction);

        ack?.({ ok: true, reaction: reaction });
      } catch (error) {
        ack?.({ ok: false, error: (error as Error).message });
      }
    },
  );
};
