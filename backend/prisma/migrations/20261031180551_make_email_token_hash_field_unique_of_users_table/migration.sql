/*
  Warnings:

  - A unique constraint covering the columns `[email_token_hash]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Users_email_token_hash_key" ON "Users"("email_token_hash");
