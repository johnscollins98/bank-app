/*
  Warnings:

  - You are about to drop the column `userId` on the `Budget` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `BudgetOverride` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[category,accountId]` on the table `Budget` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[accountId,category,date]` on the table `BudgetOverride` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accountId` to the `Budget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountId` to the `BudgetOverride` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Budget" RENAME COLUMN "userId" TO "accountId";

-- AlterTable
ALTER TABLE "BudgetOverride" RENAME COLUMN "userId" TO "accountId";
