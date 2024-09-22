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
    date: z.date().optional(),
  }),
  async ({ amount, category, date }, { accountId }) => {
    if (date) {
      await db.budgetOverride.upsert({
        create: {
          amount,
          category,
          date,
          userId: accountId,
        },
        update: {
          amount,
        },
        where: {
          userId_category_date: {
            category,
            userId: accountId,
            date,
          },
        },
      });
    } else {
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
    }

    revalidatePath("/");
  },
);

export const removeBudget = protectedAction(
  z.object({
    category: z.enum([...SPENDING_CATEGORIES, "total"]),
    date: z.date().optional(),
  }),
  async ({ category, date }, { accountId }) => {
    if (date) {
      const res = await db.budgetOverride.deleteMany({
        where: {
          category,
          date,
          userId: accountId,
        },
      });

      if (res.count !== 0) {
        revalidatePath("/");
        return;
      }
    }

    await db.budget.delete({
      where: {
        category_userId: { category, userId: accountId },
      },
    });

    revalidatePath("/");
  },
);
