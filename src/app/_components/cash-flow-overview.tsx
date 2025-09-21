import { BalanceDisplay } from "./balance-display";
import { calculateRemainingSpend } from "./balance-overview";
import {
  BudgetsWithOverride,
  SpendingCategoryWithTotal,
  Totals,
} from "./spending-summary";

interface Props {
  totals: Totals<SpendingCategoryWithTotal> & { upcoming?: number };
  budgets: BudgetsWithOverride;
  offset: number;
}

export const CashFlowOverview = ({ totals, budgets, offset }: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { total, upcoming, ...otherTotals } = totals;

  const budgetsWithoutTotal = budgets.filter((b) => b.category !== "total");

  const actualCashflow = Object.values(otherTotals).reduce(
    (total, entry) => total + entry,
    0,
  );

  const budgetCashflow = Object.values(budgetsWithoutTotal).reduce(
    (total, entry) => total + entry.amount,
    0,
  );

  const remainingSpend = calculateRemainingSpend(
    budgetsWithoutTotal,
    otherTotals,
  );

  const cashflowAfterBudget = actualCashflow + remainingSpend;

  return (
    <div className="flex justify-between">
      <BalanceDisplay
        amount={actualCashflow / 100}
        label="Cash Flow"
        tooltip="Actual cash flow for this period (based on real spending)"
      />
      {offset === 0 && (
        <BalanceDisplay
          amount={cashflowAfterBudget / 100}
          label="After Budget"
          tooltip="Cash flow for this period if you were to spend your remaining budget."
        />
      )}
      <BalanceDisplay
        amount={budgetCashflow}
        label="Budget Cash Flow"
        tooltip="Cash flow based on your budgets alone for this period."
      />
    </div>
  );
};
