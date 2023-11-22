import { Starling } from '@/lib/starling-api-service';
import { Button, ButtonGroup, Chip } from '@nextui-org/react';
import Link from 'next/link';
import TransactionTable from './table';

function lastDayOfMonth(dayIndex: number, year: number, month: number) {
  var lastDay = new Date(year, month + 1, 0);
  if (lastDay.getDay() < dayIndex) {
    lastDay.setDate(lastDay.getDate() - 7);
  }
  lastDay.setDate(lastDay.getDate() - (lastDay.getDay() - dayIndex));
  return lastDay;
}

export default async function Home({ searchParams }: { searchParams: Record<string, string> }) {
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
  );

  const createRedirectLink = (newOffset: number) =>
    new URLSearchParams({ ...searchParams, offset: newOffset.toString() }).toString();

  const total = transactions.feedItems.reduce(
    (total, transaction) => {
      const value =
        transaction.direction === 'IN'
          ? transaction.amount.minorUnits
          : -1 * transaction.amount.minorUnits;
      const category = transaction.spendingCategory;

      return {
        ...total,
        [category]: (total[category] ?? 0) + value,
        total: total.total + value,
      };
    },
    { total: 0 } as Record<string, number>
  );

  return (
    <main className="dark flex h-[100dvh] flex-col p-4 gap-4 overflow-hidden">
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
      <div className='font-bold'>
      Balance: £ {balance.effectiveBalance.minorUnits / 100}
      </div>
      <div className="flex gap-2 flex-wrap">
        <Link
          href={`.?${new URLSearchParams({ ...searchParams, filterBy: '' }).toString()}`}
          passHref
        >
          <Chip
            className="hover:bg-blue-600 transition-colors duration-25 text-xs"
            color={filterBy === '' ? 'primary' : 'default'}
          >
            <div className="flex gap-2">
              <div>Total</div>
              <div>£{total.total / 100}</div>
            </div>
          </Chip>
        </Link>
        {Object.keys(total)
          .filter((k) => k !== 'total')
          .sort((a, b) => total[a] - total[b])
          .map((key) => (
            <Link
              passHref
              href={`.?${new URLSearchParams({
                ...searchParams,
                filterBy: filterBy === key ? '' : key,
              })}`}
              key={key}
              color={key === filterBy ? 'primary' : 'default'}
            >
              <Chip
                color={key === filterBy ? 'primary' : 'default'}
                className="hover:bg-blue-600 transition-colors duration-25 text-xs"
              >
                <div className="flex gap-2">
                  <div className="capitalize">{key.replaceAll('_', ' ').toLocaleLowerCase()}</div>
                  <div className={total[key] > 0 ? 'text-green-500' : ''}>
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
