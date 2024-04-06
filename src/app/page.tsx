import { Starling } from '@/lib/starling-api-service';
import { Button, ButtonGroup } from '@nextui-org/react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Categories from './_components/categories';
import DateDisplay from './_components/date';
import LoginForm from './_components/login-form';
import LogoutForm from './_components/logout-form';
import TimeDisplay from './_components/time';
import { getStartAndEndOfMonth } from '@/lib/date-range';

export default async function Home({ searchParams }: { searchParams: Record<string, string> }) {
  const session = await getServerSession();

  if (!session) {
    return <LoginForm />;
  }

  if (!process.env.EMAIL || !process.env.EMAIL_2) {
    throw new Error("Email addresses not defined");
  }

  if (!process.env.API_TOKEN || !process.env.API_TOKEN_2) {
    throw new Error("Api tokens not defined");
  }

  const email = session.user?.email;
  if (!email) {
    redirect('/forbidden');
  }

  if (email !== process.env.EMAIL && email !== process.env.EMAIL_2) {
    redirect('/forbidden');
  }

  const offset = parseInt(searchParams.offset ?? 0);
  const filterBy = searchParams.filterBy ?? '';
  const starling = new Starling(email === process.env.EMAIL ? process.env.API_TOKEN : process.env.API_TOKEN_2);
  const accounts = await starling.getAccounts();
  const accountId = accounts.accounts[0].accountUid;
  const defaultCategory = accounts.accounts[0].defaultCategory;

  const date = new Date(Date.now());
  date.setHours(0, 0, 0, 0);

  if (offset != 0) {
    date.setMonth(date.getMonth() + offset);
  }

  const { start, end } = getStartAndEndOfMonth(email, date)

  const balance = await starling.getBalance(accountId);

  const transactions = await starling.getTransactions(
    accountId, 
    start, 
    end,
    defaultCategory
  );
  const transactionsWithoutUpcoming = transactions.feedItems.filter(i => i.status !== 'UPCOMING');
  const feedItems = transactionsWithoutUpcoming
    .filter((item) => filterBy === '' || item.spendingCategory === filterBy)
    .toSorted((a, b) => Date.parse(b.transactionTime) - Date.parse(a.transactionTime));

  const createRedirectLink = (newOffset: number) =>
    new URLSearchParams({ ...searchParams, offset: newOffset.toString() }).toString();

  return (
    <main className="dark flex flex-1 flex-col p-4 gap-4 overflow-hidden">
      <LogoutForm session={session} />
      <div className="flex gap-2 items-center justify-between">
        <DateDisplay date={start} /> - {<DateDisplay date={end} />}
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
      <Categories searchParams={searchParams} transactions={transactionsWithoutUpcoming} />
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
