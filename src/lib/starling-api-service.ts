import { Accounts, Balance, Transactions } from './starling-types';

export class Starling {
  constructor(private readonly apiKey: string) {
  }

  async getAccounts(): Promise<Accounts> {
    return await this.fetch('accounts');
  }

  async getTransactions(accountId: string, start: Date, end: Date, defaultCategory: string): Promise<Transactions> {
    const startOfDay = new Date(start);
    startOfDay.setHours(0, 0, 0);

    const endOfDay = new Date(end);
    endOfDay.setHours(23, 59, 59);
    const params = new URLSearchParams({
      minTransactionTimestamp: start.toISOString(),
      maxTransactionTimestamp: endOfDay.toISOString(),
    });

    return await this.fetch(
      `feed/account/${accountId}/category/${defaultCategory}/transactions-between?${params.toString()}`
    );
  }

  async getBalance(accountId: string): Promise<Balance> {
    return await this.fetch(`accounts/${accountId}/balance`);
  }

  private async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`https://api.starlingbank.com/api/v2/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
      cache: 'no-store',
      ...options
    });

    if (!response.ok) {
      throw response.status;
    }

    const data = await response.json();

    return data as T;
  }
}
