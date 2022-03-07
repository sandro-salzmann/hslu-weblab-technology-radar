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
    expect(found.getTechnologyData()).toEqual(teamIdTechnology1);
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
    const technology = makeTechnology(makeFakeTechnologyData());
    await technologyDb.addTechnology(technology);

    const found = await technologyDb.findById({
      id: technology.getId(),
      teamId: technology.getTeamId(),
    });
    expect(found.getTechnologyData()).toEqual(technology.getTechnologyData());
  });

  it("doesn't add the same technology twice", async () => {
    const technology = makeTechnology(makeFakeTechnologyData());
    await technologyDb.addTechnology(technology);
    expect(() => technologyDb.addTechnology(technology)).rejects.toThrow(
      "Failed to add technologies."
    );
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
    expect(() =>
      technologyDb.addTechnology(makeTechnology(makeFakeTechnologyData()))
    ).rejects.toThrow("Failed to add technologies.");
  });
});
