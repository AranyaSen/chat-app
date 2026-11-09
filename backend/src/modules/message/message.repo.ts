import { prisma } from "@/db/client.js";

export class MessageRepo {
  static async sendMessage(
    conversationId: string,
    senderId: string,
    content: string,
  ) {
    return await prisma.messages.create({
      data: {
        conversation_id: conversationId,
        sender_id: senderId,
        content: content,
      },
    });
  }
}
