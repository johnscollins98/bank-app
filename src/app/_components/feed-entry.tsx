'use client';

import { SPENDING_CATEGORIES, Transactions } from '@/lib/starling-types';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
} from '@nextui-org/react';
import DateDisplay from './date';
import TimeDisplay from './time';
import setCategory from '@/lib/actions/set-category';

interface Props {
  feedItem: Transactions['feedItems'][number];
}

export default function FeedEntry({ feedItem }: Props) {
  return (
    <Dropdown className="dark">
      <DropdownTrigger>
        <div className="p-3 border-t border-b border-gray-600">
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
      </DropdownTrigger>
      <DropdownMenu className="max-h-[50vh] overflow-auto" aria-label="category-menu">
        <DropdownSection title="Choose new category">
          {SPENDING_CATEGORIES.map((c) => (
            <DropdownItem className="capitalize" key={c} onClick={() => setCategory(c, feedItem.feedItemUid)}>
              {c.replaceAll('_', ' ').toLocaleLowerCase()}
            </DropdownItem>
          ))}
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}
