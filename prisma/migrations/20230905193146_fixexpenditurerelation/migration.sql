/*
  Warnings:

  - You are about to drop the `ExpenditureCard` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ExpenditureCard" DROP CONSTRAINT "ExpenditureCard_cardId_fkey";

-- DropForeignKey
ALTER TABLE "ExpenditureCard" DROP CONSTRAINT "ExpenditureCard_expenditureId_fkey";

-- AlterTable
ALTER TABLE "Expenditure" ADD COLUMN     "cardId" INTEGER;

-- DropTable
DROP TABLE "ExpenditureCard";

-- AddForeignKey
ALTER TABLE "Expenditure" ADD CONSTRAINT "Expenditure_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE SET NULL ON UPDATE CASCADE;
