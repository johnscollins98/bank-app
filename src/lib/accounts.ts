import { z } from "zod";
import { SPENDING_CATEGORIES } from "./starling-types";

const budgetSchema = z
  .record(z.enum([...SPENDING_CATEGORIES, "total"]), z.number())
  .optional();

export type Budgets = z.infer<typeof budgetSchema>;

const accountsSchema = z.record(z.string().email(), z.string());

export type Accounts = z.infer<typeof accountsSchema>;

export const getAccounts = (): Accounts => {
  if (!process.env.ACCOUNTS) throw new Error("Accounts not defined");
  return accountsSchema.parse(JSON.parse(process.env.ACCOUNTS));
};
