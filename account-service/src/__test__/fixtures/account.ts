import faker from "@faker-js/faker";
import { AccountData } from "../../account/account";
import { Id } from "./id";

export function makeFakeAccountData(overrides = {}): AccountData {
  const account: AccountData = {
    id: Id.makeId(),
    teamId: Id.makeId(),
    teamRole: faker.random.arrayElement(["MEMBER", "LEADER"]),
  };

  return {
    ...account,
    ...overrides,
  };
}
