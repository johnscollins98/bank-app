import { Starling } from '@/lib/starling-api-service';
import { Button, ButtonGroup } from '@nextui-org/react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Categories from './_components/categories';
import DateDisplay from './_components/date';
import LoginForm from './_components/login-form';
import LogoutForm from './_components/logout-form';
import TimeDisplay from './_components/time';

function lastDayOfMonth(dayIndex: number, year: number, month: number) {
  var lastDay = new Date(year, month + 1, 0);
  if (lastDay.getDay() < dayIndex) {
    lastDay.setDate(lastDay.getDate() - 7);
  }
  lastDay.setDate(lastDay.getDate() - (lastDay.getDay() - dayIndex));
  return lastDay;
}

export default async function Home({ searchParams }: { searchParams: Record<string, string> }) {
  const session = await getServerSession();

  if (!session) {
    return <LoginForm />;
  }

  if (session?.user?.email !== process.env.EMAIL) {
    redirect('/forbidden');
  }

  const offset = parseInt(searchParams.offset ?? 0);
  const filterBy = searchParams.filterBy ?? '';
  const starling = new Starling();
  const accounts = await starling.getAccounts();
  const accountId = accounts.accounts[0].accountUid;
  const defaultCategory = accounts.accounts[0].defaultCategory;

  const date = new Date(Date.now());
  date.setHours(0, 0, 0, 0);

  if (offset != 0) {
    date.setMonth(date.getMonth() + offset);
  }

  let lastThursdayThisMonth = lastDayOfMonth(4, date.getFullYear(), date.getMonth());
  if (lastThursdayThisMonth < date) {
    // To account for days in the month that are after the last Wednesday
    date.setMonth(date.getMonth() + 1);
    lastThursdayThisMonth = lastDayOfMonth(4, date.getFullYear(), date.getMonth());
  }
  const dayBeforeLastThursdayThisMonth = new Date(lastThursdayThisMonth)
  dayBeforeLastThursdayThisMonth.setDate(lastThursdayThisMonth.getDate() - 1);

  date.setMonth(date.getMonth() - 1);
  const lastThursdayPreviousMonth = lastDayOfMonth(4, date.getFullYear(), date.getMonth());

  const balance = await starling.getBalance(accountId);

  const transactions = await starling.getTransactions(
    accountId, 
    lastThursdayPreviousMonth, 
    dayBeforeLastThursdayThisMonth,
    defaultCategory
  );
  const feedItems = transactions.feedItems
    .filter((item) => filterBy === '' || item.spendingCategory === filterBy)
    .toSorted((a, b) => Date.parse(b.transactionTime) - Date.parse(a.transactionTime));

  const createRedirectLink = (newOffset: number) =>
    new URLSearchParams({ ...searchParams, offset: newOffset.toString() }).toString();

  return (
    <main className="dark flex flex-1 flex-col p-4 gap-4 overflow-hidden">
      <LogoutForm session={session} />
      <div className="flex gap-2 items-center justify-between">
        <DateDisplay date={lastThursdayPreviousMonth} /> - {<DateDisplay date={dayBeforeLastThursdayThisMonth} />}
        <ButtonGroup>
          <Button size="sm" as="a" href={`.?${createRedirectLink(offset - 1)}`}>
            Previous Month
          </Button>
          <Button size="sm" as="a" href={`.?${createRedirectLink(0)}`}>
            Today
          </Button>
          <Button size="sm" as="a" href={`.?${createRedirectLink(offset + 1)}`}>
            Next Month
          </Button>
        </ButtonGroup>
      </div>
      <div className="font-bold">Balance: £ {balance.effectiveBalance.minorUnits / 100}</div>
      <Categories searchParams={searchParams} transactions={transactions} />
      <div className="flex flex-1 flex-col overflow-auto">
        {feedItems.map((feedItem) => (
          <div key={feedItem.feedItemUid} className="p-3 border-t border-b border-gray-600">
            <div className="flex justify-between">
              <div className="font-bold">{feedItem.counterPartyName}</div>
              <div className={`font-bold ${feedItem.direction === 'IN' && 'text-blue-400'}`}>
                {feedItem.direction === 'IN' && '+'}£
                {(feedItem.amount.minorUnits / 100).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <div className="flex gap-3">
                <div className="capitalize font-bold">
                  {feedItem.spendingCategory.replaceAll('_', ' ').toLowerCase()}
                </div>
                <div>{feedItem.reference}</div>
              </div>
              <div>
                <DateDisplay date={new Date(feedItem.transactionTime)} />,{' '}
                <TimeDisplay date={new Date(feedItem.transactionTime)} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
