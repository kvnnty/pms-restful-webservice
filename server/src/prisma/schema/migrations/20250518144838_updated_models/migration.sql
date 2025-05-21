/*
  Warnings:

  - You are about to drop the column `size` on the `parking_slots` table. All the data in the column will be lost.
  - Added the required column `vehicleSize` to the `parking_slots` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "parking_slots" DROP COLUMN "size",
ADD COLUMN     "vehicleSize" "VehicleSize" NOT NULL;
