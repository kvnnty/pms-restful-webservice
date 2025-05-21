/*
  Warnings:

  - You are about to drop the `tickets` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `chargedAmount` to the `parking_sessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "parking_sessions" ADD COLUMN     "chargedAmount" DOUBLE PRECISION NOT NULL;

-- DropTable
DROP TABLE "tickets";

-- CreateTable
CREATE TABLE "biils" (
    "id" TEXT NOT NULL,

    CONSTRAINT "biils_pkey" PRIMARY KEY ("id")
);
