import { z } from "zod";
import { SPENDING_CATEGORIES } from "./starling-types";

const budgetSchema = z
  .record(z.enum(SPENDING_CATEGORIES), z.number())
  .optional();

export type Budgets = z.infer<typeof budgetSchema>;

const accountSchema = z.object({
  email: z.string().email(),
  apiToken: z.string(),
  monthBarrier: z.enum(["last", "calendar"]),
  day: z.number(),
  budgets: budgetSchema,
});

const accountsSchema = z.array(accountSchema);

export type Account = z.infer<typeof accountSchema>;

export const getAccounts = (): Account[] => {
  if (!process.env.ACCOUNTS) throw new Error("Accounts not defined");
  return accountsSchema.parse(JSON.parse(process.env.ACCOUNTS));
};
