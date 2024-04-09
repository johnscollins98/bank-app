export interface Account {
  email: string;
  apiToken: string;
  monthBarrier: 'last' | 'calendar';
  day: number;
}

const isArray = (entry: unknown): entry is unknown[] => {
  return Array.isArray(entry);
}

export const isAccount = (entry: unknown, index: number): entry is Account => {
  if (typeof entry === 'object' && entry !== null) {
    if (!('email' in entry)) throw new Error(`Account ${index} is missing an email.`);
    if (!('apiToken' in entry)) throw new Error(`Account ${index} is missing an apiToken`);
    if (!('monthBarrier' in entry)) throw new Error(`Account ${index} is missing a monthBarrier.`);
    if (!('day' in entry)) throw new Error(`Account ${index} is missing a day.`);

    const { email, apiToken, monthBarrier, day } = entry;

    if (typeof email !== 'string') throw new Error(`Account ${index} email must be a string.`);
    if (typeof apiToken !== 'string') throw new Error(`Account ${index} apiToken must be a string.`);
    if (monthBarrier !== 'last' && monthBarrier !== 'calendar') throw new Error(`Account ${index} monthBarrier must equal 'last' or 'calendar'.`);
    if (typeof day !== 'number') throw new Error(`Account ${index} day must be a number.`);

    const obj = { email, apiToken, monthBarrier, day } satisfies Account;
    return true;
  } else {
    throw new Error(`Account ${index} is not a valid object.`);
  }
}

export const isAccounts = (entry: unknown): entry is Account[] => {
  if (!(isArray(entry))) throw new Error("ACCOUNTS must be an array.");

  const res = entry.every(isAccount);

  if (res) {
    entry satisfies Account[];
    return true;
  }

  return false;
};
