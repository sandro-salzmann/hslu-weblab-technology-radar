import { MakeDbFn } from ".";
import { makeAccount } from "../account";
import { Account } from "../account/account";

interface MakeAccountsDbFnProps {
  makeDb: MakeDbFn;
}
type MakeAccountsDbFn = (props: MakeAccountsDbFnProps) => AccountsDb;
export interface AccountsDb {
  findById: (props: { accountId: string }) => Promise<Account>;
  insertAccount: (props: {
    accountId: string;
    email: string;
  }) => Promise<Account>;
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
  insertAccount: async ({ accountId, email }): Promise<Account> => {
    const db = await makeDb();

    const team = await db.query(
      "INSERT INTO team(id) VALUES(uuid_generate_v4()) RETURNING id"
    );
    const teamResult = team.rows[0];
    if (!teamResult) throw new Error("Team could not be created.");

    const result = await db.query(
      `INSERT INTO account(id, email, team_id, team_role) VALUES($1,$2,$3,'LEADER')
      RETURNING id, team_id, team_role`,
      [accountId, email, teamResult.id]
    );
    const accountResult = result.rows[0];
    if (!accountResult) throw new Error("Failed to create account.");

    const account = makeAccount({
      id: accountResult.id,
      teamId: accountResult.team_id,
      teamRole: accountResult.team_role,
    });

    return account;
  },
});
