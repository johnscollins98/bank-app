/*
  Warnings:

  - Made the column `userId` on table `Budget` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `BudgetOverride` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Budget" DROP CONSTRAINT "Budget_userId_fkey";

-- DropForeignKey
ALTER TABLE "BudgetOverride" DROP CONSTRAINT "BudgetOverride_userId_fkey";

-- AlterTable
ALTER TABLE "Budget" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "BudgetOverride" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetOverride" ADD CONSTRAINT "BudgetOverride_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
