"use client";

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
