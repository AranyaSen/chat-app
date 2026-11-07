/*
  Warnings:

  - You are about to drop the column `last_message_read` on the `Conversation_Members` table. All the data in the column will be lost.
  - You are about to drop the column `last_message_id` on the `Conversations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Conversation_Members" DROP COLUMN "last_message_read",
ALTER COLUMN "left_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Conversations" DROP COLUMN "last_message_id";

-- CreateIndex
CREATE INDEX "Conversation_Members_user_id_idx" ON "Conversation_Members"("user_id");

-- AddForeignKey
ALTER TABLE "Conversation_Members" ADD CONSTRAINT "Conversation_Members_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "Conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "Conversations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
