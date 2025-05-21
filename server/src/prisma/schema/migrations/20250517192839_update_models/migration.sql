/*
  Warnings:

  - You are about to drop the column `userId` on the `logs` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `parking_slots` table. All the data in the column will be lost.
  - You are about to drop the column `slotNumber` on the `parking_slots` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `parking_slots` table. All the data in the column will be lost.
  - You are about to drop the column `vehicleType` on the `parking_slots` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `slot_requests` table. All the data in the column will be lost.
  - You are about to drop the column `slotId` on the `slot_requests` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `slot_requests` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `slot_requests` table. All the data in the column will be lost.
  - You are about to drop the column `vehicleId` on the `slot_requests` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `vehicles` table. All the data in the column will be lost.
  - You are about to drop the column `plateNumber` on the `vehicles` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `vehicles` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `vehicles` table. All the data in the column will be lost.
  - You are about to drop the column `vehicleSize` on the `vehicles` table. All the data in the column will be lost.
  - You are about to drop the column `vehicleType` on the `vehicles` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slot_number]` on the table `parking_slots` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slot_id]` on the table `slot_requests` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[plate_number]` on the table `vehicles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slot_number` to the `parking_slots` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `parking_slots` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicle_type` to the `parking_slots` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `slot_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `slot_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicle_id` to the `slot_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner_id` to the `vehicles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plate_number` to the `vehicles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `vehicles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicle_size` to the `vehicles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicle_type` to the `vehicles` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "logs" DROP CONSTRAINT "logs_userId_fkey";

-- DropForeignKey
ALTER TABLE "slot_requests" DROP CONSTRAINT "slot_requests_slotId_fkey";

-- DropForeignKey
ALTER TABLE "slot_requests" DROP CONSTRAINT "slot_requests_userId_fkey";

-- DropForeignKey
ALTER TABLE "slot_requests" DROP CONSTRAINT "slot_requests_vehicleId_fkey";

-- DropForeignKey
ALTER TABLE "vehicles" DROP CONSTRAINT "vehicles_userId_fkey";

-- DropIndex
DROP INDEX "parking_slots_slotNumber_key";

-- DropIndex
DROP INDEX "slot_requests_slotId_key";

-- DropIndex
DROP INDEX "vehicles_plateNumber_key";

-- AlterTable
ALTER TABLE "logs" DROP COLUMN "userId",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "parking_slots" DROP COLUMN "createdAt",
DROP COLUMN "slotNumber",
DROP COLUMN "updatedAt",
DROP COLUMN "vehicleType",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "slot_number" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "vehicle_type" "VehicleType" NOT NULL;

-- AlterTable
ALTER TABLE "slot_requests" DROP COLUMN "createdAt",
DROP COLUMN "slotId",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
DROP COLUMN "vehicleId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "slot_id" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL,
ADD COLUMN     "vehicle_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "createdAt",
DROP COLUMN "firstName",
DROP COLUMN "isVerified",
DROP COLUMN "lastName",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "is_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "last_name" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "vehicles" DROP COLUMN "createdAt",
DROP COLUMN "plateNumber",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
DROP COLUMN "vehicleSize",
DROP COLUMN "vehicleType",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "owner_id" TEXT NOT NULL,
ADD COLUMN     "plate_number" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "vehicle_size" "VehicleSize" NOT NULL,
ADD COLUMN     "vehicle_type" "VehicleType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "parking_slots_slot_number_key" ON "parking_slots"("slot_number");

-- CreateIndex
CREATE UNIQUE INDEX "slot_requests_slot_id_key" ON "slot_requests"("slot_id");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_plate_number_key" ON "vehicles"("plate_number");

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slot_requests" ADD CONSTRAINT "slot_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slot_requests" ADD CONSTRAINT "slot_requests_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slot_requests" ADD CONSTRAINT "slot_requests_slot_id_fkey" FOREIGN KEY ("slot_id") REFERENCES "parking_slots"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
