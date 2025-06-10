import { formatAsGBP } from "@/lib/currency-format";
import { getStartAndEndOfMonth, StartAndEndDate } from "@/lib/date-range";
import { orderCategoriesByPopularity } from "@/lib/ordered-categories";
import {
  getBudgetOverridesForUserCached,
  getDefaultBudgetsForUserCached,
} from "@/lib/queries/budgets";
import { getUserSettingsCached } from "@/lib/queries/user-settings";
import { SPENDING_CATEGORIES, SpendingCategory } from "@/lib/starling-types";
import getUserAccount from "@/lib/user";
import { Suspense } from "react";
import { DateNavigation } from "./_components/date-navigation";
import LogoutForm from "./_components/logout-form";
import { TransactionFeed } from "./_components/transaction-feed";

const getDates = async (offsetStr?: string) => {
  const { user } = await getUserAccount();
  const userSettings = (await getUserSettingsCached(user.id)) ?? {
    monthBarrierOption: "CALENDAR",
    day: 1,
  };

  const offset = parseInt(offsetStr ?? "0");

  const date = new Date(Date.now());
  date.setHours(0, 0, 0, 0);

  return getStartAndEndOfMonth(
    date,
    userSettings.monthBarrierOption,
    userSettings.day,
    offset,
  );
};

export default async function Home(props: {
  searchParams: Promise<Record<string, string>>;
}) {
  const searchParams = await props.searchParams;
  const offset = searchParams.offset;
  const datesPromise = getDates(offset);

  return (
    <main className="flex flex-col gap-4 p-4">
      <div className="flex justify-between">
        <LogoutForm showSettings />
        <DateNavigation dates={datesPromise} />
      </div>
      <Suspense>
        <PageContent dates={datesPromise} />
      </Suspense>
    </main>
  );
}

const PageContent = async ({ dates }: { dates: Promise<StartAndEndDate> }) => {
  const { start, end } = await dates;
  const { user, starling, accountId, defaultCategory } = await getUserAccount();

  const transactions = await starling.getTransactions(
    accountId,
    start,
    end,
    defaultCategory,
  );
  const feedItems = transactions.feedItems
    .filter((i) => i.status !== "DECLINED")
    .toSorted(
      (a, b) => Date.parse(b.transactionTime) - Date.parse(a.transactionTime),
    );

  const orderedCategories = orderCategoriesByPopularity(feedItems);

  const totals = feedItems.reduce(
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
        upcoming:
          transaction.status === "UPCOMING"
            ? total.upcoming + value
            : total.upcoming,
      };
    },
    { total: 0, upcoming: 0 } as Record<
      SpendingCategory | "total" | "upcoming",
      number
    >,
  );

  const balance = await starling.getBalance(accountId);

  const defaultBudgets = await getDefaultBudgetsForUserCached(user.id);
  const budgetOverrides = await getBudgetOverridesForUserCached(user.id, start);

  const budgets = [...SPENDING_CATEGORIES, "total"]
    .map((category) => {
      const override = budgetOverrides.find((o) => o.category === category);
      const defaultBudget = defaultBudgets.find((b) => b.category === category);
      return override ? { ...override, isOverride: true } : defaultBudget;
    })
    .filter((b) => b !== undefined);

  const balancePennies = balance.effectiveBalance.minorUnits;

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
    }, balancePennies + totals.upcoming) / 100;
  return (
    <>
      <div className="flex items-center justify-between">
        <BalanceDisplay amount={balancePennies / 100} label="Balance" />
        {balanceAfterBudget && (
          <BalanceDisplay amount={balanceAfterBudget} label="After Budget" />
        )}
      </div>
      <TransactionFeed
        budgets={budgets}
        categories={orderedCategories}
        feedItems={feedItems}
        start={start}
        totals={totals}
      />
    </>
  );
};

const BalanceDisplay = ({
  amount,
  label,
}: {
  amount: number;
  label: string;
}) => (
  <div className="flex gap-2 font-bold">
    <span>{label}:</span>
    <span
      className={
        amount >= 0 ? "text-blue-600 dark:text-blue-400" : "text-danger"
      }
    >
      {formatAsGBP(amount)}
    </span>
  </div>
);
