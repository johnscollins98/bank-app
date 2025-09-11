import { formatAsGBP } from "@/lib/currency-format";
import { SpendingCategory } from "@/lib/starling-types";
import getUserAccount from "@/lib/user";
import {
  BudgetsWithOverride,
  SpendingCategoryWithTotal,
  Totals,
} from "./categories";

export const Balance = async ({
  totals,
  budgets,
  offset,
}: {
  totals: Totals<SpendingCategoryWithTotal | "upcoming">;
  budgets: BudgetsWithOverride;
  offset: number;
}) => {
  const { starling, accountId } = await getUserAccount();
  const balance = await starling.getBalance(accountId);

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
    <div className="flex items-center justify-between p-2 pt-4">
      <BalanceDisplay amount={balancePennies / 100} label="Balance" />
      {balanceAfterBudget && offset === 0 && (
        <BalanceDisplay amount={balanceAfterBudget} label="After Budget" />
      )}
    </div>
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
