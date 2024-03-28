export interface Accounts {
  accounts: {
    accountUid: string;
    accountType: 'PRIMARY' | 'ADDITIONAL' | 'LOAN' | 'FIXED_TERM_DEPOSIT';
    defaultCategory: string;
    currency: string;
    createdAt: string;
    name: string;
  }[];
}

export interface SignedCurrencyAndAmount {
  currency: string;
  minorUnits: number;
}

export interface Transactions {
  feedItems: {
    feedItemUid: string;
    counterPartyName: string;
    spendingCategory: string;
    reference: string;
    transactionTime: string;
    amount: SignedCurrencyAndAmount;
    direction: 'IN' | 'OUT';
    status: 'UPCOMING' | 'UPCOMING_CANCELLED' | 'PENDING' | 'REVERSED' | 'SETTLED' | 'DECLINED' | 'REFUNDED' | 'RETRYING' | 'ACCOUNT_CHECK'
  }[];
}

export interface Balance {
  effectiveBalance: SignedCurrencyAndAmount;
  clearedBalance: SignedCurrencyAndAmount;
}
