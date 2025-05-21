/*
  Warnings:

  - Added the required column `availableSlots` to the `parkings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "parkings" ADD COLUMN     "availableSlots" INTEGER NOT NULL;
