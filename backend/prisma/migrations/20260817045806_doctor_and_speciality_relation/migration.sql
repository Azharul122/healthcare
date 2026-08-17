-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHERS');

-- CreateTable
CREATE TABLE "doctors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "profilePic" TEXT,
    "phone" TEXT,
    "registartionNumber" TEXT NOT NULL,
    "gender" "Gender",
    "appointFe" DOUBLE PRECISION,
    "qualification" TEXT,
    "currentWorkingPlace" TEXT,
    "designation" TEXT,
    "avarageRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "expreince" INTEGER NOT NULL DEFAULT 0,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "doctors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor_speciality" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "specialityId" TEXT NOT NULL,

    CONSTRAINT "doctor_speciality_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "doctors_email_key" ON "doctors"("email");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_registartionNumber_key" ON "doctors"("registartionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_userId_key" ON "doctors"("userId");

-- CreateIndex
CREATE INDEX "idx_doctor_is_delated" ON "doctors"("isDeleted");

-- CreateIndex
CREATE INDEX "idx_doctor_mail" ON "doctors"("email");

-- CreateIndex
CREATE INDEX "idx_doctor_speciality_doctorId" ON "doctor_speciality"("doctorId");

-- CreateIndex
CREATE INDEX "idx_doctor_speciality_specialityId" ON "doctor_speciality"("specialityId");

-- CreateIndex
CREATE UNIQUE INDEX "doctor_speciality_doctorId_specialityId_key" ON "doctor_speciality"("doctorId", "specialityId");

-- AddForeignKey
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_speciality" ADD CONSTRAINT "doctor_speciality_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_speciality" ADD CONSTRAINT "doctor_speciality_specialityId_fkey" FOREIGN KEY ("specialityId") REFERENCES "specialities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
