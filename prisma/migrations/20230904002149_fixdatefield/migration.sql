/*
  Warnings:

  - Changed the type of `paymentDate` on the `FixedExpenses` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `paymentDate` on the `FixedInflows` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Expenditure" ADD COLUMN     "fixed" BOOLEAN;

-- AlterTable
ALTER TABLE "FixedExpenses" DROP COLUMN "paymentDate",
ADD COLUMN     "paymentDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "FixedInflows" DROP COLUMN "paymentDate",
ADD COLUMN     "paymentDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Inflow" ADD COLUMN     "fixed" BOOLEAN;
