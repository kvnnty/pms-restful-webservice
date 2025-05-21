/*
  Warnings:

  - Added the required column `status` to the `logs` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LogStatus" AS ENUM ('SUCCESS', 'FAILURE');

-- AlterTable
ALTER TABLE "logs" ADD COLUMN     "status" "LogStatus" NOT NULL;
