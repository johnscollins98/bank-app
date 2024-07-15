import {
  Accounts,
  Balance,
  SpendingCategory,
  Transactions,
} from "./starling-types";

export class Starling {
  constructor(private readonly apiKey: string) {}

  async getAccounts(): Promise<Accounts> {
    const res = await this.fetch("accounts");
    return res.json();
  }

  async getTransactions(
    accountId: string,
    start: Date,
    end: Date,
    defaultCategory: string,
  ): Promise<Transactions> {
    const startOfDay = new Date(start);
    startOfDay.setHours(0, 0, 0);

    const endOfDay = new Date(end);
    endOfDay.setHours(23, 59, 59);
    const params = new URLSearchParams({
      minTransactionTimestamp: start.toISOString(),
      maxTransactionTimestamp: endOfDay.toISOString(),
    });

    const res = await this.fetch(
      `feed/account/${accountId}/category/${defaultCategory}/transactions-between?${params.toString()}`,
    );
    return res.json();
  }

  async getBalance(accountId: string): Promise<Balance> {
    const res = await this.fetch(`accounts/${accountId}/balance`);
    return res.json();
  }

  async setCategory(
    accountId: string,
    defaultCategory: string,
    transactionId: string,
    category: SpendingCategory,
  ): Promise<void> {
    await this.fetch(
      `feed/account/${accountId}/category/${defaultCategory}/${transactionId}/spending-category`,
      {
        spendingCategory: category,
        permanentSpendingCategoryUpdate: false,
        previousSpendingCategoryReferencesUpdate: false,
      },
      {
        method: "PUT",
      },
    );
  }

  private async fetch<TIn>(
    endpoint: string,
    body?: TIn,
    options: RequestInit = {},
  ): Promise<Response> {
    const response = await fetch(
      `https://api.starlingbank.com/api/v2/${endpoint}`,
      {
        ...options,
        body: body && JSON.stringify(body),
        next: { revalidate: 60 },
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          ...options.headers,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return response;
  }
}
