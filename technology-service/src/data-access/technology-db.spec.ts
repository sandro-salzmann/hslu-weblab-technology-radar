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
    const teamIdTechnology1 = makeFakeTechnologyData({ category: "platforms" });
    const teamIdTechnology2 = makeFakeTechnologyData({ category: "tools" });
    const teamIdTechnology3 = makeFakeTechnologyData({ category: "platforms" });

    const otherTeamIdTechnology = makeFakeTechnologyData();

    const teamId = Id.makeId();
    const otherTeamId = Id.makeId();
    await insertTechnology(teamIdTechnology1, teamId);
    await insertTechnology(teamIdTechnology2, teamId);
    await insertTechnology(otherTeamIdTechnology, otherTeamId);
    await insertTechnology(teamIdTechnology3, teamId);
    await insertTechnology(makeFakeTechnologyData(), otherTeamId);
    await insertTechnology(makeFakeTechnologyData(), Id.makeId());

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
    ).rejects.toThrow("Technology not found.");
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
});
