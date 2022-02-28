import { MakeDbFn } from ".";
import { makeAccount } from "../account";
import { Account } from "../account/account";

interface MakeAccountsDbFnProps {
  makeDb: MakeDbFn;
}
type MakeAccountsDbFn = (props: MakeAccountsDbFnProps) => AccountsDb;
export interface AccountsDb {
  findById: (props: { accountId: string }) => Promise<Account>;
}

export const makeAccountsDb: MakeAccountsDbFn = ({ makeDb }) => ({
  findById: async ({ accountId }): Promise<Account> => {
    const db = await makeDb();

    const result = await db.query(
      "SELECT id, team_id, team_role FROM account WHERE id = $1",
      [accountId]
    );
    const accountResult = result.rows[0];
    if (!accountResult) throw new Error("Account not found.");

    const account = makeAccount({
      id: accountResult.id,
      teamId: accountResult.team_id,
      teamRole: accountResult.team_role,
    });

    return account;
  },
});
