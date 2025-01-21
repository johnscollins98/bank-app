"server-only";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { cache } from "react";
import { getAccounts } from "./accounts";
import { Starling } from "./starling-api-service";

const getUserAccount = cache(async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const { user } = session;
  if (!user) {
    redirect("/forbidden");
  }

  const localAccounts = getAccounts();
  const { email } = user;
  if (!email) {
    redirect("/forbidden");
  }

  const localAccount = localAccounts.find((a) => a.email === email);

  if (!localAccount) {
    redirect("/forbidden");
  }

  const starling = new Starling(localAccount.apiToken);
  const accounts = await starling.getAccounts();
  const accountId = accounts.accounts[0]?.accountUid;
  const defaultCategory = accounts.accounts[0]?.defaultCategory;

  if (!accountId || !defaultCategory) {
    redirect("/forbidden");
  }

  return {
    user,
    starling,
    accountId,
    defaultCategory,
    localAccount,
  };
});

export type Context = Awaited<ReturnType<typeof getUserAccount>>;
export type User = Context["user"];

export default getUserAccount;
