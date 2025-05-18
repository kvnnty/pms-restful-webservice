/*
  Warnings:

  - The `status` column on the `booking_requests` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "BookingRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "booking_requests" DROP COLUMN "status",
ADD COLUMN     "status" "BookingRequestStatus" NOT NULL DEFAULT 'PENDING';

-- DropEnum
DROP TYPE "RequestStatus";
