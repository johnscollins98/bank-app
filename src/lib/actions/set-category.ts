"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { SpendingCategory } from "../starling-types";
import getUserAccount from "../user";

export default async function setCategory(
  category: SpendingCategory,
  transactionId: string,
) {
  const session = await getServerSession();
  if (!session) redirect("/");
  const { starling, accountId, defaultCategory } =
    await getUserAccount(session);

  await starling.setCategory(
    accountId,
    defaultCategory,
    transactionId,
    category,
  );
  revalidatePath("/");
}
