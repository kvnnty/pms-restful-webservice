/*
  Warnings:

  - You are about to drop the column `location` on the `parking_slots` table. All the data in the column will be lost.
  - You are about to drop the column `vehicle_size` on the `parking_slots` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "parking_slots" DROP COLUMN "location",
DROP COLUMN "vehicle_size";
