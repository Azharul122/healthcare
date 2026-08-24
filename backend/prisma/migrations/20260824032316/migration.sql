/*
  Warnings:

  - You are about to drop the column `stripEventId` on the `payments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripeEventId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "payments_stripEventId_key";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "stripEventId",
ADD COLUMN     "stripeEventId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "payments_stripeEventId_key" ON "payments"("stripeEventId");
