/*
  Warnings:

  - You are about to drop the `biils` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "biils";

-- CreateTable
CREATE TABLE "bills" (
    "id" TEXT NOT NULL,

    CONSTRAINT "bills_pkey" PRIMARY KEY ("id")
);
