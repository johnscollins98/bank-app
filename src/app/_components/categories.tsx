"use client";

import { Budgets } from "@/lib/accounts";
import { SPENDING_CATEGORIES, SpendingCategory } from "@/lib/starling-types";
import { Accordion, AccordionItem, Progress, Tooltip } from "@nextui-org/react";
import Link from "next/link";

export const moneyFormat: Intl.NumberFormatOptions = {
  style: "currency",
  currency: "GBP",
};

type Totals = Record<SpendingCategory | "total", number>;

interface Props {
  searchParams: Record<string, string>;
  totals: Totals;
  budgets?: Budgets;
}

export default function Categories({ searchParams, totals, budgets }: Props) {
  const { filterBy } = searchParams;

  return (
    <Accordion>
      <AccordionItem title="Spending Summary">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap gap-2">
            <CategoryChip
              totals={totals}
              category="total"
              filterBy={filterBy}
              searchParams={searchParams}
              budgets={budgets}
            />
            {SPENDING_CATEGORIES.filter((k) => !!totals[k])
              .toSorted((a, b) => totals[a] - totals[b])
              .map((category) => (
                <CategoryChip
                  category={category}
                  key={category}
                  totals={totals}
                  budgets={budgets}
                  searchParams={searchParams}
                  filterBy={filterBy}
                />
              ))}
          </div>
          <BudgetPercent
            totals={totals}
            budgets={budgets}
            filterBy={filterBy}
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
  filterBy?: string;
  budgets?: Budgets;
  totals: Totals;
}) => {
  if (!filterBy || !budgets) return null;
  const category = filterBy as SpendingCategory;

  const activeBudget = budgets[category];
  if (!activeBudget) return null;

  const activeTotal = (totals[category] ?? 0) / 100;

  const percentColor =
    activeBudget > 0
      ? "dark:bg-success bg-success-200"
      : activeBudget > activeTotal
        ? "dark:bg-danger bg-danger-200"
        : "dark:bg-secondary bg-secondary-200";

  const absoluteTotalString = Math.abs(activeTotal).toLocaleString(
    undefined,
    moneyFormat,
  );

  const absoluteBudgetString = Math.abs(activeBudget).toLocaleString(
    undefined,
    moneyFormat,
  );

  const percentLabel = `${category.toLocaleLowerCase().replaceAll("_", " ")} - ${absoluteTotalString} / ${absoluteBudgetString}`;

  return (
    <div>
      <Progress
        value={Math.abs(activeTotal)}
        maxValue={Math.abs(activeBudget)}
        label={percentLabel}
        valueLabel={(activeTotal / activeBudget).toLocaleString(undefined, {
          style: "percent",
        })}
        classNames={{
          indicator: percentColor,
          label: "capitalize",
        }}
        showValueLabel
      />
    </div>
  );
};

const CategoryChip = ({
  category,
  totals,
  budgets,
  searchParams,
  filterBy,
}: {
  category: SpendingCategory | "total";
  totals: Totals;
  budgets?: Budgets;
  filterBy?: string;
  searchParams: Record<string, string>;
}) => {
  const budget = category === "total" ? undefined : budgets?.[category];
  const total = totals[category] / 100;

  const searchParamKey = category === "total" ? "" : category;

  const percentOfBudget = budget ? Math.floor((total / budget) * 100) : 0;

  const totalString = total.toLocaleString(undefined, moneyFormat);

  const absoluteTotalString = Math.abs(total).toLocaleString(
    undefined,
    moneyFormat,
  );

  const absoluteBudgetString =
    budget && Math.abs(budget).toLocaleString(undefined, moneyFormat);

  const tooltipString = `${absoluteTotalString} ${total > 0 ? "earned" : "spent"} ${budget ? `out of ${absoluteBudgetString} budget (${percentOfBudget}%)` : ""}`;

  const budgetColour =
    !budget || budget > 0
      ? "bg-success-200 dark:bg-success"
      : percentOfBudget > 100
        ? "bg-danger-200 dark:bg-danger"
        : "bg-secondary-200 dark:bg-secondary";

  const pillColour =
    category === "total" && total < 0 ? "bg-danger" : "bg-default";

  return (
    <Link
      passHref
      href={`.?${new URLSearchParams({
        ...searchParams,
        filterBy: filterBy === searchParamKey ? "" : searchParamKey,
      })}`}
    >
      <Tooltip content={tooltipString} closeDelay={0}>
        <div
          color={category === filterBy ? "primary" : "default"}
          className={`duration-25 relative z-10 flex h-7 items-center rounded-full ${pillColour} px-3 text-xs transition-colors-opacity hover:opacity-80 ${filterBy && searchParamKey !== filterBy ? "opacity-50" : ""}`}
        >
          <div
            className={`absolute bottom-full left-0 top-0 -z-10 overflow-visible rounded-l-full ${percentOfBudget >= 90 ? "rounded-r-full" : ""} ${budgetColour}`}
            style={{
              width: `${Math.min(percentOfBudget, 100)}%`,
              minWidth: percentOfBudget !== 0 ? "10px" : undefined,
              height: "100%",
            }}
          ></div>
          <div className="flex gap-2">
            <div className="capitalize">
              {category.replaceAll("_", " ").toLocaleLowerCase()}
            </div>
            <div>{totalString}</div>
          </div>
        </div>
      </Tooltip>
    </Link>
  );
};
