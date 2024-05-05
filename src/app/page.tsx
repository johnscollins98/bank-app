import { getStartAndEndOfMonth } from "@/lib/date-range";
import getUserAccount from "@/lib/user";
import { Button, ButtonGroup } from "@nextui-org/react";
import { getServerSession } from "next-auth";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import Categories from "./_components/categories";
import DateDisplay from "./_components/date";
import FeedEntry from "./_components/feed-entry";
import LoginForm from "./_components/login-form";
import LogoutForm from "./_components/logout-form";

export default async function Home({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const session = await getServerSession();

  if (!session) {
    return <LoginForm />;
  }

  const { starling, accountId, localAccount, defaultCategory } =
    await getUserAccount(session);

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

  return (
    <main className="dark flex flex-1 flex-col p-4 gap-4 overflow-hidden">
      <LogoutForm session={session} />
      <div className="flex gap-2 items-center justify-between">
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
          <FeedEntry key={feedItem.feedItemUid} feedItem={feedItem} />
        ))}
      </div>
    </main>
  );
}
