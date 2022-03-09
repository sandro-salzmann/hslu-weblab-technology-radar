import { makeTechnology } from "../technology";
import {
  insertTechnology,
  makeDb,
  restoreBackup,
} from "../__test__/fixtures/db";
import { Id } from "../__test__/fixtures/id";
import { makeFakeTechnologyData } from "../__test__/fixtures/technology";
import { makeTechnologyPreviewOf } from "../__test__/fixtures/technology-preview";
import { makeTechnologyDb, TechnologyDb } from "./technology-db";

describe("technology db", () => {
  let technologyDb: TechnologyDb;

  beforeAll(async () => {
    technologyDb = makeTechnologyDb({ makeDb });
  });

  beforeEach(async () => {
    restoreBackup();
  });

  const insertExampleTechnologies = async () => {
    const teamId = Id.makeId();
    const otherTeamId = Id.makeId();
    const teamIdTechnology1 = makeFakeTechnologyData({
      category: "platforms",
      teamId,
    });
    const teamIdTechnology2 = makeFakeTechnologyData({
      category: "tools",
      teamId,
    });
    const teamIdTechnology3 = makeFakeTechnologyData({
      category: "platforms",
      teamId,
    });

    const otherTeamIdTechnology = makeFakeTechnologyData({
      teamId: otherTeamId,
    });

    await insertTechnology(teamIdTechnology1);
    await insertTechnology(teamIdTechnology2);
    await insertTechnology(otherTeamIdTechnology);
    await insertTechnology(teamIdTechnology3);
    await insertTechnology(makeFakeTechnologyData({ teamId: otherTeamId }));
    await insertTechnology(makeFakeTechnologyData({ teamId: Id.makeId() }));

    return {
      teamIdTechnology1,
      teamIdTechnology2,
      teamIdTechnology3,
      otherTeamIdTechnology,
      teamId,
    };
  };

  it("finds a team technology by id", async () => {
    const { teamIdTechnology1, teamId } = await insertExampleTechnologies();

    const found = await technologyDb.findById({
      teamId,
      id: teamIdTechnology1.id,
    });
    expect(found.getId()).toEqual(teamIdTechnology1.id);
  });

  it("doesn't find a technology by id from another team", async () => {
    const { otherTeamIdTechnology, teamId } = await insertExampleTechnologies();

    expect(
      async () =>
        await technologyDb.findById({
          teamId,
          id: otherTeamIdTechnology.id,
        })
    ).rejects.toThrow("Failed to find technology.");
  });

  it("previews team technologies", async () => {
    const { teamIdTechnology1, teamIdTechnology2, teamIdTechnology3, teamId } =
      await insertExampleTechnologies();

    const found = await technologyDb.previewAll({ teamId });
    expect(found.length).toEqual(3);
    expect(found[0].getTechnologyPreviewData()).toEqual(
      makeTechnologyPreviewOf(teamIdTechnology1)
    );
    expect(found[1].getTechnologyPreviewData()).toEqual(
      makeTechnologyPreviewOf(teamIdTechnology2)
    );
    expect(found[2].getTechnologyPreviewData()).toEqual(
      makeTechnologyPreviewOf(teamIdTechnology3)
    );
  });

  it("previews technologies from category", async () => {
    const { teamIdTechnology1, teamIdTechnology3, teamId } =
      await insertExampleTechnologies();

    const foundPlatforms = await technologyDb.previewAll({
      teamId,
      category: "platforms",
    });
    expect(foundPlatforms.length).toEqual(2);
    expect(foundPlatforms[0].getTechnologyPreviewData()).toEqual(
      makeTechnologyPreviewOf(teamIdTechnology1)
    );
    expect(foundPlatforms[1].getTechnologyPreviewData()).toEqual(
      makeTechnologyPreviewOf(teamIdTechnology3)
    );
  });

  it("previews an empty list when there are no technologies with the category", async () => {
    const { teamId } = await insertExampleTechnologies();

    const foundNone = await technologyDb.previewAll({
      teamId,
      category: "languages",
    });
    expect(foundNone.length).toEqual(0);
  });

  it("adds a technology", async () => {
    const technology = makeTechnology(
      makeFakeTechnologyData({ publishedAt: null, published: false })
    );
    await technologyDb.addTechnology(technology, Id.makeId());

    const found = await technologyDb.findById({
      id: technology.getId(),
      teamId: technology.getTeamId(),
    });
    expect(found.getTechnologyData()).toEqual(technology.getTechnologyData());
  });

  it("doesn't add the same technology twice", async () => {
    const technology = makeTechnology(makeFakeTechnologyData());
    await technologyDb.addTechnology(technology, Id.makeId());
    expect(technologyDb.addTechnology(technology, Id.makeId())).rejects.toThrow(
      "Failed to add technologies."
    );
  });

  it("doesn't add a technology without valid account id", async () => {
    const technology = makeTechnology(makeFakeTechnologyData());
    expect(technologyDb.addTechnology(technology, "Invalid")).rejects.toThrow(
      "Failed to add technologies."
    );
  });

  it("updates a technology", async () => {
    const technology = makeTechnology(makeFakeTechnologyData());
    await technologyDb.addTechnology(technology, Id.makeId());

    const patchedTechnology = makeTechnology(
      makeFakeTechnologyData({
        id: technology.getId(),
        teamId: technology.getTeamId(),
      })
    );
    await technologyDb.update(patchedTechnology, Id.makeId());

    const found = await technologyDb.findById({
      id: technology.getId(),
      teamId: technology.getTeamId(),
    });
    const foundData = found.getTechnologyData();
    const shouldData = patchedTechnology.getTechnologyData();
    expect(foundData).toEqual(shouldData);
  });

  it("merges missing technology data with existing database data when updating", async () => {
    const technology = makeTechnology(makeFakeTechnologyData());
    await technologyDb.addTechnology(technology, Id.makeId());

    const patchedTechnology = makeTechnology(
      makeFakeTechnologyData({
        id: technology.getId(),
        teamId: technology.getTeamId(),
        published: false,
        maturityDescription: undefined,
        maturity: undefined,
      })
    );
    await technologyDb.update(patchedTechnology, Id.makeId());

    const found = await technologyDb.findById({
      id: technology.getId(),
      teamId: technology.getTeamId(),
    });
    const foundData = found.getTechnologyData();
    const shouldData = {
      ...patchedTechnology.getTechnologyData(),
      maturityDescription: technology.getMaturityDescription(),
      maturity: technology.getMaturity(),
    };
    expect(foundData).toEqual(shouldData);
  });
  it("saves and gets history events", async () => {
    const technology = makeTechnology(makeFakeTechnologyData());
    await technologyDb.addTechnology(technology, Id.makeId());

    const patchedTechnology = makeTechnology(
      makeFakeTechnologyData({
        id: technology.getId(),
        teamId: technology.getTeamId(),
        published: false,
        name: "name",
      })
    );
    patchedTechnology.publish();
    const createdEvent = { type: "published" };

    const changedBy = Id.makeId();
    await technologyDb.update(patchedTechnology, changedBy);
    const historyEvents = await technologyDb.getHistoryEvents({
      teamId: technology.getTeamId(),
      technologyId: technology.getId(),
    });
    expect(historyEvents[0]).toBeDefined();
    expect(historyEvents[0].changedBy).toEqual(changedBy);
    expect(historyEvents[0].timestamp).toBeDefined();
    expect(historyEvents[0].historyEvents).toEqual([createdEvent]);

    patchedTechnology.setName("new-name");
    const createdEvent2 = {
      type: "nameChanged",
      prevValue: "name",
      newValue: "new-name",
    };
    await technologyDb.update(patchedTechnology, changedBy);
    const historyEvents2 = await technologyDb.getHistoryEvents({
      teamId: technology.getTeamId(),
      technologyId: technology.getId(),
    });

    expect(historyEvents2[0]).toBeDefined();
    expect(historyEvents2[0].changedBy).toEqual(changedBy);
    expect(historyEvents2[0].timestamp).toBeDefined();
    expect(historyEvents2[0].historyEvents).toEqual([createdEvent]);
    expect(historyEvents2[1]).toBeDefined();
    expect(historyEvents2[1].changedBy).toEqual(changedBy);
    expect(historyEvents2[1].timestamp).toBeDefined();
    expect(historyEvents2[1].historyEvents).toEqual([
      createdEvent,
      createdEvent2,
    ]);
  });

  it("doesn't get history events from another teams technology", async () => {
    const otherTeamId = Id.makeId();
    const technology = makeTechnology(makeFakeTechnologyData());
    await technologyDb.addTechnology(technology, otherTeamId);

    const patchedTechnology = makeTechnology(
      makeFakeTechnologyData({
        id: technology.getId(),
        teamId: technology.getTeamId(),
        published: false,
      })
    );
    patchedTechnology.publish();
    patchedTechnology.setName("new-name");
    await technologyDb.update(patchedTechnology, technology.getTeamId());

    const noHistory = await technologyDb.getHistoryEvents({
      teamId: Id.makeId(),
      technologyId: technology.getId(),
    });
    expect(noHistory).toEqual([]);
    const history = await technologyDb.getHistoryEvents({
      teamId: technology.getTeamId(),
      technologyId: technology.getId(),
    });
    expect(history[0].historyEvents).toHaveLength(2);
  });

  it("doesnt throw internal errors (previewAll)", () => {
    // @ts-ignore to test internal db errors
    const technologyDb = makeTechnologyDb({ makeDb: () => null });
    expect(() =>
      technologyDb.previewAll({ teamId: Id.makeId() })
    ).rejects.toThrow("Failed to find technologies.");
  });

  it("doesnt throw internal errors (findById)", () => {
    // @ts-ignore to test internal db errors
    const technologyDb = makeTechnologyDb({ makeDb: () => null });
    expect(() =>
      technologyDb.findById({ teamId: Id.makeId(), id: Id.makeId() })
    ).rejects.toThrow("Failed to find technology.");
  });

  it("doesnt throw internal errors (addTechnology)", () => {
    // @ts-ignore to test internal db errors
    const technologyDb = makeTechnologyDb({ makeDb: () => null });
    expect(
      technologyDb.addTechnology(
        makeTechnology(makeFakeTechnologyData()),
        Id.makeId()
      )
    ).rejects.toThrow("Failed to add technologies.");
  });

  it("doesnt throw internal errors (update)", () => {
    // @ts-ignore to test internal db errors
    const technologyDb = makeTechnologyDb({ makeDb: () => null });
    expect(
      technologyDb.update(makeTechnology(makeFakeTechnologyData()), Id.makeId())
    ).rejects.toThrow("Failed to update technology.");
  });

  it("doesnt throw internal errors (getHistoryEvents)", () => {
    // @ts-ignore to test internal db errors
    const technologyDb = makeTechnologyDb({ makeDb: () => null });
    expect(
      technologyDb.getHistoryEvents({
        teamId: Id.makeId(),
        technologyId: Id.makeId(),
      })
    ).rejects.toThrow("Failed to find history.");
  });
});
