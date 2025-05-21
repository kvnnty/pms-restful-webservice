/*
  Warnings:

  - You are about to drop the column `vehicleSize` on the `parking_slots` table. All the data in the column will be lost.
  - Added the required column `vehicle_size` to the `parking_slots` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "parking_slots" DROP COLUMN "vehicleSize",
ADD COLUMN     "vehicle_size" "VehicleSize" NOT NULL;
