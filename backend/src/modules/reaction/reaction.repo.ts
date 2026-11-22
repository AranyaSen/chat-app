import { prisma } from "@/db/client.js";
import { AppError } from "@/utils/appError.js";

export class ReactionRepo {
  static async reactMessage(
    userId: string,
    messageId: string,
    reaction: string,
  ) {
    return prisma.$transaction(async (tx) => {
      const message = await tx.messages.findFirst({
        where: {
          id: messageId,
          deleted_at: null,
          conversations: {
            conversation_members: {
              some: {
                user_id: userId,
              },
            },
          },
        },
        select: {
          id: true,
          conversations: {
            select: {
              conversation_members: {
                select: {
                  user_id: true,
                },
              },
            },
          },
        },
      });
      if (!message) {
        throw new AppError("MESSAGE_NOT_FOUND", 404);
      }
      const reactionRecord = tx.message_Reactions.upsert({
        where: {
          message_id_user_id: {
            message_id: messageId,
            user_id: userId,
          },
        },
        update: {
          reaction: reaction,
        },
        create: {
          message_id: messageId,
          user_id: userId,
          reaction: reaction,
        },
      });

      return {
        reaction: reactionRecord,
        userIds: message.conversations.conversation_members.map(
          (member) => member.user_id,
        ),
      };
    });
  }
}
