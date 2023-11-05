'use client';

import { Transactions } from '@/lib/starling-types';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';

interface Props {
  feedItems: Transactions['feedItems'];
}

export default function TransactionTable({ feedItems }: Props) {
  return (
    <Table isHeaderSticky={true}>
      <TableHeader>
        <TableColumn>Date</TableColumn>
        <TableColumn>Recipient</TableColumn>
        <TableColumn>Amount</TableColumn>
        <TableColumn>Reference</TableColumn>
        <TableColumn>Category</TableColumn>
      </TableHeader>
      <TableBody>
        {feedItems.map((transaction) => (
          <TableRow key={transaction.feedItemUid}>
            <TableCell>
              {new Date(transaction.transactionTime).toLocaleString(undefined, {
                dateStyle: 'long',
                timeStyle: 'short',
              })}
            </TableCell>
            <TableCell>{transaction.counterPartyName}</TableCell>
            <TableCell className={`font-bold ${transaction.direction === 'IN' && 'text-blue-400'}`}>
              {transaction.direction === 'IN' && '+'}£
              {(transaction.amount.minorUnits / 100).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </TableCell>
            <TableCell>{transaction.reference}</TableCell>
            <TableCell className="capitalize">
              {transaction.spendingCategory.toLowerCase().replaceAll('_', ' ')}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
