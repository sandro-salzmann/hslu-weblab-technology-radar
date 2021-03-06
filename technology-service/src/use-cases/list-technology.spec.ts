import { makeTechnologyDb } from "../data-access/technology-db";
import { Id } from "../Id";
import {
  insertTechnology,
  makeDb,
  restoreBackup
} from "../__test__/fixtures/db";
import { makeFakeTechnologyData } from "../__test__/fixtures/technology";
import { buildListTechnology, ListTechnologyFn } from "./list-technology";

describe("list technology tests", () => {
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
      () => listTechnology({
        technologyId: "",
        teamId: Id.makeId(),
        teamRole: "LEADER",
      })
    ).rejects.toThrow("You must supply a technology id.");
  });
  it("requires a team id", () => {
    expect(
      listTechnology({
        technologyId: Id.makeId(),
        teamId: "",
        teamRole: "LEADER",
      })
    ).rejects.toThrow("You must supply a team id.");
  });
  it("doesn't allow accounts with a member role to view unpublished technologies", async () => {
    const unpublishedTechnology = makeFakeTechnologyData({ published: false });
    await insertTechnology(unpublishedTechnology);
    expect(
      listTechnology({
        technologyId: unpublishedTechnology.id,
        teamId: unpublishedTechnology.teamId,
        teamRole: "MEMBER",
      })
    ).rejects.toThrow(
      "You don't have permissions to view unpublished technologies."
    );
  });
  it("gets a technology by id", async () => {
    const teamId = Id.makeId();
    const firstTechnology = makeFakeTechnologyData({ teamId });
    const secondTechnology = makeFakeTechnologyData({ teamId });
    const thirdTechnology = makeFakeTechnologyData({ teamId: Id.makeId() });

    await insertTechnology(firstTechnology);
    await insertTechnology(secondTechnology);
    await insertTechnology(thirdTechnology);

    expect(
      listTechnology({
        teamId,
        technologyId: secondTechnology.id,
        teamRole: "LEADER",
      })
    ).resolves.toEqual(secondTechnology);
  });
});
