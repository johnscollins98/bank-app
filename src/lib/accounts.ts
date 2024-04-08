export interface Account {
  email: string;
  apiToken: string;
  monthBarrier: 'last' | 'calendar';
  day: number;
}

export const assertIsAccounts = (entry: unknown): entry is Account[] => {
  if (!(entry instanceof Array)) throw new Error("ACCOUNTS must be an array.");

  // entry is an array
  return entry.every((e: unknown, index: number) => {
    if (typeof e === 'object' && e !== null) {
      if (!('email' in e)) throw new Error(`Account ${index} is missing an email.`);
      if (typeof e.email !== 'string') throw new Error(`Account ${index} email must be a string.`);

      if (!('apiToken' in e)) throw new Error(`Account ${index} is missing an apiToken`);
      if (typeof e.apiToken !== 'string') throw new Error(`Account ${index} apiToken must be a string.`);

      if (!('monthBarrier' in e)) throw new Error(`Account ${index} is missing a monthBarrier.`);
      if (e.monthBarrier !== 'last' && e.monthBarrier !== 'calendar') throw new Error(`Account ${index} monthBarrier must equal 'last' or 'calendar'.`);

      if (!('day' in e)) throw new Error(`Account ${index} is missing a day.`);
      if (typeof e.day !== 'number') throw new Error(`Account ${index} day must be a number.`);

      return true;
    }
    throw new Error(`Account ${index} is not a valid object.`);
  });
};
