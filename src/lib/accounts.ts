import { z } from 'zod';

const accountSchema = z.object({
  email: z.string().email(),
  apiToken: z.string(),
  monthBarrier: z.enum(['last', 'calendar']),
  day: z.number()
});

const accountsSchema = z.array(accountSchema);

export type Account = z.infer<typeof accountSchema>;

export const getAccounts = (): Account[] => {
  if (!process.env.ACCOUNTS) throw new Error("Accounts not defined");
  return accountsSchema.parse(JSON.parse(process.env.ACCOUNTS));
}
