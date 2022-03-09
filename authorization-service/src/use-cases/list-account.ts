import { AccountData } from "../account/account";
import { AccountsDb } from "../data-access/accounts-db";
import { Id } from "../Id";

interface BuildListAccountFnProps {
  accountsDb: AccountsDb;
}
interface ListAccountFnProps {
  accountId?: string;
  email?: string;
}
type BuildListAccountFn = (props: BuildListAccountFnProps) => ListAccountFn;
export type ListAccountFn = (props: ListAccountFnProps) => Promise<AccountData>;

export const buildListAccount: BuildListAccountFn =
  ({ accountsDb }) =>
  async ({ accountId, email }) => {
    if (!accountId || !Id.isValidId(accountId)) {
      throw new Error("You must supply a valid account id.");
    }
    if (!email) {
      throw new Error("You must supply a email.");
    }

    try {
      const account = await accountsDb.findById({
        accountId,
      });
      return account.getAccountData();
    } catch (error) {
      // @ts-ignore
      if (error?.message === "Account not found.") {
        const account = await accountsDb.insertAccount({ accountId, email });
        return account.getAccountData();
      }
    }
    throw new Error("Failed to find or create account.");
  };
