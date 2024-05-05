import axios, { AxiosRequestConfig } from "axios";
import {
  Accounts,
  Balance,
  SpendingCategory,
  Transactions,
} from "./starling-types";

export class Starling {
  constructor(private readonly apiKey: string) {}

  async getAccounts(): Promise<Accounts> {
    return await this.fetch("accounts");
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

    return await this.fetch(
      `feed/account/${accountId}/category/${defaultCategory}/transactions-between?${params.toString()}`,
    );
  }

  async getBalance(accountId: string): Promise<Balance> {
    return await this.fetch(`accounts/${accountId}/balance`);
  }

  async setCategory(
    accountId: string,
    defaultCategory: string,
    transactionId: string,
    category: SpendingCategory,
  ): Promise<void> {
    return await this.fetch(
      `feed/account/${accountId}/category/${defaultCategory}/${transactionId}/spending-category`,
      {
        method: "PUT",
        data: {
          spendingCategory: category,
          permanentSpendingCategoryUpdate: false,
          previousSpendingCategoryReferencesUpdate: false,
        },
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  private async fetch<TIn, TOut>(
    endpoint: string,
    options: AxiosRequestConfig<TIn> = {},
  ): Promise<TOut> {
    const response = await axios({
      ...options,
      url: `https://api.starlingbank.com/api/v2/${endpoint}`,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Cache-Control": "no-cache",
        ...options.headers,
      },
    });

    return response.data;
  }
}
