/*
  Warnings:

  - You are about to drop the `speciality` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "speciality";

-- CreateTable
CREATE TABLE "specialities" (
    "id" TEXT NOT NULL,
    "icon" TEXT,
    "title" TEXT NOT NULL,
    "description" VARCHAR(250),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "specialities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_speciality_isDeleted" ON "specialities"("isDeleted");

-- CreateIndex
CREATE INDEX "idx_speiality_title" ON "specialities"("title");
