"use client";

import { SpendingCategory, Transactions } from "@/lib/starling-types";
import { type Budget } from "@prisma/client";
import { useState } from "react";
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

export const TransactionFeed = ({
  totals,
  budgets,
  start,
  categories,
  feedItems,
}: Props) => {
  const [category, setCategory] = useState<SpendingCategory | null>(null);
  const filteredItems = category
    ? feedItems.filter((i) => i.spendingCategory === category)
    : feedItems;

  return (
    <>
      <Categories
        totals={totals}
        budgets={budgets}
        startDate={start}
        filterBy={category}
        setFilterBy={setCategory}
      />
      <div className="flex flex-1 flex-col">
        {filteredItems.map((feedItem) => (
          <FeedEntry
            key={feedItem.feedItemUid}
            feedItem={feedItem}
            orderedCategories={categories}
          />
        ))}
      </div>
    </>
  );
};
