import { Starling } from '@/lib/starling-api-service';
import { Button, ButtonGroup } from '@nextui-org/react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Categories from './_components/categories';
import LoginForm from './_components/login-form';
import LogoutForm from './_components/logout-form';

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

  const date = new Date(Date.now());

  if (offset != 0) {
    date.setMonth(date.getMonth() + offset);
  }

  const lastWednesday = lastDayOfMonth(3, date.getFullYear(), date.getMonth());
  date.setMonth(date.getMonth() - 1);
  const lastThursday = lastDayOfMonth(4, date.getFullYear(), date.getMonth());

  const balance = await starling.getBalance(accountId);

  const transactions = await starling.getTransactions(accountId, lastThursday, lastWednesday);
  const feedItems = transactions.feedItems.filter(
    (item) => filterBy === '' || item.spendingCategory === filterBy
  ).sort((a, b) => Date.parse(b.transactionTime) - Date.parse(a.transactionTime));

  const createRedirectLink = (newOffset: number) =>
    new URLSearchParams({ ...searchParams, offset: newOffset.toString() }).toString();

  return (
    <main className="dark flex flex-1 flex-col p-4 gap-4 overflow-hidden">
      <LogoutForm session={session} />
      <div className="flex gap-2 items-center justify-between">
        {lastThursday.toLocaleDateString()} - {lastWednesday.toLocaleDateString()}
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
                {new Date(feedItem.transactionTime).toLocaleDateString()},{' '}
                {new Date(feedItem.transactionTime).toLocaleTimeString(undefined, {
                  timeStyle: 'short',
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
