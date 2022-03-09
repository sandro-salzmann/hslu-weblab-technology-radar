import { makeFakeAccountData } from "../__test__/fixtures/account";
import { insertAccount, makeDb, restoreBackup } from "../__test__/fixtures/db";
import { AccountsDb, makeAccountsDb } from "./accounts-db";

describe("accounts db", () => {
  let accountsDb: AccountsDb;

  beforeAll(async () => {
    accountsDb = makeAccountsDb({ makeDb });
  });

  beforeEach(async () => {
    restoreBackup();
  });

  it("finds an account by id", async () => {
    const accountData = makeFakeAccountData();

    await insertAccount(accountData);

    const found = await accountsDb.findById({
      accountId: accountData.id,
      teamId: accountData.teamId,
    });
    expect(found.getAccountData()).toEqual(accountData);
  });
});
