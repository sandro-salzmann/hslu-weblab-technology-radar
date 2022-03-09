import { MakeDbFn } from ".";
import { makeAccount } from "../account";
import { Account } from "../account/account";

interface MakeAccountsDbFnProps {
  makeDb: MakeDbFn;
}
type MakeAccountsDbFn = (props: MakeAccountsDbFnProps) => AccountsDb;
export interface AccountsDb {
  findById: (props: { accountId: string; teamId: string }) => Promise<Account>;
}

export const makeAccountsDb: MakeAccountsDbFn = ({ makeDb }) => ({
  findById: async ({ accountId, teamId }): Promise<Account> => {
    const db = await makeDb();

    const result = await db.query(
      "SELECT id, team_id, team_role, email FROM account WHERE id = $1 AND team_id = $2",
      [accountId, teamId]
    );
    const accountResult = result.rows[0];
    if (!accountResult) throw new Error("Account not found.");

    const account = makeAccount({
      id: accountResult.id,
      teamId: accountResult.team_id,
      teamRole: accountResult.team_role,
      email: accountResult.email,
    });

    return account;
  },
});
