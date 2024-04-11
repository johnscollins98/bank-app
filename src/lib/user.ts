import { Session } from 'next-auth';
import { redirect } from 'next/navigation';
import { getAccounts } from './accounts';
import { Starling } from './starling-api-service';

export default async function getUserAccount(session: Session) {
  const localAccounts = getAccounts();
  const email = session.user?.email;
  if (!email) {
    redirect('/forbidden');
  }

  const localAccount = localAccounts.find(a => a.email === email);

  if (!localAccount) {
    redirect('/forbidden');
  }

  const starling = new Starling(localAccount.apiToken);
  const accounts = await starling.getAccounts();
  const accountId = accounts.accounts[0].accountUid;
  const defaultCategory = accounts.accounts[0].defaultCategory;

  return {
    starling,
    accountId,
    defaultCategory,
    localAccount
  }
}