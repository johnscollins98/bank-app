"use client";

import setCategory from "@/lib/actions/set-category";
import {
  SPENDING_CATEGORIES,
  SpendingCategory,
  Transactions,
} from "@/lib/starling-types";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@nextui-org/react";
import { useOptimistic } from "react";
import DateDisplay from "./date";
import TimeDisplay from "./time";

interface Props {
  feedItem: Transactions["feedItems"][number];
}

export default function FeedEntry({ feedItem }: Props) {
  const [optimisticFeedItem, updateOptimisticFeedItem] = useOptimistic(
    feedItem,
    (_state, newFeedItem: typeof feedItem) => newFeedItem,
  );

  const updateCategoryHandler = async (c: SpendingCategory) => {
    updateOptimisticFeedItem({ ...feedItem, spendingCategory: c });
    await setCategory(c, feedItem.feedItemUid);
  };

  return (
    <Dropdown className="dark">
      <DropdownTrigger>
        <div className="p-3 border-t border-b border-gray-600">
          <div className="flex justify-between">
            <div className="font-bold">
              {optimisticFeedItem.counterPartyName}
            </div>
            <div
              className={`font-bold ${optimisticFeedItem.direction === "IN" && "text-blue-400"}`}
            >
              {optimisticFeedItem.direction === "IN" && "+"}£
              {(optimisticFeedItem.amount.minorUnits / 100).toLocaleString(
                undefined,
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                },
              )}
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <div className="flex gap-3">
              <div className="capitalize font-bold">
                {optimisticFeedItem.spendingCategory
                  .replaceAll("_", " ")
                  .toLowerCase()}
              </div>
              <div>{optimisticFeedItem.reference}</div>
            </div>
            <div>
              <DateDisplay
                date={new Date(optimisticFeedItem.transactionTime)}
              />
              ,{" "}
              <TimeDisplay
                date={new Date(optimisticFeedItem.transactionTime)}
              />
            </div>
          </div>
        </div>
      </DropdownTrigger>
      <DropdownMenu
        className="max-h-[50vh] overflow-auto"
        aria-label="category-menu"
      >
        <DropdownSection title="Choose new category">
          {SPENDING_CATEGORIES.map((c) => (
            <DropdownItem
              className="capitalize p-5 sm:p-2"
              key={c}
              onClick={() => updateCategoryHandler(c)}
            >
              {c.replaceAll("_", " ").toLocaleLowerCase()}
            </DropdownItem>
          ))}
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}
