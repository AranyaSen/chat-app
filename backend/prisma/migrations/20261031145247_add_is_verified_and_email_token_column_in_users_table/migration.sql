-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "email_token_hash" TEXT,
ADD COLUMN     "is_verified" BOOLEAN NOT NULL DEFAULT false;
