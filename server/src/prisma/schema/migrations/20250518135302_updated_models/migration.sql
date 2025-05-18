/*
  Warnings:

  - The `status` column on the `parking_slots` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ParkingSlotStatus" AS ENUM ('AVAILABLE', 'UNAVAILABLE');

-- AlterTable
ALTER TABLE "parking_slots" DROP COLUMN "status",
ADD COLUMN     "status" "ParkingSlotStatus" NOT NULL DEFAULT 'AVAILABLE';

-- DropEnum
DROP TYPE "SlotStatus";
