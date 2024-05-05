"use client";

import { Transactions } from "@/lib/starling-types";
import { Accordion, AccordionItem, Chip } from "@nextui-org/react";
import Link from "next/link";

interface Props {
  searchParams: Record<string, string>;
  transactions: Transactions["feedItems"];
}

export default function Categories({ searchParams, transactions }: Props) {
  const { filterBy } = searchParams;

  const total = transactions.reduce(
    (total, transaction) => {
      const value =
        transaction.direction === "IN"
          ? transaction.amount.minorUnits
          : -1 * transaction.amount.minorUnits;
      const category = transaction.spendingCategory;

      return {
        ...total,
        [category]: (total[category] ?? 0) + value,
        total: total.total + value,
      };
    },
    { total: 0 } as Record<string, number>,
  );

  return (
    <Accordion>
      <AccordionItem title="Spending Summary">
        <div className="flex flex-wrap gap-2">
          <Link
            href={`.?${new URLSearchParams({
              ...searchParams,
              filterBy: "",
            }).toString()}`}
            passHref
          >
            <Chip
              className="duration-25 text-xs transition-colors hover:bg-blue-600 hover:text-white"
              color={filterBy === "" ? "primary" : "default"}
            >
              <div className="flex gap-2">
                <div>Total</div>
                <div>£{total.total / 100}</div>
              </div>
            </Chip>
          </Link>
          {Object.keys(total)
            .filter((k) => k !== "total")
            .toSorted((a, b) => total[a] - total[b])
            .map((key) => (
              <Link
                passHref
                href={`.?${new URLSearchParams({
                  ...searchParams,
                  filterBy: filterBy === key ? "" : key,
                })}`}
                key={key}
                color={key === filterBy ? "primary" : "default"}
              >
                <Chip
                  color={key === filterBy ? "primary" : "default"}
                  className="duration-25 text-xs transition-colors hover:bg-blue-600 hover:text-white"
                >
                  <div className="flex gap-2">
                    <div className="capitalize">
                      {key.replaceAll("_", " ").toLocaleLowerCase()}
                    </div>
                    <div className={total[key] > 0 ? "text-green-500" : ""}>
                      £
                      {(total[key] / 100).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                </Chip>
              </Link>
            ))}
        </div>
      </AccordionItem>
    </Accordion>
  );
}
