import { AppError } from "@/utils/appError.js";
import { ConversationsRepo } from "../conversation/conversation.repo.js";
import { generateDirectKey } from "../conversation/conversation.utils.js";
import { MessageRepo } from "./message.repo.js";

export class MessageServices {
  static async sendMessage(
    senderId: string,
    recipientId: string | null,
    conversationId: string | null,
    content: string,
  ) {
    const trimmedContent = content.trim();
    if (!trimmedContent) {
      throw new AppError("Message cannot be empty", 400);
    }

    let cId = conversationId;

    if (!cId) {
      if (!recipientId || recipientId === senderId) {
        throw new AppError("Invalid recipient", 400);
      }

      const key = generateDirectKey(senderId, recipientId);

      const conversation =
        (await ConversationsRepo.findDirectConversation(key)) ??
        (await ConversationsRepo.createNewDirectConversation(
          senderId,
          recipientId,
          key,
        ));

      cId = conversation.id;
    }

    const isSenderValid = await ConversationsRepo.verifyConversationMember(
      senderId,
      cId,
    );

    if (!isSenderValid) {
      throw new AppError("User is not a part of this conversation", 403);
    }

    return MessageRepo.sendMessage(cId, senderId, trimmedContent);
  }
}
