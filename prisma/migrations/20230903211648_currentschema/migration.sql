/*
  Warnings:

  - You are about to drop the `Example` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `accountId` to the `Expenditure` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ExpenditureStatus" AS ENUM ('WAITING', 'PAID');

-- CreateEnum
CREATE TYPE "InflowStatus" AS ENUM ('WAITING', 'RECEIVED');

-- AlterTable
ALTER TABLE "Expenditure" ADD COLUMN     "accountId" INTEGER NOT NULL,
ADD COLUMN     "status" "ExpenditureStatus" NOT NULL DEFAULT 'WAITING';

-- DropTable
DROP TABLE "Example";

-- DropEnum
DROP TYPE "Status";

-- CreateTable
CREATE TABLE "Inflow" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "status" "InflowStatus" NOT NULL DEFAULT 'WAITING',
    "category" TEXT NOT NULL,
    "accountId" INTEGER NOT NULL,

    CONSTRAINT "Inflow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Card" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "limit" DOUBLE PRECISION NOT NULL,
    "balance" DOUBLE PRECISION,
    "main" BOOLEAN,
    "accountId" INTEGER NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExpenditureCard" (
    "id" SERIAL NOT NULL,
    "cardId" INTEGER NOT NULL,
    "expenditureId" INTEGER NOT NULL,

    CONSTRAINT "ExpenditureCard_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Expenditure" ADD CONSTRAINT "Expenditure_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inflow" ADD CONSTRAINT "Inflow_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpenditureCard" ADD CONSTRAINT "ExpenditureCard_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpenditureCard" ADD CONSTRAINT "ExpenditureCard_expenditureId_fkey" FOREIGN KEY ("expenditureId") REFERENCES "Expenditure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
