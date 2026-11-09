import { prisma } from "@/db/client.js";
import { encryptMessage } from "@/utils/encryption.js";

export class MessageRepo {
  static async sendMessage(
    conversationId: string,
    senderId: string,
    content: string,
  ) {
    const encryptedContent = encryptMessage(content);

    const message = await prisma.messages.create({
      data: {
        conversation_id: conversationId,
        sender_id: senderId,
        content: encryptedContent,
      },
      include: {
        user: {
          select: {
            username: true,
            image: true,
          },
        },
      },
    });

    // Return the message with decrypted content so the socket emits plaintext
    return { ...message, content };
  }
}
