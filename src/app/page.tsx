import { getStartAndEndOfMonth } from "@/lib/date-range";
import { orderCategoriesByPopularity } from "@/lib/ordered-categories";
import getUserAccount from "@/lib/user";
import { Button, ButtonGroup } from "@nextui-org/react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import Categories from "./_components/categories";
import DateDisplay from "./_components/date";
import FeedEntry from "./_components/feed-entry";
import LogoutForm from "./_components/logout-form";

export default async function Home({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const { user, starling, accountId, localAccount, defaultCategory } =
    await getUserAccount();

  const offset = parseInt(searchParams.offset ?? 0);
  const filterBy = searchParams.filterBy ?? "";

  const date = new Date(Date.now());
  date.setHours(0, 0, 0, 0);

  const { start, end } = getStartAndEndOfMonth(
    date,
    localAccount.monthBarrier,
    localAccount.day,
    offset,
  );

  const balance = await starling.getBalance(accountId);

  const transactions = await starling.getTransactions(
    accountId,
    start,
    end,
    defaultCategory,
  );
  const filteredTransactions = transactions.feedItems.filter(
    (i) => i.status !== "UPCOMING" && i.status !== "DECLINED",
  );
  const feedItems = filteredTransactions
    .filter((item) => filterBy === "" || item.spendingCategory === filterBy)
    .toSorted(
      (a, b) => Date.parse(b.transactionTime) - Date.parse(a.transactionTime),
    );

  const createRedirectLink = (newOffset: number) =>
    new URLSearchParams({
      ...searchParams,
      offset: newOffset.toString(),
    }).toString();

  const orderedCategories = orderCategoriesByPopularity(feedItems);

  return (
    <main className="flex h-[100dvh] flex-1 flex-col gap-4 overflow-hidden p-4">
      <LogoutForm user={user} />
      <div className="flex items-center justify-between gap-2">
        <DateDisplay date={start} /> - {<DateDisplay date={end} />}
        <ButtonGroup>
          <Button size="sm" as="a" href={`.?${createRedirectLink(offset - 1)}`}>
            <FaArrowLeft />
          </Button>
          <Button size="sm" as="a" href={`.?${createRedirectLink(0)}`}>
            Today
          </Button>
          <Button size="sm" as="a" href={`.?${createRedirectLink(offset + 1)}`}>
            <FaArrowRight />
          </Button>
        </ButtonGroup>
      </div>
      <div className="font-bold">
        Balance: £ {balance.effectiveBalance.minorUnits / 100}
      </div>
      <Categories
        searchParams={searchParams}
        transactions={filteredTransactions}
      />
      <div className="flex flex-1 flex-col overflow-auto">
        {feedItems.map((feedItem) => (
          <FeedEntry
            key={feedItem.feedItemUid}
            feedItem={feedItem}
            orderedCategories={orderedCategories}
          />
        ))}
      </div>
    </main>
  );
}
