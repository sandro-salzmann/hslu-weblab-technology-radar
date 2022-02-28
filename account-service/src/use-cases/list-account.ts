import { AccountData } from "../account/account";
import { AccountsDb } from "../data-access/accounts-db";
import { Id } from "../Id";

interface BuildListAccountFnProps {
  accountsDb: AccountsDb;
}
interface ListAccountFnProps {
  accountId?: string;
}
type BuildListAccountFn = (props: BuildListAccountFnProps) => ListAccountFn;
export type ListAccountFn = (props: ListAccountFnProps) => Promise<AccountData>;

export const buildListAccount: BuildListAccountFn =
  ({ accountsDb }) =>
  async ({ accountId }) => {
    if (!accountId || !Id.isValidId(accountId)) {
      throw new Error("You must supply a valid account id.");
    }

    const account = await accountsDb.findById({
      accountId,
    });

    return account.getAccountData();
  };
