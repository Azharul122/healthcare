-- CreateTable
CREATE TABLE "Pateints" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "profilePhoto" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Pateints_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pateints_email_key" ON "Pateints"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Pateints_userId_key" ON "Pateints"("userId");

-- CreateIndex
CREATE INDEX "Pateints_isDeleted_idx" ON "Pateints"("isDeleted");

-- CreateIndex
CREATE INDEX "Pateints_userId_idx" ON "Pateints"("userId");

-- AddForeignKey
ALTER TABLE "Pateints" ADD CONSTRAINT "Pateints_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
