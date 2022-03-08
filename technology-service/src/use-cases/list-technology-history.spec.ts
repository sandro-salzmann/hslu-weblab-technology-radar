import { HistoryEvent } from "common";
import { makeTechnologyDb } from "../data-access/technology-db";
import { Id } from "../Id";
import {
  insertTechnology,
  insertTechnologyHistory,
  makeDb,
  restoreBackup,
} from "../__test__/fixtures/db";
import {
  makeFakeHistoryEvent,
  makeFakeTechnologyData,
} from "../__test__/fixtures/technology";
import {
  buildListTechnologyHistory,
  ListTechnologyHistoryFn,
} from "./list-technology-history";

describe("list technology history tests", () => {
  let listTechnologyHistory: ListTechnologyHistoryFn;

  beforeAll(async () => {
    const technologyDb = makeTechnologyDb({ makeDb });
    listTechnologyHistory = buildListTechnologyHistory({ technologyDb });
  });

  beforeEach(async () => {
    restoreBackup();
  });

  it("requires a technology id", () => {
    expect(() =>
      listTechnologyHistory({
        technologyId: "",
        teamId: Id.makeId(),
      })
    ).rejects.toThrow("You must supply a technology id.");
  });
  it("requires a team id", () => {
    expect(
      listTechnologyHistory({
        technologyId: Id.makeId(),
        teamId: "",
      })
    ).rejects.toThrow("You must supply a team id.");
  });

  it("gets a technology history", async () => {
    const teamId = Id.makeId();
    const firstTeamTechnology = makeFakeTechnologyData({ teamId });
    const firstTeamTechnology2 = makeFakeTechnologyData({ teamId });
    const firstTeamTechnology3 = makeFakeTechnologyData({ teamId });
    const secondTeamTechnology = makeFakeTechnologyData({
      teamId: Id.makeId(),
    });
    const thirdTeamTechnology = makeFakeTechnologyData({ teamId: Id.makeId() });
    await insertTechnology(firstTeamTechnology);
    await insertTechnology(firstTeamTechnology2);
    await insertTechnology(firstTeamTechnology3);
    await insertTechnology(secondTeamTechnology);
    await insertTechnology(thirdTeamTechnology);

    const historyEvents: HistoryEvent[] = [makeFakeHistoryEvent()];
    const changedBy = Id.makeId();
    await insertTechnologyHistory({
      teamId,
      changedBy,
      technologyId: firstTeamTechnology.id,
      historyEvents: [makeFakeHistoryEvent(), makeFakeHistoryEvent()],
    });
    await insertTechnologyHistory({
      teamId,
      changedBy,
      technologyId: firstTeamTechnology2.id,
      historyEvents,
    });
    await insertTechnologyHistory({
      teamId: secondTeamTechnology.teamId,
      changedBy,
      technologyId: secondTeamTechnology.id,
      historyEvents: [makeFakeHistoryEvent()],
    });

    expect(
      listTechnologyHistory({ teamId, technologyId: firstTeamTechnology2.id })
    ).resolves.not.toThrow();
    const history = await listTechnologyHistory({
      teamId,
      technologyId: firstTeamTechnology2.id,
    });
    expect(history[0]).toBeDefined();
    expect(history[0].changedBy).toEqual(changedBy);
    expect(history[0].timestamp).toBeDefined();
    expect(history[0].historyEvents).toEqual(historyEvents);
  });
  it("gets empty list if not authorized", async () => {
    const teamId = Id.makeId();
    const firstTechnology = makeFakeTechnologyData({ teamId });
    const secondTechnology = makeFakeTechnologyData({ teamId: Id.makeId() });
    await insertTechnology(firstTechnology);
    await insertTechnology(secondTechnology);

    const changedBy = Id.makeId();
    await insertTechnologyHistory({
      teamId,
      changedBy,
      technologyId: firstTechnology.id,
      historyEvents: [makeFakeHistoryEvent()],
    });
    await insertTechnologyHistory({
      teamId: secondTechnology.teamId,
      changedBy,
      technologyId: secondTechnology.id,
      historyEvents: [makeFakeHistoryEvent()],
    });

    expect(
      listTechnologyHistory({
        teamId,
        technologyId: secondTechnology.id,
      })
    ).resolves.toEqual([]);
  });
});
