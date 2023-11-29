import { Accounts, Balance, Transactions } from './starling-types';

export class Starling {
  private readonly apiKey: string;

  constructor() {
    this.apiKey = process.env.API_TOKEN as string;
  }

  async getAccounts(): Promise<Accounts> {
    return await this.fetch('accounts');
  }

  async getTransactions(accountId: string, start: Date, end: Date): Promise<Transactions> {
    const endOfDay = new Date(end);
    endOfDay.setHours(23, 59, 59);
    const params = new URLSearchParams({
      minTransactionTimestamp: start.toISOString(),
      maxTransactionTimestamp: endOfDay.toISOString(),
    });

    return await this.fetch(
      `feed/account/${accountId}/settled-transactions-between?${params.toString()}`
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
      ...options,
      next: {
        revalidate: 600,
      },
    });

    if (!response.ok) {
      throw response.status;
    }

    const data = await response.json();

    return data as T;
  }
}
