import { AppError } from "@/utils/appError.js";
import { ReactionRepo } from "./reaction.repo.js";

export class ReactionService {
  static async reactMessage(
    userId: string,
    messageId: string,
    reaction: string,
  ) {
    if (!userId || !messageId || !reaction) {
      throw new AppError("Invalid reaction payload", 400);
    }
    const trimmedReaction = reaction?.trim();

    return await ReactionRepo.reactMessage(userId, messageId, trimmedReaction);
  }
}
