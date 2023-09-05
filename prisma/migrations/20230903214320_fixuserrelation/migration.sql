/*
  Warnings:

  - Added the required column `userId` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Expenditure` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `FixedExpenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `FixedInflows` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Inflow` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_accountId_fkey";

-- DropForeignKey
ALTER TABLE "Expenditure" DROP CONSTRAINT "Expenditure_accountId_fkey";

-- DropForeignKey
ALTER TABLE "FixedExpenses" DROP CONSTRAINT "FixedExpenses_accountId_fkey";

-- DropForeignKey
ALTER TABLE "FixedInflows" DROP CONSTRAINT "FixedInflows_accountId_fkey";

-- DropForeignKey
ALTER TABLE "Inflow" DROP CONSTRAINT "Inflow_accountId_fkey";

-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "accountId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Expenditure" ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "accountId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "FixedExpenses" ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "accountId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "FixedInflows" ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "accountId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Inflow" ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "accountId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "FixedExpenses" ADD CONSTRAINT "FixedExpenses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FixedExpenses" ADD CONSTRAINT "FixedExpenses_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FixedInflows" ADD CONSTRAINT "FixedInflows_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FixedInflows" ADD CONSTRAINT "FixedInflows_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expenditure" ADD CONSTRAINT "Expenditure_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expenditure" ADD CONSTRAINT "Expenditure_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inflow" ADD CONSTRAINT "Inflow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inflow" ADD CONSTRAINT "Inflow_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
