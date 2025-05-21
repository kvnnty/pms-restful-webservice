/*
  Warnings:

  - A unique constraint covering the columns `[parking_session_id]` on the table `bills` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `amount` to the `bills` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parking_session_id` to the `bills` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `bills` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicle_id` to the `bills` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bills" ADD COLUMN     "amount" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "parking_session_id" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD COLUMN     "vehicle_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "bills_parking_session_id_key" ON "bills"("parking_session_id");

-- AddForeignKey
ALTER TABLE "bills" ADD CONSTRAINT "bills_parking_session_id_fkey" FOREIGN KEY ("parking_session_id") REFERENCES "parking_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bills" ADD CONSTRAINT "bills_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bills" ADD CONSTRAINT "bills_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
