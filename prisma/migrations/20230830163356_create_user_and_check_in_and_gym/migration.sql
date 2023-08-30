/*
  Warnings:

  - Added the required column `passwordHash` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "passwordHash" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "check_in" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "gymId" TEXT NOT NULL,

    CONSTRAINT "check_in_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gym" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "phone" TEXT,
    "latitude" TEXT NOT NULL,
    "longitude" TEXT NOT NULL,

    CONSTRAINT "gym_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "check_in" ADD CONSTRAINT "check_in_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_in" ADD CONSTRAINT "check_in_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "gym"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
