import { makeAccount } from ".";
import { makeFakeAccountData } from "../__test__/fixtures/account";

describe("account", () => {
  it("must have a valid id", () => {
    const nullId = makeFakeAccountData({ id: null });
    expect(() => makeAccount(nullId)).toThrow("Account must have a valid id.");
    const invalidId = makeFakeAccountData({ id: "invalid" });
    expect(() => makeAccount(invalidId)).toThrow(
      "Account must have a valid id."
    );
  });
  it("must have a valid team id", () => {
    const nullId = makeFakeAccountData({ teamId: null });
    expect(() => makeAccount(nullId)).toThrow(
      "Account must have a valid teamId."
    );
    const invalidId = makeFakeAccountData({ teamId: "invalid" });
    expect(() => makeAccount(invalidId)).toThrow(
      "Account must have a valid teamId."
    );
  });
  it("must have a valid team role", () => {
    const nullRole = makeFakeAccountData({ teamRole: null });
    expect(() => makeAccount(nullRole)).toThrow(
      "Account must have a valid teamRole."
    );
    const invalidRole = makeFakeAccountData({ teamRole: "invalid" });
    expect(() => makeAccount(invalidRole)).toThrow(
      "Account must have a valid teamRole."
    );
  });
  it("defaults to member team role", () => {
    const noTeamRole = makeFakeAccountData({ teamRole: undefined });
    expect(() => makeAccount(noTeamRole)).not.toThrow();
    const account = makeAccount(noTeamRole);
    expect(account.getTeamRole()).toBe("MEMBER");
  });
  it("can have a teamRole", () => {
    const leaderRole = makeFakeAccountData({ teamRole: "LEADER" });
    expect(() => makeAccount(leaderRole)).not.toThrow();
    const account = makeAccount(leaderRole);
    expect(account.getTeamRole()).toBe("LEADER");
  });
});
