"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "../db";
import { SPENDING_CATEGORIES } from "../starling-types";
import { protectedAction } from "./utils";

export const setBudget = protectedAction(
  z.object({
    amount: z.number(),
    category: z.enum([...SPENDING_CATEGORIES, "total"]),
  }),
  async ({ amount, category }, { accountId }) => {
    await db.budget.upsert({
      create: {
        amount,
        category,
        userId: accountId,
      },
      update: {
        amount,
      },
      where: {
        category_userId: {
          category,
          userId: accountId,
        },
      },
    });

    revalidatePath("/");
  },
);

export const removeBudget = protectedAction(
  z.object({ category: z.enum([...SPENDING_CATEGORIES, "total"]) }),
  async ({ category }, { accountId }) => {
    await db.budget.delete({
      where: {
        category_userId: { category, userId: accountId },
      },
    });

    revalidatePath("/");
  },
);
