import { AccountData } from "common";
import { AccountsDb } from "../data-access/accounts-db";
import { Id } from "../Id";

interface BuildListAccountFnProps {
  accountsDb: AccountsDb;
}
interface ListAccountFnProps {
  accountId?: string;
  teamId: string;
}
type BuildListAccountFn = (props: BuildListAccountFnProps) => ListAccountFn;
export type ListAccountFn = (props: ListAccountFnProps) => Promise<AccountData>;

export const buildListAccount: BuildListAccountFn =
  ({ accountsDb }) =>
  async ({ accountId, teamId }) => {
    if (!accountId || !Id.isValidId(accountId)) {
      throw new Error("You must supply a valid account id.");
    }
    if (!teamId || !Id.isValidId(teamId)) {
      throw new Error("You must supply a valid team id.");
    }

    const account = await accountsDb.findById({
      accountId,
      teamId,
    });

    return account.getAccountData();
  };
