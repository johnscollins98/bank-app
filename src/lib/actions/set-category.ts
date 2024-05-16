"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { SPENDING_CATEGORIES } from "../starling-types";
import { protectedAction } from "./utils";

const setCategory = protectedAction(
  z.object({
    category: z.enum(SPENDING_CATEGORIES),
    transactionId: z.string().uuid(),
  }),
  async ({ category, transactionId }, ctx) => {
    const { starling, accountId, defaultCategory } = ctx;
    await starling.setCategory(
      accountId,
      defaultCategory,
      transactionId,
      category,
    );
    revalidatePath("/");
  },
);

export default setCategory;
