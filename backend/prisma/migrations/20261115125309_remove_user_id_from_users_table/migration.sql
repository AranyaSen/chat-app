/*
  Warnings:

  - You are about to drop the column `user_id` on the `Users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Users_user_id_key";

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "user_id";
