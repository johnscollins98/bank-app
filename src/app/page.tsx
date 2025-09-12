import { getStartAndEndOfMonth } from "@/lib/date-range";
import {
  getBudgetOverridesForUserCached,
  getDefaultBudgetsForUserCached,
} from "@/lib/queries/budgets";
import { getUserSettingsCached } from "@/lib/queries/user-settings";
import { SPENDING_CATEGORIES, SpendingCategory } from "@/lib/starling-types";
import getUserAccount from "@/lib/user";
import { Balance } from "./_components/balance";
import Categories from "./_components/categories";
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

  const { start, end } = await datesPromise;
  const { user, starling, accountId, defaultCategory } = await getUserAccount();

  const defaultBudgets = await getDefaultBudgetsForUserCached(user.id);
  const budgetOverrides = await getBudgetOverridesForUserCached(user.id, start);

  const budgets = [...SPENDING_CATEGORIES, "total"]
    .map((category) => {
      const override = budgetOverrides.find((o) => o.category === category);
      const defaultBudget = defaultBudgets.find((b) => b.category === category);
      return override ? { ...override, isOverride: true } : defaultBudget;
    })
    .filter((b) => b !== undefined);

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

  return (
    <main className="flex min-h-dvh flex-col gap-4">
      <div className="pt-safe pl-safe pr-safe bg-gradient-to-br from-pink-600 to-purple-800 pb-4 shadow-md">
        <div className="flex justify-between">
          <LogoutForm showSettings />
          <DateNavigation dates={datesPromise} />
        </div>
        <Balance
          totals={totals}
          budgets={budgets}
          offset={parseInt(offset ?? "0")}
        />
        <Categories budgets={budgets} startDate={start} totals={totals} />
      </div>
      <div className="pl-safe pr-safe pb-safe flex flex-grow flex-col">
        <TransactionFeed feedItems={feedItems} />
      </div>
    </main>
  );
}
