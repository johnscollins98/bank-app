"use client";

import { Budgets } from "@/lib/accounts";
import { SPENDING_CATEGORIES, SpendingCategory } from "@/lib/starling-types";
import { Accordion, AccordionItem, Tooltip } from "@nextui-org/react";
import Link from "next/link";

interface Props {
  searchParams: Record<string, string>;
  totals: Record<SpendingCategory | "total", number>;
  budgets?: Budgets;
}

export default function Categories({ searchParams, totals, budgets }: Props) {
  const { filterBy } = searchParams;

  return (
    <Accordion>
      <AccordionItem title="Spending Summary">
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
      </AccordionItem>
    </Accordion>
  );
}

const CategoryChip = ({
  category,
  totals,
  budgets,
  searchParams,
  filterBy,
}: {
  category: SpendingCategory | "total";
  totals: Record<SpendingCategory | "total", number>;
  budgets?: Budgets;
  filterBy: string;
  searchParams: Record<string, string>;
}) => {
  const budget = category === "total" ? undefined : budgets?.[category];
  const total = totals[category] / 100;

  const searchParamKey = category === "total" ? "" : category;

  const percentOfBudget = budget ? Math.floor((total / budget) * 100) : 0;

  const moneyFormat: Intl.NumberFormatOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };

  const totalString = total.toLocaleString(undefined, moneyFormat);

  const absoluteTotalString = Math.abs(total).toLocaleString(
    undefined,
    moneyFormat,
  );

  const absoluteBudgetString =
    budget && Math.abs(budget).toLocaleString(undefined, moneyFormat);

  const tooltipString = `£${absoluteTotalString} ${total > 0 ? "earned" : "spent"} ${budget ? `out of £${absoluteBudgetString} budget (${percentOfBudget}%)` : ""}`;

  const budgetColour =
    !budget || budget > 0
      ? "dark:bg-green-600 bg-green-300"
      : percentOfBudget > 100
        ? "dark:bg-red-600 bg-red-300"
        : "dark:bg-purple-600 bg-purple-300";

  const pillColour =
    category === "total" && total < 0
      ? "dark:bg-red-600 bg-red-300"
      : "bg-default";

  return (
    <Link
      passHref
      href={`.?${new URLSearchParams({
        ...searchParams,
        filterBy: filterBy === searchParamKey ? "" : searchParamKey,
      })}`}
    >
      <Tooltip content={tooltipString}>
        <div
          color={category === filterBy ? "primary" : "default"}
          className={`duration-25 relative z-10 flex h-7 items-center rounded-full ${pillColour} px-3 text-xs transition-colors-opacity hover:opacity-80 ${searchParamKey === filterBy ? "font-bold" : "font-normal"}`}
        >
          <div
            className={`absolute bottom-full left-0 top-0 -z-10 overflow-visible rounded-l-full ${percentOfBudget >= 100 ? "rounded-r-full" : ""} ${budgetColour}`}
            style={{
              width: `${Math.min(percentOfBudget, 100)}%`,
              height: "100%",
            }}
          ></div>
          <div className="flex gap-2">
            <div className="capitalize">
              {category.replaceAll("_", " ").toLocaleLowerCase()}
            </div>
            <div>£{totalString}</div>
          </div>
        </div>
      </Tooltip>
    </Link>
  );
};
