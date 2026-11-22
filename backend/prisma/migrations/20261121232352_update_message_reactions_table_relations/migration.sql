/*
  Warnings:

  - A unique constraint covering the columns `[message_id,user_id]` on the table `Message_Reactions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Message_Reactions_message_id_key";

-- DropIndex
DROP INDEX "Message_Reactions_reaction_key";

-- DropIndex
DROP INDEX "Message_Reactions_user_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "Message_Reactions_message_id_user_id_key" ON "Message_Reactions"("message_id", "user_id");

-- AddForeignKey
ALTER TABLE "Message_Reactions" ADD CONSTRAINT "Message_Reactions_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "Messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
