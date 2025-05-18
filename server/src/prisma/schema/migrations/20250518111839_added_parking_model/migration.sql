-- AlterTable
ALTER TABLE "parking_slots" ADD COLUMN     "parking_id" TEXT;

-- CreateTable
CREATE TABLE "parkings" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "pricePerHour" DOUBLE PRECISION NOT NULL,
    "capacity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parkings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "parking_slots" ADD CONSTRAINT "parking_slots_parking_id_fkey" FOREIGN KEY ("parking_id") REFERENCES "parkings"("id") ON DELETE SET NULL ON UPDATE CASCADE;
