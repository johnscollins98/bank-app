/*
  Warnings:

  - A unique constraint covering the columns `[userId,category]` on the table `Budget` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,category,date]` on the table `BudgetOverride` will be added. If there are existing duplicate values, this will fail.

*/
-- RenameIndex
ALTER INDEX "category_user_id_unique" RENAME TO "category_account_id_unique";

-- RenameIndex
ALTER INDEX "category_user_id_date_unique" RENAME TO "category_account_id_date_unique";

-- AlterTable
ALTER TABLE "Budget" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "BudgetOverride" ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "category_user_id_unique" ON "Budget"("userId", "category");

-- CreateIndex
CREATE UNIQUE INDEX "category_user_id_date_unique" ON "BudgetOverride"("userId", "category", "date");

-- AddForeignKey
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetOverride" ADD CONSTRAINT "BudgetOverride_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
