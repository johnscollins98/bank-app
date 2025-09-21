"use client";

import { formatAsGBP } from "@/lib/currency-format";
import {
  CategoryIcons,
  SPENDING_CATEGORIES,
  SpendingCategory,
} from "@/lib/starling-types";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { Progress } from "@heroui/progress";
import { Tooltip } from "@heroui/tooltip";
import { Budget } from "@prisma/client";
import { usePathname, useSearchParams } from "next/navigation";
import { z } from "zod";
import { BudgetForm } from "./budget-form";
import { CashFlowOverview } from "./cash-flow-overview";

export type SpendingCategoryWithTotal = SpendingCategory | "total";
export type Totals<T extends string = SpendingCategoryWithTotal> = Record<
  SpendingCategory | T,
  number
>;
export type BudgetsWithOverride = (Budget & { isOverride?: boolean })[];

interface Props {
  totals: Totals<SpendingCategoryWithTotal>;
  budgets: BudgetsWithOverride;
  startDate: Date;
  offset: number;
}

export const categorySchema = z.enum(SPENDING_CATEGORIES);

export default function SpendingSummary({
  totals,
  budgets,
  startDate,
  offset,
}: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const filterBy =
    categorySchema.safeParse(searchParams.get("filterBy")).data ?? null;
  const setFilterBy = (category: SpendingCategory | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set("filterBy", category);
    } else {
      params.delete("filterBy");
    }
    const url = `${pathname}?${params}`;
    window.history.replaceState(null, "", url);
  };

  return (
    <Accordion>
      <AccordionItem
        title="Spending Summary"
        className="text-white"
        classNames={{
          indicator: "text-white",
          title: "text-white",
        }}
      >
        <div className="flex flex-col gap-6">
          <CashFlowOverview budgets={budgets} offset={offset} totals={totals} />
          <div className="flex flex-wrap gap-2">
            <CategoryChip
              totals={totals}
              category="total"
              filterBy={filterBy}
              setFilterBy={setFilterBy}
              budgets={budgets}
            />
            {SPENDING_CATEGORIES.filter(
              (k) =>
                totals[k] !== undefined ||
                !!budgets.find((c) => c.category === k),
            )
              .toSorted((a, b) => totals[a] - totals[b])
              .map((category) => (
                <CategoryChip
                  category={category}
                  key={category}
                  totals={totals}
                  budgets={budgets}
                  filterBy={filterBy}
                  setFilterBy={setFilterBy}
                />
              ))}
          </div>
          <BudgetPercent
            totals={totals}
            budgets={budgets}
            filterBy={filterBy}
          />
          <OverallBudgetPercent totals={totals} budgets={budgets} />
          <BudgetForm
            budgets={budgets}
            filterBy={filterBy}
            startDate={startDate}
          />
        </div>
      </AccordionItem>
    </Accordion>
  );
}

const BudgetPercent = ({
  filterBy,
  budgets,
  totals,
}: {
  filterBy: string | null;
  budgets: Budget[];
  totals: Totals;
}) => {
  const category = (filterBy || "total") as SpendingCategory;

  const activeBudget = budgets.find((b) => b.category === category)?.amount;
  if (!activeBudget) return null;

  const activeTotal = (totals[category] ?? 0) / 100;

  return (
    <BudgetPercentBar
      amount={activeTotal}
      budget={activeBudget}
      label={category.toLocaleLowerCase().replaceAll("_", " ")}
    />
  );
};

const OverallBudgetPercent = ({
  totals,
  budgets,
}: {
  totals: Totals;
  budgets: Budget[];
}) => {
  const overallBudget = budgets.reduce((total, { amount }) => {
    return amount < 0 ? total + amount : total;
  }, 0);

  if (overallBudget === 0) return null;

  const totalOutOfBudget =
    budgets.reduce((total, { category, amount }) => {
      if (amount >= 0) return total;

      const spent = totals[category as SpendingCategory];
      return spent ? total + spent : total;
    }, 0) / 100;

  return (
    <BudgetPercentBar
      amount={totalOutOfBudget}
      budget={overallBudget}
      label="Overall"
    />
  );
};

const BudgetPercentBar = ({
  amount,
  budget,
  label,
}: {
  amount: number;
  budget: number;
  label: string;
}) => {
  const percentColor =
    budget > 0 ? "bg-success" : budget > amount ? "bg-danger" : "bg-secondary";

  const absoluteAmountString = formatAsGBP(Math.abs(amount));

  const absoluteBudgetString = formatAsGBP(Math.abs(budget));

  const percentLabel = `${label} - ${absoluteAmountString} / ${absoluteBudgetString}`;

  return (
    <Progress
      value={Math.abs(amount)}
      maxValue={Math.abs(budget)}
      label={percentLabel}
      valueLabel={(amount / budget).toLocaleString(undefined, {
        style: "percent",
      })}
      classNames={{
        indicator: percentColor,
        track: "bg-default/70",
        label: "capitalize",
      }}
      showValueLabel
    />
  );
};

const CategoryChip = ({
  category,
  totals,
  budgets,
  filterBy,
  setFilterBy,
}: {
  category: SpendingCategoryWithTotal;
  totals: Totals;
  budgets: Budget[];
  filterBy: SpendingCategory | null;
  setFilterBy: (v: SpendingCategory | null) => void;
}) => {
  const budget = budgets.find((b) => b.category === category)?.amount;
  const total = (totals[category] ?? 0) / 100;

  const searchParamKey = category === "total" ? "" : category;

  const percentOfBudget = budget ? total / budget : 0;

  const totalString = formatAsGBP(total);

  const absoluteTotalString = formatAsGBP(Math.abs(total));

  const absoluteBudgetString = budget && formatAsGBP(Math.abs(budget));

  const categoryName = category.replaceAll("_", " ").toLocaleLowerCase();
  const tooltipString = (
    <div className="flex flex-col items-center gap-2">
      <div className="capitalize">{categoryName}</div>
      <div>
        {absoluteTotalString}
        {budget
          ? ` / ${absoluteBudgetString} (${percentOfBudget.toLocaleString(undefined, { style: "percent" })})`
          : ""}
      </div>
    </div>
  );

  const budgetColour =
    !budget || budget > 0
      ? "bg-success text-white"
      : percentOfBudget > 1
        ? "bg-danger text-white"
        : "bg-secondary text-white";

  const pillColour =
    category === "total" && budget === undefined
      ? total < 0
        ? "bg-danger text-white"
        : "bg-success text-white"
      : "bg-default";

  const CategoryIcon =
    category === "total" ? undefined : CategoryIcons[category];

  const categoryOnClick =
    filterBy === category || category === "total" ? null : category;

  return (
    <button onClick={() => setFilterBy(categoryOnClick)}>
      <Tooltip content={tooltipString} closeDelay={0}>
        <div
          color={category === filterBy ? "primary" : "default"}
          className={`duration-25 relative z-10 flex h-7 items-center rounded-full ${pillColour} px-3 text-xs text-foreground transition-colors-opacity sm:hover:opacity-80 ${filterBy && searchParamKey !== filterBy ? "opacity-50" : ""}`}
        >
          <div
            className={`absolute bottom-full left-0 top-0 flex items-center overflow-visible rounded-l-full ${percentOfBudget >= 0.9 ? "rounded-r-full" : ""} ${budgetColour}`}
            style={{
              width: `${Math.min(percentOfBudget * 100, 100)}%`,
              minWidth: percentOfBudget !== 0 ? "10px" : undefined,
              height: "100%",
              overflow: "hidden",
            }}
          >
            <div className="box-border flex items-center gap-2 overflow-hidden whitespace-nowrap px-3 capitalize">
              <span className="items-center">
                {CategoryIcon ? <CategoryIcon size="16" /> : categoryName}
              </span>
              <span className="flex items-center">{totalString}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 capitalize">
            <span className="items-center">
              {CategoryIcon ? <CategoryIcon size="16" /> : categoryName}
            </span>
            <span className="items-center">{totalString}</span>
          </div>
        </div>
      </Tooltip>
    </button>
  );
};
