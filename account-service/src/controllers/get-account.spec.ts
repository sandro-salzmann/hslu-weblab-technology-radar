import { makeFakeAccountData } from "../__test__/fixtures/account";
import { makeGetAccount } from "./get-account";

describe("get account controller", () => {
  it("successfully gets an account", async () => {
    const fakeAccount = makeFakeAccountData();
    const getAccount = makeGetAccount({
      listAccount: async ({ accountId }) =>
        accountId === fakeAccount.id ? fakeAccount : makeFakeAccountData(),
    });
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
      params: { id: fakeAccount.id },
    };
    const expected = {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 200,
      body: fakeAccount,
    };
    // @ts-expect-error because the request object is incomplete on purpose
    const actual = await getAccount(request);
    expect(actual).toEqual(expected);
  });
  it("reports user errors", async () => {
    const getAccount = makeGetAccount({
      listAccount: () => {
        throw Error("Oops!");
      },
    });
    const fakeAccount = makeFakeAccountData();
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
      params: { id: fakeAccount.id },
    };
    const expected = {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 400,
      body: { error: "Oops!" },
    };
    // @ts-expect-error because the request object is incomplete on purpose
    const actual = await getAccount(request);
    expect(actual).toEqual(expected);
  });
});
