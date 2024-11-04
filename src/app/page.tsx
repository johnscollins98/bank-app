import { getStartAndEndOfMonth } from "@/lib/date-range";
import { db } from "@/lib/db";
import { orderCategoriesByPopularity } from "@/lib/ordered-categories";
import { SPENDING_CATEGORIES, SpendingCategory } from "@/lib/starling-types";
import getUserAccount from "@/lib/user";
import { Button, ButtonGroup } from "@nextui-org/react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import Categories from "./_components/categories";
import DateDisplay from "./_components/date";
import FeedEntry from "./_components/feed-entry";
import LogoutForm from "./_components/logout-form";

export const moneyFormat: Intl.NumberFormatOptions = {
  style: "currency",
  currency: "GBP",
};

export default async function Home({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const { user, starling, accountId, localAccount, defaultCategory } =
    await getUserAccount();

  const offset = parseInt(searchParams.offset ?? "0");
  const filterBy = searchParams.filterBy ?? "";

  const date = new Date(Date.now());
  date.setHours(0, 0, 0, 0);

  const { start, end } = getStartAndEndOfMonth(
    date,
    localAccount.monthBarrier,
    localAccount.day,
    offset,
  );

  const transactions = await starling.getTransactions(
    accountId,
    start,
    end,
    defaultCategory,
  );
  const filteredTransactions = transactions.feedItems.filter(
    (i) => i.status !== "UPCOMING" && i.status !== "DECLINED",
  );
  const feedItems = filteredTransactions
    .filter((item) => filterBy === "" || item.spendingCategory === filterBy)
    .toSorted(
      (a, b) => Date.parse(b.transactionTime) - Date.parse(a.transactionTime),
    );

  const createRedirectLink = (newOffset: number) =>
    new URLSearchParams({
      ...searchParams,
      offset: newOffset.toString(),
    }).toString();

  const orderedCategories = orderCategoriesByPopularity(feedItems);

  const totals = filteredTransactions.reduce(
    (total, transaction) => {
      const value =
        transaction.direction === "IN"
          ? transaction.amount.minorUnits
          : -1 * transaction.amount.minorUnits;
      const category = transaction.spendingCategory;

      return {
        ...total,
        total: total.total + value,
        [category]: (total[category] ?? 0) + value,
      };
    },
    { total: 0 } as Record<SpendingCategory | "total", number>,
  );

  const balance = await starling.getBalance(accountId);

  const defaultBudgets = await db.budget.findMany({
    where: { userId: accountId },
  });
  const budgetOverrides = await db.budgetOverride.findMany({
    where: { userId: accountId, date: start },
  });

  const budgets = (
    await Promise.all(
      [...SPENDING_CATEGORIES, "total"].map(async (category) => {
        const override = budgetOverrides.find((o) => o.category === category);
        const defaultBudget = defaultBudgets.find(
          (b) => b.category === category,
        );
        return override ? { ...override, isOverride: true } : defaultBudget;
      }),
    )
  ).filter((b) => b !== undefined);

  const balanceAfterBudget =
    budgets &&
    budgets.reduce((bal, { category, amount }) => {
      const budgetPennies = amount * 100;
      const totalSpendEarned = totals[category as SpendingCategory];

      if (totalSpendEarned === undefined) {
        return bal + budgetPennies;
      }

      const remainingBalance = budgetPennies - totalSpendEarned;
      const clampedRemainingBalance =
        amount > 0
          ? Math.max(0, remainingBalance)
          : Math.min(0, remainingBalance);

      return bal + clampedRemainingBalance;
    }, balance.effectiveBalance.minorUnits) / 100;

  return (
    <main className="flex flex-col gap-4 p-4">
      <LogoutForm user={user} />
      <div className="flex items-center justify-between gap-2">
        <DateDisplay date={start} /> - {<DateDisplay date={end} />}
        <ButtonGroup>
          <Button size="sm" as="a" href={`.?${createRedirectLink(offset - 1)}`}>
            <FaArrowLeft />
          </Button>
          <Button size="sm" as="a" href={`.?${createRedirectLink(0)}`}>
            Today
          </Button>
          <Button size="sm" as="a" href={`.?${createRedirectLink(offset + 1)}`}>
            <FaArrowRight />
          </Button>
        </ButtonGroup>
      </div>
      <div className="flex items-center justify-between">
        <div className="font-bold">
          Balance:{" "}
          {(balance.effectiveBalance.minorUnits / 100).toLocaleString(
            undefined,
            moneyFormat,
          )}
        </div>
        {balanceAfterBudget && (
          <div className="font-bold">
            Balance After Budget:{" "}
            {balanceAfterBudget.toLocaleString(undefined, moneyFormat)}
          </div>
        )}
      </div>
      <Categories
        searchParams={searchParams}
        totals={totals}
        budgets={budgets}
        startDate={start}
      />
      <div className="flex flex-1 flex-col">
        {feedItems.map((feedItem) => (
          <FeedEntry
            key={feedItem.feedItemUid}
            feedItem={feedItem}
            orderedCategories={orderedCategories}
          />
        ))}
      </div>
    </main>
  );
}
