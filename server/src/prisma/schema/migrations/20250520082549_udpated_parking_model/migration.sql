/*
  Warnings:

  - You are about to drop the column `address` on the `parkings` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `parkings` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[parking_code]` on the table `parkings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `location` to the `parkings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parking_code` to the `parkings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parking_name` to the `parkings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'PARKING_ATTENDANT';

-- AlterTable
ALTER TABLE "parkings" DROP COLUMN "address",
DROP COLUMN "name",
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "parking_code" TEXT NOT NULL,
ADD COLUMN     "parking_name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "parkings_parking_code_key" ON "parkings"("parking_code");
