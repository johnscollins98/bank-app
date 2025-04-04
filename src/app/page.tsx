import { formatAsGBP } from "@/lib/currency-format";
import { getStartAndEndOfMonth } from "@/lib/date-range";
import { db } from "@/lib/db";
import { orderCategoriesByPopularity } from "@/lib/ordered-categories";
import { SPENDING_CATEGORIES, SpendingCategory } from "@/lib/starling-types";
import getUserAccount from "@/lib/user";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import Categories from "./_components/categories";
import DateDisplay from "./_components/date";
import FeedEntry from "./_components/feed-entry";
import LogoutForm from "./_components/logout-form";

export default async function Home(props: {
  searchParams: Promise<Record<string, string>>;
}) {
  const searchParams = await props.searchParams;
  const { user, starling, accountId, defaultCategory } = await getUserAccount();

  const userSettings = (await db.userSettings.findFirst({
    where: { userId: user.id },
    select: { monthBarrierOption: true, day: true },
  })) ?? { monthBarrierOption: "CALENDAR", day: 1 };

  const offset = parseInt(searchParams.offset ?? "0");
  const filterBy = searchParams.filterBy ?? "";

  const date = new Date(Date.now());
  date.setHours(0, 0, 0, 0);

  const { start, end } = getStartAndEndOfMonth(
    date,
    userSettings.monthBarrierOption,
    userSettings.day,
    offset,
  );

  const transactions = await starling.getTransactions(
    accountId,
    start,
    end,
    defaultCategory,
  );
  const filteredTransactions = transactions.feedItems.filter(
    (i) => i.status !== "DECLINED",
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

  const defaultBudgets = await db.budget.findMany({
    where: { userId: user.id },
  });
  const budgetOverrides = await db.budgetOverride.findMany({
    where: { userId: user.id, date: start },
  });

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
    <main className="flex flex-col gap-4 p-4">
      <div className="flex justify-between">
        <LogoutForm user={user} showSettings />
        <div className="flex gap-1">
          <Button
            size="sm"
            className="min-w-0"
            as={Link}
            href={`.?${createRedirectLink(offset - 1)}`}
          >
            <FaArrowLeft />
          </Button>
          <Button size="sm" as={Link} href={`.?${createRedirectLink(0)}`}>
            <DateDisplay date={start} /> - {<DateDisplay date={end} />}
          </Button>
          <Button
            size="sm"
            as={Link}
            className="min-w-0"
            href={`.?${createRedirectLink(offset + 1)}`}
          >
            <FaArrowRight />
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <BalanceDisplay amount={balancePennies / 100} label="Balance" />
        {balanceAfterBudget && (
          <BalanceDisplay amount={balanceAfterBudget} label="After Budget" />
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
