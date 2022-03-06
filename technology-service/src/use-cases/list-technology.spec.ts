import { makeTechnologyDb } from "../data-access/technology-db";
import { Id } from "../Id";
import {
  insertTechnology,
  makeDb,
  restoreBackup,
} from "../__test__/fixtures/db";
import { makeFakeTechnologyData } from "../__test__/fixtures/technology";
import { buildListTechnology, ListTechnologyFn } from "./list-technology";

describe("list technology", () => {
  let listTechnology: ListTechnologyFn;

  beforeAll(async () => {
    const technologyDb = makeTechnologyDb({ makeDb });
    listTechnology = buildListTechnology({ technologyDb });
  });

  beforeEach(async () => {
    restoreBackup();
  });

  it("requires a technology id", () => {
    expect(
      listTechnology({ technologyId: "", teamId: Id.makeId() })
    ).rejects.toThrow("You must supply a technology id.");
  });
  it("requires a team id", () => {
    expect(
      listTechnology({ technologyId: Id.makeId(), teamId: "" })
    ).rejects.toThrow("You must supply a team id.");
  });
  it("gets a technology by id", async () => {
    const firstTechnology = makeFakeTechnologyData();
    const secondTechnology = makeFakeTechnologyData();
    const thirdTechnology = makeFakeTechnologyData();

    const teamId = Id.makeId();
    await insertTechnology(firstTechnology, teamId);
    await insertTechnology(secondTechnology, teamId);
    await insertTechnology(thirdTechnology, Id.makeId());

    expect(
      await listTechnology({ teamId, technologyId: secondTechnology.id })
    ).toEqual(secondTechnology);
  });
});