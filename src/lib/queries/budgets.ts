import { unstable_cache } from "next/cache";
import { db } from "../db";

export const getDefaultBudgetsForUser = (userId: string) => {
  return db.budget.findMany({
    where: { userId: userId },
  });
};

export const getDefaultBudgetsForUserCached = unstable_cache(
  getDefaultBudgetsForUser,
  undefined,
  { tags: ["budget"], revalidate: 3600 },
);

export const getBudgetOverridesForUser = (userId: string, startDate: Date) => {
  return db.budgetOverride.findMany({
    where: { userId: userId, date: startDate },
  });
};

export const getBudgetOverridesForUserCached = unstable_cache(
  getBudgetOverridesForUser,
  undefined,
  { tags: ["budgetOverride"], revalidate: 3600 },
);
