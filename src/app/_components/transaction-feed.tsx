"use client";

import { formatAsGBP } from "@/lib/currency-format";
import {
  SPENDING_CATEGORIES,
  SpendingCategory,
  Transactions,
} from "@/lib/starling-types";
import { type Budget } from "@prisma/client";
import { usePathname, useSearchParams } from "next/navigation";
import { z } from "zod";
import Categories from "./categories";
import FeedEntry from "./feed-entry";

export type SpendingCategoryWithTotal = SpendingCategory | "total";
export type Totals = Record<SpendingCategoryWithTotal, number>;
export type BudgetsWithOverride = (Budget & { isOverride?: boolean })[];

interface Props {
  totals: Totals;
  budgets: BudgetsWithOverride;
  feedItems: Transactions["feedItems"];
  categories: SpendingCategory[];
  start: Date;
}

const categorySchema = z.enum(SPENDING_CATEGORIES);

export const TransactionFeed = ({
  totals,
  budgets,
  start,
  categories,
  feedItems,
}: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const category =
    categorySchema.safeParse(searchParams.get("filterBy")).data ?? null;

  const setCategory = (category: SpendingCategory | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set("filterBy", category);
    } else {
      params.delete("filterBy");
    }
    const url = `${pathname}?${params}`;
    window.history.replaceState(null, "", url);
  };

  const filteredItems = category
    ? feedItems.filter((i) => i.spendingCategory === category)
    : feedItems;

  const groupedByDay = filteredItems.reduce(
    (groups, item) => {
      const day = new Date(item.transactionTime).toLocaleDateString(undefined, {
        dateStyle: "long",
      });

      const itemsForDay = groups[day] ?? { total: 0, items: [] };

      const toAdd =
        item.direction === "IN"
          ? (item.amount.minorUnits / 100) * -1
          : item.amount.minorUnits / 100;
      const total = itemsForDay.total + toAdd;
      const items = [...itemsForDay.items, item];

      return { ...groups, [day]: { total, items } };
    },
    {} as Record<string, { total: number; items: Transactions["feedItems"] }>,
  );

  return (
    <>
      <Categories
        totals={totals}
        budgets={budgets}
        startDate={start}
        filterBy={category}
        setFilterBy={setCategory}
      />
      {Object.entries(groupedByDay).map(([title, { total, items }]) => (
        <div key={title}>
          <div className="flex items-center justify-between px-1 py-2 text-sm text-foreground-600">
            <div>{title}</div>
            <div>
              {total < 0 && "+ "}
              {formatAsGBP(Math.abs(total))}
            </div>
          </div>
          <div className="flex flex-1 flex-col rounded-md bg-foreground-100">
            {items.map((feedItem) => (
              <FeedEntry
                key={feedItem.feedItemUid}
                feedItem={feedItem}
                orderedCategories={categories}
              />
            ))}
          </div>
        </div>
      ))}
    </>
  );
};
