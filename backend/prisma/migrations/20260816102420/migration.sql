/*
  Warnings:

  - You are about to drop the column `userStatus` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "userStatus",
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';
