/*
  Warnings:

  - You are about to drop the column `publicKey` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_publicKey_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "publicKey";
