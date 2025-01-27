/*
  Warnings:

  - You are about to drop the column `accountId` on the `Budget` table. All the data in the column will be lost.
  - You are about to drop the column `accountId` on the `BudgetOverride` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "category_account_id_unique";

-- DropIndex
DROP INDEX "category_account_id_date_unique";

-- AlterTable
ALTER TABLE "Budget" DROP COLUMN "accountId";

-- AlterTable
ALTER TABLE "BudgetOverride" DROP COLUMN "accountId";
