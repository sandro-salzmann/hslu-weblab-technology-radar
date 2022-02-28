import { makeAccountsDb } from "../data-access/accounts-db";
import { makeFakeAccountData } from "../__test__/fixtures/account";
import { insertAccount, makeDb, restoreBackup } from "../__test__/fixtures/db";
import { buildListAccount, ListAccountFn } from "./list-account";

describe("list account", () => {
  let listAccount: ListAccountFn;

  beforeAll(async () => {
    const accountsDb = makeAccountsDb({ makeDb });
    listAccount = buildListAccount({ accountsDb });
  });

  beforeEach(async () => {
    restoreBackup();
  });

  it("requires a valid account id", () => {
    expect(listAccount({ accountId: "invalid" })).rejects.toThrow(
      "You must supply a valid account id."
    );
  });
  it("gets an account by id", async () => {
    const firstAccount = makeFakeAccountData();
    const secondAccount = makeFakeAccountData();
    const thirdAccount = makeFakeAccountData();

    await insertAccount(firstAccount);
    await insertAccount(secondAccount);
    await insertAccount(thirdAccount);

    expect(await listAccount({ accountId: secondAccount.id })).toEqual(
      secondAccount
    );
  });
});
