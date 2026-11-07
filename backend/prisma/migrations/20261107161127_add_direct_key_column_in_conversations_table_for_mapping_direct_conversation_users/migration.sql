/*
  Warnings:

  - A unique constraint covering the columns `[direct_key]` on the table `Conversations` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Conversations" ADD COLUMN     "direct_key" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Conversations_direct_key_key" ON "Conversations"("direct_key");
