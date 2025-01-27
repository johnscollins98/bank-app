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
          accountId,
        },
        update: {
          amount,
        },
        where: {
          accountId_category_date: {
            category,
            accountId,
            date,
          },
        },
      });
    } else {
      await db.budget.upsert({
        create: {
          amount,
          category,
          accountId,
        },
        update: {
          amount,
        },
        where: {
          category_accountId: {
            category,
            accountId,
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
          accountId,
        },
      });

      if (res.count !== 0) {
        revalidatePath("/");
        return;
      }
    }

    await db.budget.delete({
      where: {
        category_accountId: { category, accountId },
      },
    });

    revalidatePath("/");
  },
);
