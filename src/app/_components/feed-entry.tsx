"use client";

import setCategory from "@/lib/actions/set-category";
import {
  SPENDING_CATEGORIES,
  SpendingCategory,
  Transactions,
} from "@/lib/starling-types";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import { useOptimistic, useState } from "react";
import DateDisplay from "./date";
import TimeDisplay from "./time";

interface Props {
  feedItem: Transactions["feedItems"][number];
}

export default function FeedEntry({ feedItem }: Props) {
  const [optimisticFeedItem, updateOptimisticFeedItem] = useOptimistic(
    feedItem,
    (_state, newFeedItem: typeof feedItem) => newFeedItem
  );

  const updateCategoryHandler = async (c: SpendingCategory) => {
    updateOptimisticFeedItem({ ...feedItem, spendingCategory: c });
    await setCategory(c, feedItem.feedItemUid);
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");

  return (
    <>
      <div
        onClick={() => setModalOpen(true)}
        className="p-3 border-t border-b border-foreground-200 hover:bg-foreground-50 transition-colors duration-100 cursor-pointer"
      >
        <div className="flex justify-between">
          <div className="font-bold">{optimisticFeedItem.counterPartyName}</div>
          <div
            className={`font-bold ${
              optimisticFeedItem.direction === "IN" &&
              "text-blue-600 dark:text-blue-400"
            }`}
          >
            {optimisticFeedItem.direction === "IN" && "+"}£
            {(optimisticFeedItem.amount.minorUnits / 100).toLocaleString(
              undefined,
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}
          </div>
        </div>
        <div className="flex justify-between text-xs text-foreground-500">
          <div className="flex gap-3">
            <div className="capitalize font-bold">
              {optimisticFeedItem.spendingCategory
                .replaceAll("_", " ")
                .toLowerCase()}
            </div>
            <div>{optimisticFeedItem.reference}</div>
          </div>
          <div>
            <DateDisplay date={new Date(optimisticFeedItem.transactionTime)} />,{" "}
            <TimeDisplay date={new Date(optimisticFeedItem.transactionTime)} />
          </div>
        </div>
      </div>
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setCategoryFilter("");
        }}
        scrollBehavior="inside"
        size="sm"
      >
        <ModalContent>
          <ModalHeader>Select a category...</ModalHeader>
          <ModalBody>
            <Input
              label="Filter"
              value={categoryFilter}
              size="lg"
              onChange={(e) => setCategoryFilter(e.target.value)}
            />
            <div className="h-dvh max-h-72">
              {SPENDING_CATEGORIES.filter((c) =>
                c
                  .toLocaleLowerCase()
                  .includes(categoryFilter.toLocaleLowerCase())
              ).map((c) => (
                <Button
                  className="capitalize my-1"
                  variant="light"
                  fullWidth
                  key={c}
                  onClick={() => updateCategoryHandler(c)}
                >
                  {c.replaceAll("_", " ").toLocaleLowerCase()}
                </Button>
              ))}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
