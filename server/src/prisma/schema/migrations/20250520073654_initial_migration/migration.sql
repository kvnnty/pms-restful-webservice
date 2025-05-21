/*
  Warnings:

  - You are about to drop the column `createdAt` on the `parkings` table. All the data in the column will be lost.
  - You are about to drop the column `pricePerHour` on the `parkings` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `parkings` table. All the data in the column will be lost.
  - Added the required column `price_per_hour` to the `parkings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `parkings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "parkings" DROP COLUMN "createdAt",
DROP COLUMN "pricePerHour",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "price_per_hour" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
