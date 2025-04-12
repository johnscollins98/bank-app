import { z } from "zod";

const accountsSchema = z.record(z.string().email(), z.string());

export type Accounts = z.infer<typeof accountsSchema>;

export const getAccounts = (): Accounts => {
  if (!process.env.ACCOUNTS) throw new Error("Accounts not defined");
  return accountsSchema.parse(JSON.parse(process.env.ACCOUNTS));
};
